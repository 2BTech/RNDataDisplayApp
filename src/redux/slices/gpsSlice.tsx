import { createSlice } from "@reduxjs/toolkit";

export interface GPSCoordinate {
    latitude: number;
    longitude: number;
    altitude: number;
}

interface GPSState {
    gpsCoords: GPSCoordinate
}

const initialState: GPSState = {
    gpsCoords: {
        latitude: 0,
        longitude: 0,
        altitude: 0,
    }
}

export const GPSSlice = createSlice({
    name: 'gpsSlice',
    initialState,
    reducers: {
        updateGPSCoords: (state, action) => {
            return {
                gpsCoords: action.payload,
            }
        },
    },
});

export const { updateGPSCoords } = GPSSlice.actions;
export default GPSSlice.reducer;