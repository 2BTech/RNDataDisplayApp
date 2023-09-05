import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store';
import { Action, CombinedState, } from 'redux';
import { clearIsWriting } from '../../slices/firmwareSlice';
import { bluetoothWriteCommand, } from '../Bluetooth/BluetoothWriteCommandMiddleware';
import { bluetoothCommand, getUniqueKeyForCommand } from '../../slices/bluetoothCommandSlice';
import { BuildFirmwareUploadMessage } from '../../../Utils/Bluetooth/BluetoothCommandUtils';

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
            return;
        }

        let command: bluetoothCommand = {
            deviceKey,
            key: getUniqueKeyForCommand(),
            command: BuildFirmwareUploadMessage(firmwareSections[currentSection], currentSection, totalSections),
        }

        console.log('Queuing firmware section ', currentSection, ' / ', totalSections);

        // Queue the next firmware section
        dispatch(bluetoothWriteCommand(command));
    }
}