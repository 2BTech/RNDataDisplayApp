import BleManager, { BleManagerDidUpdateValueForCharacteristicEvent } from 'react-native-ble-manager';
import { DeviceId, connectToDevice, disconnectFromDevice } from '../../slices/deviceSlice';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store';
import { Action, CombinedState, } from 'redux';
import { Platform } from 'react-native';
import { clearDeviceMessage, receivePartialMessage } from '../../slices/bluetoothDataSlice';
import { addDeviceData } from '../../slices/deviceDataSlice';
import { ParameterPointMap, applyData } from '../logDataMiddleware';
import { bluetoothWriteCommand } from './BluetoothWriteCommandMiddleware';
import { BuildRequestDataFileCommand, BuildRequestFilePartCommand, requestDataFileNamesCommand, requestSettingsCommand } from '../../../Utils/Bluetooth/BluetoothCommandUtils';
import { getUniqueKeyForCommand, queueMessageForWrite, setIsWaitingForResponse } from '../../slices/bluetoothCommandSlice';
import { setDeviceSettings } from '../../slices/deviceSettingsSlice';
import { updateDeviceFiles } from '../../slices/deviceFilesSlice';
import { addFileChunk, onFinishDownload, onStartDownload } from '../../slices/fileDownloadSlice';
import * as RNFS from 'react-native-fs';
import { FileTypes, writeFile } from '../../../Utils/FileUtils';
import { queueNextFirmwareSection } from '../Firmware/writeFirmwareMiddleware';
import { incrementCurrentSection } from '../../slices/firmwareSlice';

const convertString = {
    bytesToString: function(bytes: number[]) {
      return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
    },
    stringToBytes: function(str: string) {
      return str.split('').map(function(x) { return x.charCodeAt(0) })
    }
  }

// General comm service id
export const UART_SERVICE_UUID = Platform.OS == 'android' ? "6e400001-b5a3-f393-e0a9-e50e24dcca9e" : "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
// Write characteristic id
export const UART_RX_CHAR_UUID = Platform.OS == 'android' ? "6e400002-b5a3-f393-e0a9-e50e24dcca9e" : "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
// Notify characteristic id
export const UART_TX_CHAR_UUID = Platform.OS == 'android' ? "6e400003-b5a3-f393-e0a9-e50e24dcca9e" : "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

