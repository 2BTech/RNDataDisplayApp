import React, { FC, useState, } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView, Image, } from 'react-native';
import { ConnectedProps, connect, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DeviceId } from "../../redux/slices/deviceSlice";
import { SettingObj, setDeviceSettings } from "../../redux/slices/deviceSettingsSlice";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { bluetoothCommand, getUniqueKeyForCommand, queueMessageForWrite, queueMultipleMessagesForWrite } from "../../redux/slices/bluetoothCommandSlice";
import { bluetoothWriteCommand, bluetoothWriteMultipleCommands } from "../../redux/middleware/Bluetooth/BluetoothWriteCommandMiddleware";
import { BuildChangeSettingsCommand, BuildFirmwareUploadMessage, requestSettingsCommand } from "../../Utils/Bluetooth/BluetoothCommandUtils";
import ButtonSettingComponent from "./Components/ButtonSettingsComponent";
import { setFirmwareDevice, setFirmwareSections } from "../../redux/slices/firmwareSlice";
import { queueNextFirmwareSection } from "../../redux/middleware/Firmware/writeFirmwareMiddleware";
import { checkFirmwareFileExists, getFirmwareFilePath } from "../../Utils/Firmware/DownloadFirmwareUtils";
import * as RNFS from 'react-native-fs';

import OpenSettingComponent from "./Components/OpenSettingComponent";
import ToggleSettingComponent from "./Components/ToggleSettingComponent";
import OptionsSettingComponent from "./Components/OptionsSettingComponent";
import MenuSettingsComponent from "./Components/MenuSettingComponent";
import ValueSettingComponent from "./Components/ValueSettingComponent";
import DownloadFirmwareComponent from "./Components/DownloadFirmwareComponent";

interface SettingsPageProps extends PropsFromRedux {
    deviceKey: DeviceId;
}

export type ChangedSettingsMap = {
    [key: string]: SettingObj;
}

const DownloadFirmware = async (deviceKey: DeviceId) => {
    
}

// Read in the existing firmware file, chunk the contents, and queue the chunks to be written to the device
const writeFirmwareToDevice = async (deviceKey: DeviceId, deviceName: string, updateFirmware: (deviceKey: DeviceId, firmware: string[]) => void) => {

    // Check if a firmware file exists
    const firmwareFileExists = await checkFirmwareFileExists(deviceName);

    // If the firmware file does not exist return
    if (!firmwareFileExists) {
        // Log the error
        console.log('Firmware file does not exist');
        return;
    }

    // Get the firmware file path
    const firmwareFilePath = await getFirmwareFilePath(deviceName);

    // If the firmware file path is undefined return
    if (firmwareFilePath == undefined) {
        // Log the error
        console.log('Firmware file path is undefined');
        return;
    }

    // Read the firmware file
    const firmwareFileContents = await RNFS.readFile(firmwareFilePath);

    // Size of each chunk of firmware to send to the device
    const firmwareChunkSize: number = 2019; //995 + 1024 + 2048;
    // const firmwareChunkSize: number = 4067; //995 + 1024 + 2048;

    // Convert the firmware file contents into chuncks of firmwareChunkSize bytes
    let firmware: string[] = [];

    for (let i = 0; i < firmwareFileContents.length; i += firmwareChunkSize) {
        firmware.push(firmwareFileContents.substring(i, i + firmwareChunkSize));
    }

    // Update the firmware slice with the firmware chunks
    updateFirmware(deviceKey, firmware);
}

