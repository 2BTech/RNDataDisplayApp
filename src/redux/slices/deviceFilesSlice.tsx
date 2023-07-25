import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";

export type DeviceFileMap = {
    [key: DeviceId]: string[],
}

const initialState: DeviceFileMap = {

}

export const deviceFilesSlice = createSlice({
    name: 'deviceFilesSlice',
    initialState,
    reducers: {
        updateDeviceFiles: (state, action) => {
            return {
                ...state,
                [action.payload.deviceKey]: action.payload.files,
            }
        },
    },
});

export const { updateDeviceFiles, } = deviceFilesSlice.actions;
export default deviceFilesSlice.reducer;