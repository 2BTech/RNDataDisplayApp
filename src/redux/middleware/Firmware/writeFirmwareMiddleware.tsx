import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store';
import { Action, CombinedState, } from 'redux';
import { clearIsWriting } from '../../slices/firmwareSlice';
import { bluetoothWriteCommand, bluetoothWriteSingleCommand } from '../Bluetooth/BluetoothWriteCommandMiddleware';
import { bluetoothCommand, getUniqueKeyForCommand } from '../../slices/bluetoothCommandSlice';
import { BuildFirmwareUploadMessage } from '../../../Utils/Bluetooth/BluetoothCommandUtils';

// Function that will handle queuing the next firmware section to write to the current device
export function queueNextFirmwareSection() {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        // Get the current firmware sections
        const { firmwareSections, currentSection, deviceKey, } = getState().firmwareSlice;

        // If the current index is out of bounds of the firmware sections, clear the isWriting flag and return
        if (currentSection == firmwareSections.length) {
            dispatch(clearIsWriting);
            return;
        }

        let command: bluetoothCommand = {
            deviceKey,
            key: getUniqueKeyForCommand(),
            command: BuildFirmwareUploadMessage(firmwareSections[currentSection], currentSection, firmwareSections.length),
        }

        // Queue the next firmware section
        dispatch(bluetoothWriteCommand(command));
    }
}