const SettingsPage: FC<SettingsPageProps> = React.memo(({deviceKey, applyUpdatedSettings, writeUpdatedSettings, deviceSettings, querySettings, queueMultipleMessages, isWritingFirmware, updateFirmware, currentSection, totalSections, deviceName}) => {
    // Access the device settings objects
    // const deviceSettings: SettingObj[] = useSelector((state: RootState) => state.deviceSettingsSlice[deviceKey]) || [];
    const deviceID: string = useSelector((state: RootState) => state.deviceSlice.deviceDefinitions[deviceKey].deviceName);
    const [isDownloadingFirmware, setIsDownloadingFirmware] = useState<boolean>(false);
    const [firmwareDownloadProgress, setFirmwareDownloadProgress] = useState<number>(0);
    const [numFirmwareSections, setNumFirmwareSections] = useState<number>(0);

    let defaultExpandedMap:{[key: string]: boolean} = {

    };
    deviceSettings.forEach(set => {
        defaultExpandedMap[set.description] = false;
    });
    const [expandedMap, updateExpandedMap] = useState(defaultExpandedMap);

    const [changedSettings, updateChangedSettings] = useState<ChangedSettingsMap>({});
    const onChangeSetting: (setting: SettingObj) => void = (setting: SettingObj) => {
        updateChangedSettings({
            ...changedSettings,
            [setting.description]: setting,
        });
    }

    const updateEntry: ((col: (SettingObj[] | undefined), updatedSettings: SettingObj[]) => (SettingObj[])) = (col: (SettingObj[] | undefined), updatedSettings: SettingObj[]) => {
        if (col == undefined || col.length == 0) {
            return col || [];
        }

        let updatedCol: SettingObj[] = [];
        for (let i = 0; i < col.length; i++) {
            let updated = updatedSettings.find(set => set.description == col[i].description);
            // for (let j = 0; j < updatedSettings.length; j++) {
            //     if (updatedSettings[j].description == col[i].description) {
            //         updated = updatedSettings[j];
            //         break;
            //     }
            // }

            if (updated != undefined) {
                updatedSettings = updatedSettings.filter(set => set.description != updated?.description);
            }

            let temp: SettingObj = {
                currentVal: updated ? updated.currentVal : col[i].currentVal,
                description: col[i].description,
                id: col[i].id,
                isDevice: col[i].isDevice,
                type: col[i].type,
                valueType: col[i].valueType,

                items: updateEntry(col[i].items, updatedSettings),
            }

            if (updated) {
                console.log('Updating setting: ', col[i].description, ' - ', col[i].currentVal, ' to ', temp.currentVal);
            }
            updatedCol.push(temp);
        }
        return updatedCol;
    }

    const onSaveClicked: (() => void) = () => {
        console.log('===========================================================');
        console.log('Save clicked. Changed settings: ', changedSettings);

        const updated: SettingObj[] = Object.values(changedSettings).filter(set => set.id != 'Firmware Update');
        
        let updatedSettings = updateEntry(deviceSettings, updated).filter(set => set.id != 'Firmware Update');
        console.log('Updated: ', JSON.stringify(updatedSettings));

        // console.log('Updated settings: ', updatedSettings);

        applyUpdatedSettings(updatedSettings, deviceKey);

        // Create list of all values to send to device
        let toWrite: SettingObj[] = [];

        updated.forEach(setting => {
            let temp: any = {
                ...setting,
            };

            temp['newValue'] = temp['currentVal'];
            delete temp['currentVal'];

            toWrite.push(temp);
        });

        updateChangedSettings({});
        writeUpdatedSettings(toWrite, deviceKey);
    }

    const onRefreshClicked: (() => void) = () => {
        updateExpandedMap(defaultExpandedMap);
        updateChangedSettings({});
    }

    const renderDownloadProgressView = () => {
        return (
            <Modal visible={isDownloadingFirmware || isWritingFirmware} transparent animationType="none">
                <View style={styles.overlay}>
                    <Text style={styles.downloadTitle}>{isWritingFirmware ? 'Pushing Firmware' : 'Downloading Firmware'}</Text>
                    <Text style={styles.downloadTitle}>Progresss: { isWritingFirmware ? currentSection : firmwareDownloadProgress} / {isWritingFirmware ? totalSections : numFirmwareSections}</Text>
                    <View style={{height: '10%'}} />
                    <Image source={require('../../gifs/loader.gif')} style={{width: 50, height: 50, }} />
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.container}>
            {
                renderDownloadProgressView()
            }
            <ScrollView>
                {
                    deviceSettings.map(setting => {
                        switch (setting.type) {
                            case 'value':
                                return <ValueSettingComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} />

                            case 'open':
                                return <OpenSettingComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} />

                            case 'toggle':
                                return <ToggleSettingComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} />

                            case 'options':
                                return <OptionsSettingComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} />

                            case 'menu':
                                return <MenuSettingsComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} expandedMap={expandedMap} updateExpandedMap={updateExpandedMap} changedSettings={changedSettings} />

                            case 'download':
                                return <DownloadFirmwareComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} deviceName={deviceName} />

                            case 'button':
                                return <ButtonSettingComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} onPress={() => {
                                    if (setting.id == 'Firmware Update') {
                                        writeFirmwareToDevice(deviceKey, deviceName, updateFirmware);
                                    }}}
                                        />
                        }
                    })
                }
            </ScrollView>
            <View style={styles.buttonContainerStyle}>
                <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={onSaveClicked}>
                    <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={onRefreshClicked}>
                    <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Refresh</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',

        backgroundColor: 'white',
    },

    buttonContainerStyle: {
        display: 'flex',
        flexDirection: "row", 
        justifyContent: 'space-around',
        paddingVertical: 10,

        width: '100%',

        borderTopWidth: 2,
    },

    button: {
        borderColor: 'black',
        borderWidth: 1,

        marginTop: 10,
        marginBottom: 10,
        width: '33%',
        marginLeft: '5%',
        marginRight: '5%',

        // backgroundColor: '#d3d3d3',
        backgroundColor: '#055D9C',

        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 10,

        borderBottomWidth: 2,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },

    textSmall: {
        fontSize: 16,
        color: 'black',
    },
    seperator: {
        height: 12
    },

    defaultTextStyle: {
        color: 'black',
        fontSize: 12,
    },

    defaultButton: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10, 
        marginRight: 10, 
        borderRadius: 10,
    },



    overlay: {
        flex: 1,
        position: 'absolute',
        left: '5%',
        top: '5%',
        // opacity: 0.5,
        backgroundColor: '#CCFFFF',
        width: '90%',
        height: '90%',

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 2,
    },
    downloadTitle: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
    },
    progressText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
})

