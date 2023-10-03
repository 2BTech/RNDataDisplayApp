import React, { FC, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, } from 'react-native';
import { SettingObj } from '../../../redux/slices/deviceSettingsSlice';
import { downloadFirmware, getFirmwareVersion } from "../../../Utils/Firmware/DownloadFirmwareUtils";

interface DownloadFirmwareComponentProps {
    setting: SettingObj;
    level: number;
    deviceName: string;
}

const DownloadFirmwareComponent: FC<DownloadFirmwareComponentProps> = React.memo(({setting, level, deviceName}) => {
    const [textVal, setTextVal] = useState<string>('');
    const [firmwareVersion, setFirmwareVersion] = useState<string | undefined>(undefined);

    const onFinishEditing = (deviceName: string) => {
        console.log('Finished editing ', deviceName);
        setTextVal(deviceName);

        console.log('Checking if firmware exists for device: ', deviceName);

        // Check if a firmware file exists for the device
        getFirmwareVersion(deviceName)
            .then((version) => {
                setFirmwareVersion(version);
                console.log('Current firmware version: ', version);
                if (version != undefined) {
                    console.log('Firmware already downloaded');
                    return;
                }
            });
    }

    // Receives the firmware download progress
    const onDownloadProgress = (progress: number) => {
        console.log('Download progress: ', progress);
    }

    // Called when the download button is pressed
    const onDownloadPress = () => {
        // If the device name is empty, return
        if (textVal == '') {
            return;
        }

        // Start downloading the firmware file
        downloadFirmware(textVal, onDownloadProgress)
            .then((success) => {
                console.log('Firmware downloaded successfully: ', success);
                // setFirmwareVersion(version);
            })
            .catch((error) => {
                console.log('Error downloading firmware: ', error);
            });
    }

    return (
        <View style={StyleSheet.compose(styles.container, {marginLeft: level * 10})}>
            <Text style={styles.descriptionText}>{setting.description}</Text>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={styles.valueText}>Target Device: </Text>
                <TextInput style={styles.input} onEndEditing={event => onFinishEditing(event.nativeEvent.text)} defaultValue={'' + setting.currentVal} />
            </View>
            {
                firmwareVersion != undefined && <View style={{flexDirection: 'row'}}>
                    <Text style={styles.firmwareVersionText}>Current Version:</Text>
                    <Text style={styles.firmwareVersionText}>{firmwareVersion}</Text>
                </View>
            }
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={() => onDownloadPress()}>
                    <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Download</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: 'gray',
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingTop: 15,
        marginRight: 10,
    },

    input: {
        borderWidth: 1, 
        borderRadius: 4, 
        height: 35, 
        margin:0, 
        textAlign: 'center', 
        minWidth: 60, 
        color:"black",
        backgroundColor: 'white',
        
        // Fill all available width
        flex: 1,

        marginLeft: 25,
    },

    descriptionText: {
        fontSize: 20,
        color: 'black',
        marginBottom: 10,
    },

    firmwareVersionText: {
        fontSize: 20,
        color: 'black',
        marginBottom: 10,

        width: '50%',
    },

    valueText: {
        fontSize: 20,
        color: 'black',
    },

    switchStyle: {
        color: "black"
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

        borderBottomWidth: 2,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
})

export default DownloadFirmwareComponent;