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
        // Check if the app is already writing a command to a device
        if (getState().bluetoothCommandSlice.isWritingMessage) {
            console.log('Queuing message: ', command);
            dispatch(queueMessageForWrite(command));
            return;
        }

        // Signal that the device is now writing message to devices
        dispatch(setIsWritingMessage(true));

        let success: boolean = await writeCommand(command);

        if (!success) {
            console.log('Write failed, queuing message');
            dispatch(queueMessageForWrite(command));
            dispatch(setIsWritingMessage(false));
            return;
        }

        // Wait for a response from the device for a max of 15 seconds
        let timeout: number = 0;
        while (getState().bluetoothCommandSlice.isWaitingForResponse && timeout < 150) {
            timeout++;
            await sleep(100);
        }

        if (getState().bluetoothCommandSlice.isWaitingForResponse) {
            console.log('Timeout waiting for response');
            dispatch(queueMessageForWrite(command));
            dispatch(setIsWaitingForResponse(false));
        } else {
            console.log('Received response from device');
        }

        // Try to write the entire message queue
        while (success) {
            let { commandQueue, commandKeys, } = getState().bluetoothCommandSlice;

            console.log('Command queue length: ', commandKeys.length);

            // Break from the write loop if there are no commands left to write
            if (commandKeys.length == 0) {
                break;
            }

            // Get the first command to write
            const curCommandKey = commandKeys[0];
            const curCommand: bluetoothCommand = commandQueue[curCommandKey];

            // Dequeue the message
            console.log('Dequeuing message: ', curCommand);
            await dispatch(dequeueMessage(curCommand));

            commandKeys = getState().bluetoothCommandSlice.commandKeys;
            if (commandKeys.includes(curCommandKey)) {
                console.log('Failed to dequeue current message: ', curCommandKey, ' - ', commandKeys);
            }

            // Write the next command
            success = await writeCommand(curCommand);

            if (!success) {
                dispatch(queueMessageForWrite(curCommand));
                break;
            }
            // Acknowledge that the app is waiting for a response
            setIsWaitingForResponse(true);
            
            // Wait for a response from the device for a max of 15 seconds
            let timeout: number = 0;
            while (getState().bluetoothCommandSlice.isWaitingForResponse && timeout < 150) {
                timeout++;
                await sleep(100);
            }

            if (getState().bluetoothCommandSlice.isWaitingForResponse) {
                console.log('Timeout waiting for response');
                dispatch(queueMessageForWrite(curCommand));
                dispatch(setIsWaitingForResponse(false));
            } else {
                console.log('Received response from device');
            }
        }

        dispatch(setIsWritingMessage(false));

        // console.log('Finished writing commands');
    }
}

export function bluetoothWriteMultipleCommands(commands: bluetoothCommand[]) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        // Check if the app is already writing a command to a device
        if (getState().bluetoothCommandSlice.isWritingMessage) {
            console.log('Queuing message: ', commands.length);
            dispatch(queueMultipleMessagesForWrite(commands));
            return;
        }

        // Signal that the device is now writing message to devices
        dispatch(setIsWritingMessage(true));

        let success: boolean = true;
        for (let i = 0; i < commands.length; i++) {
            success = await writeCommand(commands[i]);

            if (!success) {
                console.log('Write failed, queuing message');
                dispatch(queueMultipleMessagesForWrite(commands.slice(i)));
                dispatch(setIsWritingMessage(false));
                return;
            }
    
            // Wait for a response from the device for a max of 15 seconds
            let timeout: number = 0;
            while (getState().bluetoothCommandSlice.isWaitingForResponse && timeout < 150) {
                timeout++;
                await sleep(100);
            }

            if (getState().bluetoothCommandSlice.isWaitingForResponse) {
                console.log('Timeout waiting for response');
                dispatch(queueMessageForWrite(commands[i]));
                dispatch(setIsWaitingForResponse(false));
            } else {
                console.log('Received response from device');
            }
        }

        // Try to write the entire message queue
        while (success) {
            let {commandQueue, commandKeys, } = getState().bluetoothCommandSlice;

            console.log('Command queue length: ', commandKeys.length);

            // Break from the write loop if there are no commands left to write
            if (commandKeys.length == 0) {
                break;
            }

            // Get the first command to write
            const curCommandKey = commandKeys[0];
            const curCommand: bluetoothCommand = commandQueue[curCommandKey];

            // Dequeue the message
            console.log('Dequeuing message: ', curCommand);
            await dispatch(dequeueMessage(curCommand));

            commandKeys = getState().bluetoothCommandSlice.commandKeys;
            if (commandKeys.includes(curCommandKey)) {
                console.log('Failed to dequeue current message: ', curCommandKey, ' - ', commandKeys);
            }

            // Write the next command
            success = await writeCommand(curCommand);

            if (!success) {
                dispatch(queueMessageForWrite(curCommand));
                break;
            }

            // Wait for a response from the device for a max of 15 seconds
                let timeout: number = 0;
                while (getState().bluetoothCommandSlice.isWaitingForResponse && timeout < 150) {
                    timeout++;
                    await sleep(100);
                }

                if (getState().bluetoothCommandSlice.isWaitingForResponse) {
                    console.log('Timeout waiting for response');
                    dispatch(queueMessageForWrite(curCommand));
                    dispatch(setIsWaitingForResponse(false));
                } else {
                    console.log('Received response from device');
                }
        }

        dispatch(setIsWritingMessage(false));

        // console.log('Finished writing commands');
    }
}