const mapStateToProps = (state: RootState, ownProps: any) => {
    let sets = state.deviceSettingsSlice[ownProps.deviceKey] || [];

    console.log('Device settings: ', ownProps.deviceKey);

    // Always add the download PAM firmware option
    sets.push({
        currentVal: '',
        description: 'Download PAM Firmware',
        id: 'Download Firmware',
        isDevice: false,
        items: [],
        type: 'download',
        valueType: '',
    });

    // If this is not the default device, add the option to upload data
    // FLAG: to do, once more devices are integrated, I will need to filter this by device type
    if (ownProps.deviceKey != 'Default') {
        sets.push({
            currentVal: '',
            description: 'Firmware Update',
            id: 'Firmware Update',
            isDevice: false,
            items: [],
            type: 'button',
            valueType: '',
        });
    }

    return {
        deviceSettings: sets,
        isWritingFirmware: state.firmwareSlice.isWriting,
        totalSections: state.firmwareSlice.totalSections,
        currentSection: state.firmwareSlice.currentSection,
        deviceName: state.deviceSlice.deviceDefinitions[ownProps.deviceKey].deviceName,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
    return {
        applyUpdatedSettings: (settings: SettingObj[], deviceKey: DeviceId) => {
            dispatch(setDeviceSettings({
                deviceKey,
                settings,
            }))
        },

        writeUpdatedSettings: (settings: SettingObj[], deviceKey: DeviceId) => {
            // console.log('Writing setting: ', settings);
            dispatch(bluetoothWriteCommand({
                deviceKey,
                command: BuildChangeSettingsCommand(settings),
                key: getUniqueKeyForCommand(),
            }));
        },

        querySettings: (deviceKey: DeviceId) => {
            dispatch(bluetoothWriteCommand({
                deviceKey,
                command: requestSettingsCommand,
                key: getUniqueKeyForCommand(),
            }))
        },

        queueMultipleMessages: (commands: bluetoothCommand[]) => {
            dispatch(bluetoothWriteMultipleCommands(commands))
        },

        // Update the firmware slice with the firmware chunks
        updateFirmware: (deviceKey: DeviceId, firmware: string[]) => {
            dispatch(setFirmwareSections(firmware));
            dispatch(setFirmwareDevice(deviceKey));
            // Start writing the firmware to the device
            dispatch(queueNextFirmwareSection());
        },
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SettingsPage);