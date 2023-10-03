import React, { FC, useState, useEffect, } from "react";
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid, } from "react-native";

import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
} from 'react-native-ble-manager';
import { ThunkDispatch } from "redux-thunk";
import { RootState, store } from "../../redux/store";
import { Action } from "redux";
import { ConnectionType, DeviceId, clearAvailable, disconnectFromDevice, discoverDevice } from "../../redux/slices/deviceSlice";
import { ConnectedProps, connect, useSelector, } from "react-redux";
import { handleBeaconData } from "../../redux/middleware/Bluetooth/BluetoothBeaconMiddleware";
import { handleDirectConnectData } from "../../redux/middleware/Bluetooth/BluetoothDirectMiddleware";
import { clearMessagesForDevice } from "../../redux/slices/bluetoothCommandSlice";
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
declare module 'react-native-ble-manager' {
    // enrich local contract with custom state properties
    interface Peripheral {
      connected?: boolean;
      connecting?: boolean;
    }
}

interface BluetoothProviderProps extends PropsFromRedux {

}

const SECONDS_TO_SCAN_FOR = 15;
const SERVICE_UUIDS: string[] = ['6e400001-b5a3-f393-e0a9-e50e24dcca9e', '0061'];
const ALLOW_DUPLICATES = true;

const BluetoothProvider: FC<BluetoothProviderProps> = ({clearOnStart, discoverDevice, onReceiveBeaconData, parseDirectConnectData, onDeviceDisconnect}) => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    // const [peripherals, setPeripherals] = useState(
    //     new Map<Peripheral['id'], Peripheral>(),
    // );

    const startScanning = () => {
        if (!isScanning) {
            // reset found peripherals before scan
            clearOnStart();
        }

        try {
            // console.debug('[startScan] starting scan...');
            setIsScanning(true);
            BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
              matchMode: BleScanMatchMode.Sticky,
              scanMode: BleScanMode.LowLatency,
              callbackType: BleScanCallbackType.AllMatches,
            })
            // .then(() => {
            //     console.debug('[startScan] scan promise returned successfully.');
            // })
            .catch(err => {
                console.error('[startScan] ble scan returned in error', err);
            });
        } catch (error) {
            console.error('[startScan] ble scan error thrown', error);
        }
    }

    const wait = (ms: number) =>
        new Promise((resolve, reject) =>
            setTimeout(() => {
                resolve(undefined)
            }, ms)
        );

    const handleStopScan = async () => {
        setIsScanning(false);
        // console.debug('[handleStopScan] scan is stopped.');

        await wait(1000);

        startScanning();
    };

    const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
      // Ignore any null peripherals
      if (updatedPeripheral == undefined) {
        return;
      } 
      // Ignore devices with no id
      else if (id == undefined) {
        return;
      } 
      // Ignore devies with no name
      else if (updatedPeripheral.name == undefined) {
        return;
      }

      // Check if the device is in the connected list
      if (store.getState().deviceSlice.connectedDevices.find((deviceKey) => deviceKey == id) != undefined) {
        // If the device is a beaon, parse the data, else ignore it
        if (updatedPeripheral.advertising.serviceUUIDs?.includes('0061')) {
          onReceiveBeaconData(updatedPeripheral);
        } else {
          // ToDo, FLAG, this is probably an error edge case where a direct connect device that was once
          // connected has disconnected. We should now reconnect to it
          return;
        }
      }
      // Check if the device is not in the available list. If not, then 'discover' it
      else if (store.getState().deviceSlice.availableDevices.find((deviceKey) => deviceKey == id) == undefined) {
        discoverDevice(updatedPeripheral);
      }
      // If a device reaches here, it is in the available list so ignore it
    };

    const handleDisconnectedPeripheral = (
        event: BleDisconnectPeripheralEvent,
      ) => {
        console.log('Peripheral disconnected: ', event.peripheral);

        onDeviceDisconnect(event.peripheral);

        // let peripheral = peripherals.get(event.peripheral);
        // if (peripheral) {
        //   console.debug(
        //     `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        //     event.peripheral,
        //   );
        //   addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: false});
        // }
        // console.debug(
        //   `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
        // );
    };

    const handleUpdateValueForCharacteristic = (
        data: BleManagerDidUpdateValueForCharacteristicEvent,
    ) => {
      parseDirectConnectData(data); 
        // console.debug(
        //     `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
        // );
    };

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        if (!peripheral.name) {
          // peripheral.name = 'NO NAME';
          return;
        }
        // console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
        addOrUpdatePeripheral(peripheral.id, peripheral);
    };

    const togglePeripheralConnection = async (peripheral: Peripheral) => {
        if (peripheral && peripheral.connected) {
          try {
            await BleManager.disconnect(peripheral.id);
          } catch (error) {
            console.error(
              `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
              error,
            );
          }
        } else {
          await connectPeripheral(peripheral);
        }
    };

    const retrieveConnected = async () => {
        try {
          const connectedPeripherals = await BleManager.getConnectedPeripherals();
          if (connectedPeripherals.length === 0) {
            console.warn('[retrieveConnected] No connected peripherals found.');
            return;
          }
    
          // console.debug(
          //   '[retrieveConnected] connectedPeripherals',
          //   connectedPeripherals,
          // );
    
          for (var i = 0; i < connectedPeripherals.length; i++) {
            var peripheral = connectedPeripherals[i];
            addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
          }
        } catch (error) {
          console.error(
            '[retrieveConnected] unable to retrieve connected peripherals.',
            error,
          );
        }
      };

      const connectPeripheral = async (peripheral: Peripheral) => {
        try {
          if (peripheral) {
            addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});
    
            await BleManager.connect(peripheral.id);
            console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
    
            addOrUpdatePeripheral(peripheral.id, {
              ...peripheral,
              connecting: false,
              connected: true,
            });
    
            // before retrieving services, it is often a good idea to let bonding & connection finish properly
            await sleep(900);
    
            /* Test read current RSSI value, retrieve services first */
            const peripheralData = await BleManager.retrieveServices(peripheral.id);
            // console.debug(
            //   `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
            //   peripheralData,
            // );
    
            const rssi = await BleManager.readRSSI(peripheral.id);
            // console.debug(
            //   `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
            // );
    
            if (peripheralData.characteristics) {
              for (let characteristic of peripheralData.characteristics) {
                if (characteristic.descriptors) {
                  for (let descriptor of characteristic.descriptors) {
                    try {
                      let data = await BleManager.readDescriptor(
                        peripheral.id,
                        characteristic.service,
                        characteristic.characteristic,
                        descriptor.uuid,
                      );
                      console.debug(
                        `[connectPeripheral][${peripheral.id}] descriptor read as:`,
                        data,
                      );
                    } catch (error) {
                      console.error(
                        `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                        error,
                      );
                    }
                  }
                }
              }
            }
    
            // let p = peripherals.get(peripheral.id);
            // if (p) {
            //   addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
            // }
          }
        } catch (error) {
          console.error(
            `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
            error,
          );
        }
      };

      function sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
      }

      useEffect(() => {
        try {
          BleManager.start({showAlert: false})
            .then(() => {
                startScanning();
            })
            .catch(error =>
              console.error('BleManager could not be started.', error),
            );
        } catch (error) {
          console.error('unexpected error starting BleManager.', error);
          return;
        }
    
        const listeners = [
          bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleDiscoverPeripheral,
          ),
          bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
          bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            handleDisconnectedPeripheral,
          ),
          bleManagerEmitter.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            handleUpdateValueForCharacteristic,
          ),
        ];
    
        handleAndroidPermissions();
    
        return () => {
          // console.debug('[app] main component unmounting. Removing listeners...');
          for (const listener of listeners) {
            listener.remove();
          }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const handleAndroidPermissions = () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
          PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]).then(result => {
            if (result) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permissions android 12+',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permissions android 12+',
              );
            }
          });
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(checkResult => {
            if (checkResult) {
              console.debug(
                '[handleAndroidPermissions] runtime permission Android <12 already OK',
              );
            } else {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ).then(requestResult => {
                if (requestResult) {
                  console.debug(
                    '[handleAndroidPermissions] User accepts runtime permission android <12',
                  );
                } else {
                  console.error(
                    '[handleAndroidPermissions] User refuses runtime permission android <12',
                  );
                }
              });
            }
          });
        }
      };

    return (
        <></>
    )
}

// const mapStateToProps = (state: RootState) => {
//     return {
//         availableDevices: state.deviceSlice.availableDevices,
//         connectedDevices: state.deviceSlice.connectedDevices,
//     }
// }

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
    return {
        clearOnStart: () => dispatch(clearAvailable({})),

        discoverDevice: (peripheral: Peripheral) => {
            dispatch(discoverDevice({
                deviceKey: peripheral.id,
                deviceName: peripheral.name,
                connectionType: peripheral.advertising.serviceUUIDs?.includes('0061') ? ConnectionType.Beacon : ConnectionType.DirectConnect,
            }));
        },

        onReceiveBeaconData: (peripheral: Peripheral) => {
          dispatch(handleBeaconData(peripheral));
        },

        parseDirectConnectData: (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
          dispatch(handleDirectConnectData(data));
        },

        onDeviceDisconnect: (deviceKey: DeviceId) => {
          dispatch(disconnectFromDevice(deviceKey));
          dispatch(clearMessagesForDevice(deviceKey));
        },
    };
}

const connector = connect(undefined, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BluetoothProvider);