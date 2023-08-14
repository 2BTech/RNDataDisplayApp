import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";
import uuid from 'react-native-uuid';

export interface bluetoothCommand {
    deviceKey: DeviceId;
    command: string;
    key: string;
}

export type CommandMap = {
    [key: string]: bluetoothCommand;
}

export interface BluetoothCommandState {
    isWritingMessage: boolean;
    commandQueue: CommandMap;
    commandKeys: string[];
}

const initialState: BluetoothCommandState = {
    isWritingMessage: false,
    commandQueue: {},
    commandKeys: [],
}

export const getUniqueKeyForCommand: (() => string) = () => {
    let t = uuid.v4();

    if (typeof t == 'string') {
        return t;
    } else {
        return '' + Math.random();
    }
}

const copyAndDelete: ((oldData: CommandMap, toRemove: string) => CommandMap) = (oldData: CommandMap, toRemove: string) => {
    let nData = {
        ...oldData,
    }
    delete nData[toRemove];

    return nData;
}

export const bluetoothCommandSlice = createSlice({
    name: 'bluetoothCommandSlice',
    initialState,
    reducers: {
        // Set the isWritingMessage flag
        setIsWritingMessage: (state, action) => {
            return {
                ...state,
                isWritingMessage: action.payload,
            }
        },

        // Add a message to the write queue
        queueMessageForWrite: (state, action) => {
            return {
                ...state,
                commandQueue: {
                    ...state.commandQueue,
                    [action.payload.key]: action.payload
                },
                commandKeys: [...state.commandKeys, action.payload.key],
            }
        },

        // Add a message to the write queue
        queueMultipleMessagesForWrite: (state, action) => {
            let commandQueue = {
                ...state.commandQueue,
            }
            let commands: bluetoothCommand[] = action.payload;
            commands.forEach(command => {
                commandQueue[command.key] = command
            })

            return {
                ...state,
                commandQueue: commandQueue,
                commandKeys: [...state.commandKeys, action.payload.key],
            }
        },

        // Remove a command from the queue
        dequeueMessage: (state, action) => {
            return {
                ...state,
                commandKeys: state.commandKeys.filter(key => key != action.payload.key),
                commandQueue: copyAndDelete(state.commandQueue, action.payload.key),
            }
        },
    },
});

export const { setIsWritingMessage, queueMessageForWrite, dequeueMessage, queueMultipleMessagesForWrite, } = bluetoothCommandSlice.actions;
export default bluetoothCommandSlice.reducer;