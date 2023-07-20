import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";

export type beaconDataMap = {
    [key: DeviceId]: number[];
}

const initialState: beaconDataMap = {

}

export const beaconSlice = createSlice({
    name: 'beaconSlice',
    initialState,
    reducers: {
        updateBeaconData: (state, action) => {
            return {
                ...state,
                [action.payload.deviceKey]: action.payload.data,
            };
        },
    },
});

export const { updateBeaconData, } = beaconSlice.actions;
export default beaconSlice.reducer;