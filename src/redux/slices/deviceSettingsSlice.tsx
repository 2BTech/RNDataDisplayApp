import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";

export interface SettingObj {
    currentVal: (string | boolean | number);
    description: string;
    id: (string | undefined);
    isDevice: boolean;
    items: (undefined | SettingObj[]);
    type: string;
    valueType: (undefined | string);
}

export type DeviceSettingsMap = {
    [key: DeviceId]: SettingObj[];
}

const initialState: DeviceSettingsMap = {

}

export const deviceSettingsSlice = createSlice({
    name: 'deviceSettingsSlice',
    initialState,
    reducers: {
        setDeviceSettings: (state, action) => {
            console.log('Updating settings for ', action.payload.deviceKey);
            return {
                ...state,
                [action.payload.deviceKey]: action.payload.settings,
            };
        },
    },
})

export const { setDeviceSettings, } = deviceSettingsSlice.actions;
export default deviceSettingsSlice.reducer;