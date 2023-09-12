import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store';
import { Action, CombinedState, } from 'redux';
import { clearIsWriting } from '../../slices/firmwareSlice';
import { bluetoothWriteCommand, } from '../Bluetooth/BluetoothWriteCommandMiddleware';
import { bluetoothCommand, getUniqueKeyForCommand } from '../../slices/bluetoothCommandSlice';
import { BuildFirmwareUploadMessage, BuildRestartCommand, } from '../../../Utils/Bluetooth/BluetoothCommandUtils';

// Function that will handle queuing the next firmware section to write to the current device
export function queueNextFirmwareSection() {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        console.log('Queueing next firmware section');
        
        // Get the current firmware sections
        const { firmwareSections, currentSection, deviceKey, totalSections } = getState().firmwareSlice;

        // If the current index is out of bounds of the firmware sections, clear the isWriting flag and return
        if (currentSection >= totalSections) {
            console.log('Finished writing firmware');
            dispatch(clearIsWriting());

            // Wait for 10 seconds
            await new Promise(r => setTimeout(r, 10000));

            // Write command 103 to restart the PAM
            let command: bluetoothCommand = {
                deviceKey,
                key: getUniqueKeyForCommand(),
                command: BuildRestartCommand(),
            }

            dispatch(bluetoothWriteCommand(command));
            
            return;
        }

        let command: bluetoothCommand = {
            deviceKey,
            key: getUniqueKeyForCommand(),
            command: BuildFirmwareUploadMessage(firmwareSections[currentSection], currentSection, totalSections),
        }

        console.log('Queuing firmware section ', currentSection, ' / ', totalSections);

        // // Every 10 sections, wait 1/2 second
        // if (currentSection % 10 == 0) {
        //     console.log('Waiting 1/2 second');
        //     await new Promise(r => setTimeout(r, 500));
        // }

        // Queue the next firmware section
        dispatch(bluetoothWriteCommand(command));
    }
}