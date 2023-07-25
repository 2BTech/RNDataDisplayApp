import React, { FC, useState, } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity, ScrollView, } from 'react-native';
import Accordian from "./Components/Accordian/Accordian";
import { AccordianItemProps } from "./Components/Accordian/AccordianItem";
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
import { bluetoothCommand, getUniqueKeyForCommand, queueMessageForWrite } from "../../redux/slices/bluetoothCommandSlice";
import { bluetoothWriteCommand } from "../../redux/middleware/Bluetooth/BluetoothWriteCommandMiddleware";
import { BuildChangeSettingsCommand } from "../../Utils/Bluetooth/BluetoothCommandUtils";

interface SettingsPageProps extends PropsFromRedux {
    deviceKey: DeviceId;
}

export type ChangedSettingsMap = {
    [key: string]: SettingObj;
}

const SettingsPage: FC<SettingsPageProps> = ({deviceKey, applyUpdatedSettings, writeUpdatedSettings, deviceSettings}) => {
    // Access the device settings objects
    // const deviceSettings: SettingObj[] = useSelector((state: RootState) => state.deviceSettingsSlice[deviceKey]) || [];

    let defaultExpandedMap:{[key: string]: boolean} = {

    };
    deviceSettings.forEach(set => {
        defaultExpandedMap[set.description] = false;
    });
    const [expandedMap, updateExpandedMap] = useState(defaultExpandedMap);

    const [changedSettings, updateChangedSettings] = useState<ChangedSettingsMap>({});
    const onChangeSetting: (setting: SettingObj) => void = (setting: SettingObj) => {
        console.log('Changed setting: ', setting);
        updateChangedSettings({
            ...changedSettings,
            [setting.description]: setting,
        });
    }

    // console.log('Settings for ', deviceKey, ': ', deviceSettings);

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

            console.log(col[i].description);

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









        // for (let i = 0; i < col.length; i++) {
        //     if (col[i].description == updated.description) {
        //         console.log('Updating setting: ', col[i].description, ' - ', col[i].currentVal, ' -> ', updated.currentVal);
        //         col[i] = updated;
        //         return col;
        //     } else {
        //         col[i].items = updateEntry(col[i].items, updated);
        //     }
        // }
        // return col;
    }

    const onSaveClicked: (() => void) = () => {
        console.log('Save clicked. Changed settings: ', changedSettings);

        let settings: SettingObj[] = [...deviceSettings];

        let updatedSettings = Object.values(changedSettings);
        console.log('Updated settings: ', updatedSettings.map(set => set.description));
        settings = updateEntry(settings, updatedSettings);

        // for (let i = 0; i < updatedSettings.length; i++) {
        //     settings = updateEntry(settings, updatedSettings);

        //     // if (updateEntry(settings, updatedSettings[i])) {
        //     //     console.log('Updated setting: ', updatedSettings[i]);
        //     // } else {
        //     //     console.log('Failed to update setting: ', updatedSettings[i]);
        //     // }
        // }
        // console.dir(settings, {depth: null});
        

        // let mergedSettings: SettingObj[] = deviceSettings.map(set => {
        //     if (changedSettings[set.description]) {
        //         console.log('Applying change for ', set.description);
        //         return changedSettings[set.description];
        //     } else if (set.items) {

        //     } else {
        //         return set;
        //     }

        //     // return changedSettings[set.description] || set;
        // });

        applyUpdatedSettings(settings, deviceKey);
        writeUpdatedSettings(settings, deviceKey);
        updateChangedSettings({});
        updateExpandedMap(defaultExpandedMap);

        alert('Applying changes');
    }

    const onRefreshClicked: (() => void) = () => {
        console.log('Refresh clicked');
        updateExpandedMap(defaultExpandedMap);
        updateChangedSettings({});
    }

    return (
        <View style={styles.container}>
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
                        }
                    })
                }
            </ScrollView>
                <View style={styles.buttonContainerStyle}>
                    <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)}>
                        <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)} onPress={onSaveClicked}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)}>
                        <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)} onPress={onRefreshClicked}>Refresh</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );
}

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
})

const mapStateToProps = (state: RootState, ownProps: any) => {
    return {
        deviceSettings: state.deviceSettingsSlice[ownProps.deviceKey],
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
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SettingsPage);