// Redux thunk middleware function to connect to a direct connect device
export function connectToDirectConnect(deviceId: DeviceId) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        await BleManager.connect(deviceId);
        console.debug(`[connectPeripheral][${deviceId}] connected.`);

        dispatch(connectToDevice(deviceId));

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(deviceId);
        console.debug(
          `[connectPeripheral][${deviceId}] retrieved peripheral services`,
          peripheralData,
        );

        const rssi = await BleManager.readRSSI(deviceId);
        console.debug(
            `[connectPeripheral][${deviceId}] retrieved current RSSI value: ${rssi}.`,
        );

        // There is some weird casting? issue causing a crash on IOS. Not sure if this code is needed though
        if (Platform.OS == 'android') {
            if (peripheralData.characteristics) {
                for (let characteristic of peripheralData.characteristics) {
                    if (characteristic.descriptors) {
                        for (let descriptor of characteristic.descriptors) {
                            try {
                                let data = await BleManager.readDescriptor(
                                    deviceId,
                                    characteristic.service,
                                    characteristic.characteristic,
                                    descriptor.uuid,
                                );
                                console.debug(
                                    `[connectPeripheral][${deviceId}] descriptor read as:`,
                                    data,
                                );
                            } catch (error) {
                                console.error(
                                `[connectPeripheral][${deviceId}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                                error,
                                );
                            }
                        }
                    }
                }
            }
        }

        // This sets up the ble driver to watch for updates to the read characteristic
        // in the UART service
        await BleManager.startNotification(deviceId, UART_SERVICE_UUID, UART_TX_CHAR_UUID)
            .catch(err => {
                console.log('Failed to start notification: ', err);
            });

        if (Platform.OS == 'android') {
            // This sets the Bluetooth package size used by the app. This is only done on
            // android because ios will automatically negotiate the highest possible value
            // during the connection process
            // Set the max transmission unit to 512. All other values tend to fail
            await BleManager.requestMTU(deviceId, 512)
            .catch(err => {
                console.log('Failed to request MTU: ', err);
            });
        }

        // Send request to get all data files from the device
        dispatch(bluetoothWriteCommand({
            deviceKey: deviceId,
            command: requestDataFileNamesCommand,
            key: getUniqueKeyForCommand(),
        }));

        // Send request to get all settings from the device
        dispatch(bluetoothWriteCommand({
            deviceKey: deviceId,
            command: requestSettingsCommand,
            key: getUniqueKeyForCommand(),
        }));
    }
}

export function disconnectFromDirectConnect(deviceId: DeviceId) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        console.log('Disconnecting from: ', deviceId);

        await BleManager.disconnect(deviceId);

        dispatch(disconnectFromDevice(deviceId));

        console.log('Finished disconnecting from device');
    }
}

interface BluetoothMessage {
    status: number;
    type: string;
    body: any;
    error: string | null;
}

async function parseSettings(settings: any, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>) {
    // console.log('Device settings for ', deviceKey, ': ', settings);

    dispatch(setDeviceSettings({
        deviceKey,
        settings,
    }))
}

interface Measurement {
    name: string;
    value: string;
    units: string;
}

async function parseMeasurement(measurements: Measurement[], deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) {
    // console.log('Measurement: ', measurements);

    let data: ParameterPointMap = {

    };

    measurements.forEach(reading => {
        data[reading.name] = {
            val: Number(reading.value),
            unt: reading.units,
        };
    });

    dispatch(applyData({
        deviceKey,
        data
    }));
}

async function parseDeviceFiles(fileNames:any, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>) {
    // console.log(deviceKey, ' filenames: ', fileNames);

    dispatch(updateDeviceFiles({
        deviceKey,
        files: fileNames,
    }));
}

async function parseFileData(fileData:any, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>) {
    console.log('File data: ', fileData);

    dispatch(receiveNewFilePart(fileData, deviceKey));
}

async function parseAvailableNetworks(networks:any, deviceKey: DeviceId) {
    console.log('Available networks: ', networks);
}

async function parseMessageJson(message: BluetoothMessage, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) {
    if (message.status == 400) {
        console.log("Message is marked as error: ", message);
        if (message.type == 'sd card') {
            if (message.error == 'No Files Found') {
                // Ignore the error and continue on
                dispatch(setIsWaitingForResponse(false));
            }
        }


        return;
    } else if (message.status == 404) {
        console.log('Sent command is either invalid or unknown: ', message);
        return;
    } else if (message.status != 200) {
        console.log('Unknown status code: ', message.status);
        return;
    }

    switch (message.type) {
        case 'settings': 
            // Acknowledge that the settings were received
            console.log('Received settings message');
            dispatch(setIsWaitingForResponse(false));
            await parseSettings(message.body, deviceKey, dispatch);
            break;

        case 'measurements':
            // console.log('Parsing measurements');
            await parseMeasurement(message.body, deviceKey, dispatch, getState);
            break;

        case 'confirmation':
            // Acknowledge that the message was received
            console.log('Received confirmation message');
            dispatch(setIsWaitingForResponse(false));
            console.log('Received confirmation message. Not handled.');
            break;

        case 'sd card':
        case 'filenames':
            // Acknowledge that the settings were received
            console.log('Received sd card message');
            dispatch(setIsWaitingForResponse(false));
            await parseDeviceFiles(message.body, deviceKey, dispatch);
            break;

        case 'file':
            // Acknowledge that the settings were received
            console.log('Received file message');
            dispatch(setIsWaitingForResponse(false));
            await parseFileData(message.body, deviceKey, dispatch);
            break;

        case 'networks':
            // Acknowledge that the settings were received
            console.log('Received networks message');
            dispatch(setIsWaitingForResponse(false));
            await parseAvailableNetworks(deviceKey, message.body);
            break;

        case 'firmware':
            // Acknowledge that the firmware was received
            console.log('Received firmware message');
            dispatch(setIsWaitingForResponse(false));
            // Queue up the next part of the firmware message
            dispatch(incrementCurrentSection());
            dispatch(queueNextFirmwareSection());
            break;

        default:
            console.log("Received unhandled message type: ", message.type);
            break;
    }
}

// Check if each character in the given string a number
function isNumeric(str: string) {
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) < '0' || str.charAt(i) > '9') {
            return false;
        }
    }   
    return true;
}

export function handleDirectConnectData(data: BleManagerDidUpdateValueForCharacteristicEvent) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        if (data.peripheral == undefined) {
            return;
        }

        // console.log('Handle data for: ', data.peripheral);

        // Get any existing data, ie) package to big to be sent in one message
        let existingData = getState().bluetoothDataSlice[data.peripheral];

        // Get the new data sent from the device
        let currentData = convertString.bytesToString(data.value);

        let fullMessage = existingData ? existingData + currentData : currentData;

        // Check if a full message has been received
        if (!fullMessage.endsWith('end')) {
            dispatch(receivePartialMessage({
                deviceKey: data.peripheral,
                data: existingData ? existingData + currentData : currentData,
            }))
            return;
        }

        // A full message has been received

        // Remove the end portion of the string
        fullMessage = fullMessage.substring(0, fullMessage.length - 3);

        let messageJson: BluetoothMessage | undefined = undefined;

        try {
            // Try to parse the received message
            messageJson = JSON.parse(fullMessage);

            // Received full message, clear existing data
            if (existingData) {
                dispatch(clearDeviceMessage(data.peripheral));
            }
        } catch (err) {
            // Check if the message is numeric
            if (isNumeric(fullMessage)) {
                // Acknowledge that the firmware was received
                console.log('Received firmware message');
                dispatch(setIsWaitingForResponse(false));
                // Queue up the next part of the firmware message
                dispatch(incrementCurrentSection());
                return;
            } 
            // If there is existing data and the current data could be its own message
            else if (existingData != null && currentData.length > 3) {
                currentData = currentData.substring(0, currentData.length - 3);

                try {
                    messageJson = JSON.parse(currentData);
                } catch (err2) {
                    // Bad message all around, drop all data to start fresh
                    dispatch(clearDeviceMessage(data.peripheral));
                }
            }
        }

        if (messageJson == undefined) {
            console.log('Received undefined object from parsing received message: ', fullMessage);
            return;
        }

        await parseMessageJson(messageJson, data.peripheral, dispatch, getState);
    }
}

export function startDownloadingFile(fileName: string, deviceId: DeviceId) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        console.log('Started requesting ', fileName, ' from ', deviceId);
        
        dispatch(onStartDownload({
            fileName,
            deviceKey: deviceId,
        }));

        dispatch(bluetoothWriteCommand({
            deviceKey: deviceId,
            command: BuildRequestDataFileCommand(fileName),
            key: getUniqueKeyForCommand(),
        }));
    }
}

export function receiveNewFilePart(payload: any, deviceKey: DeviceId) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {

        const progress = getState().downloadFilesSlice.gathered + 1;
        const numParts = payload.numparts;

        console.log('Received new file part of ', payload.fileName, ': ', progress, ' / ', numParts);

        // Download is finished
        if (progress == numParts) {
            await writeFile(getState().deviceSlice.deviceDefinitions[deviceKey].deviceName, payload.fileName, FileTypes.DownloadedFile, getState().downloadFilesSlice.fileContents + payload.data);

            dispatch(onFinishDownload({}));
        } else {
            // Update store
            dispatch(addFileChunk({
                gathered: progress,
                numberToGather: numParts,
                fileName: payload.fileName,
                deviceKey,
                data: payload.data,
            }));

            // Request next part
            dispatch(bluetoothWriteCommand({
                deviceKey,
                command: BuildRequestFilePartCommand(payload.fileName, progress),
                key: getUniqueKeyForCommand(),
            }));
        }
    }
}