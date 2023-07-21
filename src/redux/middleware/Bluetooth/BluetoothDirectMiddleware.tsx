import BleManager, { BleManagerDidUpdateValueForCharacteristicEvent } from 'react-native-ble-manager';
import { DeviceId, connectToDevice } from '../../slices/deviceSlice';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store';
import { Action, CombinedState, } from 'redux';
import { Platform } from 'react-native';

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
    }
}

export function handleDirectConnectData(data: BleManagerDidUpdateValueForCharacteristicEvent) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        if (data.peripheral == undefined) {
            return;
        }

        // ToDo
    }
}