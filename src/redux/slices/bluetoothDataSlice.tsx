import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";

export type bluetoothDataMap = {
    [key: DeviceId]: string;
}

const initialState: bluetoothDataMap = {

}

export const bluetoothDataSlice = createSlice({
    name: 'bluetoothDataSlice',
    initialState,
    reducers: {
        receivePartialMessage: (state, action) => {
            return {
                ...state,
                [action.payload.deviceKey]: action.payload.data,
            };
        },

        clearDeviceMessage: (state, action) => {
            return {
                ...state,
                [action.payload]: '',
            };
        },
    },
});

export const { receivePartialMessage, clearDeviceMessage, } = bluetoothDataSlice.actions;
export default bluetoothDataSlice.reducer;