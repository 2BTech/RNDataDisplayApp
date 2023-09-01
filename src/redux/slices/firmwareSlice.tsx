import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";

// Interface for the Firmware state object
export interface FirmwareState {
    // The device the firmware is being uploaded to
    deviceKey: DeviceId;
    // The firmware sections to write to the device
    firmwareSections: string[];
    // The current section being written
    currentSection: number;
    // The total number of sections to write
    totalSections: number;
    // A bool to track if the firmware is being written
    isWriting: boolean;
}

// The initial state of the firmware slice
const initialState: FirmwareState = {
    deviceKey: '',
    firmwareSections: [],
    currentSection: 0,
    totalSections: 0,
    isWriting: false,
}

// Create the firmware slice
export const firmwareSlice = createSlice({
    name: 'firmwareSlice',
    initialState,
    reducers: {
        // Set the firmware sections to write
        setFirmwareSections: (state, action) => {
            return {
                ...state,
                currentSection: 0,
                totalSections: action.payload.length,
                firmwareSections: action.payload,
                isWriting: true,
            }
        },

        // Set the device the firmware is being written to
        setFirmwareDevice: (state, action) => {
            return {
                ...state,
                deviceKey: action.payload,
            }
        },

        // Clear the isWriting flag
        clearIsWriting: (state) => {
            return {
                ...state,
                isWriting: false,
            }
        },

        // Increment the current section
        incrementCurrentSection: (state) => {
            return {
                ...state,
                currentSection: state.currentSection + 1,
            }
        },
    },
})

// Export the actions
export const { setFirmwareSections, setFirmwareDevice, clearIsWriting, incrementCurrentSection, } = firmwareSlice.actions;
export default firmwareSlice.reducer;
        