import BleManager, { BleManagerDidUpdateValueForCharacteristicEvent } from 'react-native-ble-manager';
import { DeviceId, connectToDevice } from '../../slices/deviceSlice';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store';
import { Action, CombinedState, } from 'redux';
import { Platform } from 'react-native';
import { clearDeviceMessage, receivePartialMessage } from '../../slices/bluetoothDataSlice';
import { addDeviceData } from '../../slices/deviceDataSlice';
import { ParameterPointMap, applyData } from '../logDataMiddleware';
import { bluetoothWriteCommand } from './BluetoothWriteCommandMiddleware';
import { requestDataFileNamesCommand, requestSettingsCommand } from '../../../Utils/Bluetooth/BluetoothCommandUtils';
import { getUniqueKeyForCommand } from '../../slices/bluetoothCommandSlice';
import { setDeviceSettings } from '../../slices/deviceSettingsSlice';
import { updateDeviceFiles } from '../../slices/deviceFilesSlice';

var convertString = {
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

        // There is some wierd casting? issue causing a crash. Not sure if needed though
        // if (peripheralData.characteristics) {
        //     for (let characteristic of peripheralData.characteristics) {
        //         if (characteristic.descriptors) {
        //             for (let descriptor of characteristic.descriptors) {
        //                 try {
        //                     let data = await BleManager.readDescriptor(
        //                         deviceId,
        //                         characteristic.service,
        //                         characteristic.characteristic,
        //                         descriptor.uuid,
        //                     );
        //                     console.debug(
        //                         `[connectPeripheral][${deviceId}] descriptor read as:`,
        //                         data,
        //                     );
        //                 } catch (error) {
        //                     console.error(
        //                     `[connectPeripheral][${deviceId}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
        //                     error,
        //                     );
        //                 }
        //             }
        //         }
        //     }
        // }

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
            // Set the max transmittion unit to 512. All other values tend to fail
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

interface BluetoothMessage {
    status: number;
    type: string;
    body: any;
}

async function parseSettings(settings: any, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>) {
    console.log('Device settings for ', deviceKey, ': ', settings);

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
        }
    });

    dispatch(applyData({
        deviceKey,
        data
    }));
}

async function parseDeviceFiles(fileNames:any, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>) {
    console.log('Filenames: ', fileNames);

    dispatch(updateDeviceFiles({
        deviceKey,
        files: fileNames,
    }));
}

async function parseFileData(fileData:any, deviceKey: DeviceId) {
    console.log('File data: ', fileData);
}

async function parseAvailableNetworks(networks:any, deviceKey: DeviceId) {
    console.log('Available networks: ', networks);
}

async function parseMessageJson(message: BluetoothMessage, deviceKey: DeviceId, dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) {
    if (message.status == 400) {
        console.log("Message is marked as error: ", message);
        return;
    } else if (message.status == 404) {
        console.log('Sent command is either invalid or unknown: ', message);
        return;
    } else if (message.status != 200) {
        console.log('Unknown staus code: ', message.status);
        return;
    }

    switch (message.type) {
        case 'settings': 
            await parseSettings(message.body, deviceKey, dispatch);
            break;

        case 'measurements':
            // console.log('Parsing measurements');
            await parseMeasurement(message.body, deviceKey, dispatch, getState);
            break;

        case 'confirmation':
            console.log('Received confirmation message. Not handled.');
            break;

        case 'sd card':
        case 'filenames':
            console.log('File names: ', message.body);
            await parseDeviceFiles(deviceKey, message.body, dispatch);
            break;

        case 'file':
            await parseFileData(deviceKey, message.body.data);
            break;

        case 'networks':
            await parseAvailableNetworks(deviceKey, message.body);
            break;

        default:
            console.log("Received unhandled message type: ", message.type);
            break;
    }
}

export function handleDirectConnectData(data: BleManagerDidUpdateValueForCharacteristicEvent) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        if (data.peripheral == undefined) {
            return;
        }

        // console.log('Handle data for: ', data.peripheral);

        // Retrieve any existing partial data
        let message: string = getState().bluetoothDataSlice[data.peripheral] || '';

        // console.log('Existing data: ', message);

        // Append the newly received data
        message += convertString.bytesToString(data.value);

        // console.log('Message: ', message);

        // Check if the message is complete by checking if the message ends with 'end'
        if (!message.endsWith('end')) {
            // Save the incomplete message for later and exit
            dispatch(receivePartialMessage({
                deviceKey: data.peripheral,
                data: message,
            }));
            return;
        }

        // Remove the end
        message = message.substring(0, message.length - 3)

        // Received full message, time to parse it
        dispatch(clearDeviceMessage(data.peripheral));

        let messageJson: BluetoothMessage;

        try {
            // Try to parse the received message
            messageJson = JSON.parse(message);
        } catch (err) {
            // Log the error
            if (err instanceof SyntaxError) {
                console.log("Failed to parse message json: ", err);
                console.log('Read buffer length: ', message.length);
                console.log(message);
            } else {
                console.log("Encountered error when parsing message json: ", err);
            }
            return;
        }

        if (messageJson == undefined) {
            console.log('Received undefined object from parsing received message: ', message);
            return;
        }

        await parseMessageJson(messageJson, data.peripheral, dispatch, getState);
    }
}