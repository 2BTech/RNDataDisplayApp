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
    if (command == undefined) {
        console.log('Command is undefined');
        return false;
    }

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
            await handleBluetoothCommandQueue(dispatch, getState);
        } else {
            console.log('Already writing a message (1)');
        }
    }
}

export function bluetoothWriteMultipleCommands(commands: bluetoothCommand[]) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        console.log('Queueing multiple commands: ', commands.length, ' - ', commands.filter(com => com != undefined).length);
        
        // Queue the messages
        dispatch(queueMultipleMessagesForWrite(commands));

        // If the app is not currently writing a command to a device, start working through the queue'
        if (!getState().bluetoothCommandSlice.isWritingMessage) {
            await handleBluetoothCommandQueue(dispatch, getState);
        } else {
            console.log('Already writing a message (2)');
        }
    }
}

async function handleBluetoothCommandQueue(dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) {
    console.log('Starting to write commands');
    
    dispatch(setIsWritingMessage(true));

    // Collection of the keys that were written to the device
    let writtenKeys: string[] = [];

    let commandQueue: CommandMap;
    let commandKeys: string[];

    let retryMap: Map<string, number> = new Map<string, number>();
    
    do {
        // Gather the ids of all connected devices
        const connectedDevices: string[] = getState().deviceSlice.connectedDevices;
        // Gather the command queue
        commandQueue = getState().bluetoothCommandSlice.commandQueue;
        commandKeys = getState().bluetoothCommandSlice.commandKeys.filter(key => !writtenKeys.includes(key) && connectedDevices.includes(commandQueue[key].deviceKey));

        console.log('Command queue size: ', commandKeys.length);

        // Loop through the command queue
        for (let i = 0; i < commandKeys.length; i++) {
            // Get the current command
            const curCommandKey = commandKeys[i];
            const curCommand: bluetoothCommand = commandQueue[curCommandKey];

            if (curCommand == undefined) {
                console.log('Command is undefined');
                dispatch(dequeueMessage({ key: curCommandKey,}));
                continue;
            }

            // console.log('Cur command: ', JSON.stringify(curCommand));

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
                console.log('Device did not respond in time');

                // Get the number of times the message has failed
                let numFails = retryMap.get(curCommandKey) || 0;

                // If it has failed less than 3 times, retry the message
                if (numFails < 3) {
                    console.log('Retrying message: ', curCommandKey);
                    retryMap.set(curCommandKey, numFails + 1);
                    i--;
                    continue;
                } else {
                    console.log('Failed to write message: ', curCommandKey);
                    // Add the key to the written keys collection to not try it again
                    writtenKeys.push(curCommandKey);
                }
            } else {
                // Add the key to the written keys collection
                writtenKeys.push(curCommandKey);
            }

            // If the write succeeded, remove the command from the queue
            if (success) {
                // Dequeue the message
                // console.log('Dequeuing message: ', curCommand);
                await dispatch(dequeueMessage(curCommand));
            }

            // await sleep(1000);
        }
    } while (commandKeys.length > 0);

    console.log('Finished writing commands');

    dispatch(setIsWritingMessage(false));
}