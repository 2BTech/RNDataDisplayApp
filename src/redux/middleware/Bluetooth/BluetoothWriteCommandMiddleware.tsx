import { ThunkDispatch } from "redux-thunk";
import { CommandMap, bluetoothCommand, dequeueMessage, queueMessageForWrite, queueMultipleMessagesForWrite, setIsWaitingForResponse, setIsWritingMessage } from "../../slices/bluetoothCommandSlice";
import { RootState } from "../../store";
import { Action, CombinedState } from "redux";
import { Platform } from "react-native";
import BleManager from 'react-native-ble-manager';
import { UART_RX_CHAR_UUID, UART_SERVICE_UUID } from "./BluetoothDirectMiddleware";

var convertString = {
    bytesToString: function(bytes: number[]) {
      return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
    },
    stringToBytes: function(str: string) {
      return str.split('').map(function(x) { return x.charCodeAt(0) })
    }
}

async function writeCommand(command:bluetoothCommand) {
    // Make sure the command ends with the proper string
    let com: string = command.command;
    if (!com.endsWith('end')) {
        com += 'end';
    }

    // console.log('Write command: ', com);

    let wasSuccess: boolean = true;

    // Convert the message into bytes
    const comBytes: number[] = convertString.stringToBytes(com);

    if (Platform.OS == 'ios') {
        await BleManager.write(command.deviceKey, UART_SERVICE_UUID, UART_RX_CHAR_UUID, comBytes)
            .catch(err => {
                wasSuccess = false;
                console.log('Failed to write message to device: ', command.deviceKey, ' : ', err);
            });
    } else {
        await BleManager.writeWithoutResponse(command.deviceKey, UART_SERVICE_UUID, UART_RX_CHAR_UUID, comBytes)
            .catch(err => {
                wasSuccess = false;
                console.log('Failed to write message to device: ', command.deviceKey, ' : ', err);
            });
    }

    console.log('Write was success: ', wasSuccess);

    return wasSuccess;
}

function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function bluetoothWriteCommand(command: bluetoothCommand) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        // Queue the message
        dispatch(queueMessageForWrite(command));

        // If the app is not currently writing a command to a device, start working through the queue'
        if (!getState().bluetoothCommandSlice.isWritingMessage) {
            // Signal that the device is now handling the queue
            dispatch(setIsWritingMessage(true));
            await handleBluetoothCommandQueue(dispatch, getState);
        }
    }
}

export function bluetoothWriteMultipleCommands(commands: bluetoothCommand[]) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        // Queue the messages
        dispatch(queueMultipleMessagesForWrite(commands));

        // If the app is not currently writing a command to a device, start working through the queue'
        if (!getState().bluetoothCommandSlice.isWritingMessage) {
            // Signal that the device is now handling the queue
            dispatch(setIsWritingMessage(true));
            await handleBluetoothCommandQueue(dispatch, getState);
        }
    }
}

// Function that will handle writing the given command to the device and will return a boolean indicating if the write was successful
export async function bluetoothWriteSingleCommand(command: bluetoothCommand, dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) {
    // Start by trying to write the command to the device
    let success: boolean = await writeCommand(command);

    // If the write failed, queue the message and return false
    if (!success) {
        console.log('Write failed, queuing message');
        dispatch(queueMessageForWrite(command));
        return false;
    }

    dispatch(setIsWaitingForResponse(true));

    // Wait for a response from the device for a max of 15 seconds
    let timeout: number = 0;
    while (getState().bluetoothCommandSlice.isWaitingForResponse && timeout < 150) {
        timeout++;
        await sleep(100);
    }

    // Check if the device responded in time
    if (getState().bluetoothCommandSlice.isWaitingForResponse) {
        console.log('Timeout waiting for response');
        // Requeue the message
        dispatch(queueMessageForWrite(command));
        // Clear the waiting for response flag
        dispatch(setIsWaitingForResponse(false));
        // Return false to signal error
        return false;
    } else {
        console.log('Received response from device');
        // REeturn true to signal success
        return true;
    }
}

async function handleBluetoothCommandQueue(dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) {
    console.log('Starting to write commands');
    
    // Collection of the keys that were written to the device
    let writtenKeys: string[] = [];

    let commandQueue: CommandMap;
    let commandKeys: string[];
    
    do {
        // Gather the command queue
        commandQueue = getState().bluetoothCommandSlice.commandQueue;
        commandKeys = getState().bluetoothCommandSlice.commandKeys.filter(key => !writtenKeys.includes(key));

        // Loop through the command queue
        for (let i = 0; i < commandKeys.length; i++) {
            // Get the current command
            const curCommandKey = commandKeys[i];
            const curCommand: bluetoothCommand = commandQueue[curCommandKey];

            // Try to write the command to the device
            let success: boolean = await writeCommand(curCommand);

            // Signal that the phone is waiting for a response from the device
            dispatch(setIsWaitingForResponse(true));

            // Wait for a response from the device for a max of 15 seconds
            let timeout: number = 0;
            while (getState().bluetoothCommandSlice.isWaitingForResponse && timeout < 150) {
                timeout++;
                await sleep(100);
            }

            // Check if the device responded in time
            if (getState().bluetoothCommandSlice.isWaitingForResponse) {
                success = false;
            }

            // Add the key to the written keys collection
            writtenKeys.push(curCommandKey);

            // If the write succeeded, remove the command from the queue
            if (success) {
                // Dequeue the message
                console.log('Dequeuing message: ', curCommand);
                await dispatch(dequeueMessage(curCommand));
            }
        }
    } while (commandKeys.length > 0);

    console.log('Finished writing commands');
}