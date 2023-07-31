import { ThunkDispatch } from "redux-thunk";
import { CommandMap, bluetoothCommand, dequeueMessage, queueMessageForWrite, setIsWritingMessage } from "../../slices/bluetoothCommandSlice";
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

    console.log('Write command: ', com);

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

        dispatch(setIsWritingMessage(true));

        let success: boolean = await writeCommand(command);

        if (!success) {
            dispatch(queueMessageForWrite(command));
            dispatch(setIsWritingMessage(false));
            return;
        }

        sleep(250);

        let writtenKeys: string[] = [];

        // Try to write the entire message queue
        while (success) {
            let { commandQueue, commandKeys, } = getState().bluetoothCommandSlice;

            // Prevent weird 
            commandKeys = commandKeys.filter(key => !writtenKeys.includes(key));

            console.log('Command queue length: ', commandKeys.length);

            // Break from the write loop if there are no commands left to write
            if (commandKeys.length == 0) {
                break;
            }

            // Get the first command to write
            const curCommand: bluetoothCommand = commandQueue[commandKeys[0]];

            // Dequeue the message
            dispatch(dequeueMessage(curCommand));

            // Write the next command
            success = await writeCommand(curCommand);

            if (!success) {
                dispatch(queueMessageForWrite(command));
                break;
            } else {
                writtenKeys.push(commandKeys[0]);
            }

            sleep(250);
        }

        dispatch(setIsWritingMessage(false));

        console.log('Finished writing commands');
    }
}