import { createSlice } from "@reduxjs/toolkit";

export type DeviceId = string;

export interface DeviceDefinition {
    deviceKey: DeviceId;
    deviceName: string;
    connectionType: ConnectionType;
    isConnected: boolean;
    fileName: string;
}

export interface DeviceSliceState {
    // The devices that the app is currently connected to
    connectedDevices: Array<DeviceId>;
    // The devices that the app has discovered but is not connected to
    availableDevices: Array<DeviceId>;
    // The device definitions for all devices
    deviceDefinitions: DeviceDefinitionMap;
}

export enum ConnectionType {
    DirectConnect,
    Beacon,
}

export type DeviceDefinitionMap = {
    [key: DeviceId]: DeviceDefinition;
}

const initialState: DeviceSliceState = {
    connectedDevices: ['Default',],
    availableDevices: [],
    deviceDefinitions: {
        'Default': {
            deviceKey: 'Default',
            deviceName: 'Select a device',
            connectionType: ConnectionType.Beacon,
            isConnected: true,
            fileName: '',
        }
    },
}

export const deviceSlice = createSlice({
    name: 'deviceSlice',
    initialState,
    reducers: {
        // Clear the list of available devices when a new scan starts
        clearAvailable: (state, action) => {
            return {
                ...state,
                availableDevices: [],
            }
        },

        discoverDevice: (state, action) => {
            // console.log('DISCOVER_DEVICE: ', action.payload, ' - ', !state.availableDevices.includes(action.payload.deviceKey), ' - ', !state.connectedDevices.includes(action.payload.deviceKey));
            if (!state.availableDevices.includes(action.payload.deviceKey) && !state.connectedDevices.includes(action.payload.deviceKey)) {
                // console.log('Adding: ', action.payload.deviceKey);
                // console.log('Available: ', [...state.availableDevices, action.payload.deviceKey]);
                return {
                    ...state,
                    availableDevices: [...state.availableDevices, action.payload.deviceKey],
                    deviceDefinitions: {
                        ...state.deviceDefinitions,
                        [action.payload.deviceKey]: {
                            deviceName: action.payload.deviceName,
                            connectionType: action.payload.connectionType,
                            deviceKey: action.payload.deviceKey,
                        },
                    }
                };
            }
        },
        loseDevice: (state, action) => {
            return {
                ...state,
                // Remove the device id from the available list
                availableDevices: state.availableDevices.filter(deviceKey => deviceKey != action.payload),
                // Remove the device id from the connected list
                connectedDevices: state.connectedDevices.filter(deviceKey => deviceKey != action.payload),
            }
        },
        connectToDevice: (state, action) => {
            console.log('Connect to device: ', action);
            return {
                ...state,
                deviceDefinitions: {
                    ...state.deviceDefinitions,
                    [action.payload]: {
                        ...state.deviceDefinitions[action.payload],
                        isConnected: true,
                    }
                },
                // Remove the device id from the available list
                availableDevices: state.availableDevices.filter(deviceKey => deviceKey != action.payload),
                // Add the device id to the connected list
                connectedDevices: [...state.connectedDevices, action.payload],
            }
        },
        disconnectFromDevice: (state, action) => {
            return {
                ...state,
                deviceDefinitions: {
                    ...state.deviceDefinitions,
                    [action.payload]: {
                        ...state.deviceDefinitions[action.payload],
                        isConnected: false,
                    }
                },
                // Add the device id to the available list
                availableDevices: [...state.availableDevices, action.payload],
                // Remove the device id from the connected list
                connectedDevices: state.connectedDevices.filter(deviceKey => deviceKey != action.payload),
            }
        },

        updateDeviceFileName: (state, action) => {
            return {
                ...state,
                deviceDefinitions: {
                    ...state.deviceDefinitions,
                    [action.payload.deviceKey]: {
                        ...state.deviceDefinitions[action.payload.deviceKey],
                        fileName: action.payload.fileName,
                    }
                }
            }
        },
    },
});

export const { clearAvailable, discoverDevice, connectToDevice, disconnectFromDevice, loseDevice, updateDeviceFileName, } = deviceSlice.actions;
export default deviceSlice.reducer;