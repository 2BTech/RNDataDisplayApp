import React, { FC, useState, useEffect, } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView, Image, } from 'react-native';
import { ConnectedProps, connect, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { DeviceId } from "../../redux/slices/deviceSlice";
import { SettingObj, setDeviceSettings } from "../../redux/slices/deviceSettingsSlice";
import OpenSettingComponent from "./Components/OpenSettingComponent";
import ToggleSettingComponent from "./Components/ToggleSettingComponent";
import OptionsSettingComponent from "./Components/OptionsSettingComponent";
import MenuSettingsComponent from "./Components/MenuSettingComponent";
import ValueSettingComponent from "./Components/ValueSettingComponent";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { bluetoothCommand, getUniqueKeyForCommand, queueMessageForWrite, queueMultipleMessagesForWrite } from "../../redux/slices/bluetoothCommandSlice";
import { bluetoothWriteCommand, bluetoothWriteMultipleCommands } from "../../redux/middleware/Bluetooth/BluetoothWriteCommandMiddleware";
import { BuildChangeSettingsCommand, BuildFirmwareUploadMessage, requestSettingsCommand } from "../../Utils/Bluetooth/BluetoothCommandUtils";
import ButtonSettingComponent from "./Components/ButtonSettingsComponent";

interface SettingsPageProps extends PropsFromRedux {
    deviceKey: DeviceId;
}

export type ChangedSettingsMap = {
    [key: string]: SettingObj;
}

const fetchFirmwareSize = async (deviceName:string) => {
    try {
        let response = await fetch(
            'https://air.api.dev.airqdb.com/v2/update/size?id=' + deviceName,
        );
        let responseJson = await response.json();
        const numSections = Math.ceil(Number(responseJson) / 50000);
        return numSections;
    } catch (err) {
        console.log('Fetch firmware size error: ', err);
        return -1;
    }
}

const fetchFirmware = async (deviceName:string, numSections: number) => {
    // console.log('Fetching firmware for ', deviceName, '. Num Sections: ', numSections);
    let firmware: string[] = [];
    for (let i = 0; i < numSections; i++) {
        let response = await fetch(
            'https://air.api.dev.airqdb.com/v2/update?id=' + deviceName + '&count=' + i
        );

        const text = await response.text();
        firmware.push(text);
    }

    return firmware;
}

const SettingsPage: FC<SettingsPageProps> = React.memo(({deviceKey, applyUpdatedSettings, writeUpdatedSettings, deviceSettings, querySettings, createFirmwareMessage, queueMultipleMessages}) => {
    // Access the device settings objects
    // const deviceSettings: SettingObj[] = useSelector((state: RootState) => state.deviceSettingsSlice[deviceKey]) || [];
    const deviceID: string = useSelector((state: RootState) => state.deviceSlice.deviceDefinitions[deviceKey].deviceName);
    const [downloadingFirmware, setDownloadingFirmware] = useState<boolean>(false);

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

    // Flag, Causing infinite sends
    // useEffect(() => {
    //     if (deviceSettings.length <= 1) {
    //         querySettings(deviceKey);
    //     }
    // }, [deviceSettings]);

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

        let settings: SettingObj[] = deviceSettings.filter(setting => setting.description != "Firmware Update");
        let updated: any[] = Object.values(changedSettings).map(val => {
            let setObj: any = {
                ...val
            }
            setObj['newValue'] = setObj['currentVal'];
            delete setObj['currentVal'];
            return setObj;
        });
        console.log(updated);


        settings = updateEntry(settings, updated);

        applyUpdatedSettings(settings, deviceKey);
        writeUpdatedSettings(updated, deviceKey);
        updateChangedSettings({});
        updateExpandedMap(defaultExpandedMap);

        alert('Applying changes');

        console.log('Changed: ', updated);
    }

    const onRefreshClicked: (() => void) = () => {
        updateExpandedMap(defaultExpandedMap);
        updateChangedSettings({});
    }

    const renderDownloadProgressView = () => {
        return (
            <Modal visible={downloadingFirmware} transparent animationType="none">
                <View style={styles.overlay}>
                    <Text style={styles.downloadTitle}>Downloading Firmware</Text>
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

                            case 'button':
                                return <ButtonSettingComponent key={setting.id} setting={changedSettings[setting.description] || setting} level={1} onChangeValue={onChangeSetting} onPress={() => {
                                    setDownloadingFirmware(true);
                                    fetchFirmwareSize(deviceID)
                                        .then(numSections => fetchFirmware(deviceID, numSections))
                                        .then(chunked => {
                                            queueMultipleMessagesForWrite(chunked.map((chunk, i) => {
                                                let com: bluetoothCommand = {
                                                    deviceKey,
                                                    key: getUniqueKeyForCommand(),
                                                    command: BuildFirmwareUploadMessage(chunk, i, chunked.length),
                                                };
                                            }));
                                        })
                                        .then(_ => setDownloadingFirmware(false))
                                    }}
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
    return {
        deviceSettings: [...sets, {
            currentVal: '',
            description: 'Firmware Update',
            id: 'Firmware Update',
            isDevice: false,
            items: [],
            type: 'button',
            valueType: '',
        }],
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

        createFirmwareMessage: (deviceKey: DeviceId, data: string, index: number, numParts: number) => {
            dispatch(bluetoothWriteCommand({
                deviceKey,
                command: BuildFirmwareUploadMessage(data, index, numParts),
                key: getUniqueKeyForCommand(),
            }))
        },

        queueMultipleMessages: (commands: bluetoothCommand[]) => {
            dispatch(bluetoothWriteMultipleCommands(commands))
        },
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SettingsPage);