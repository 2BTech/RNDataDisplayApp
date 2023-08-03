import { createSlice } from "@reduxjs/toolkit";
import { DeviceId } from "./deviceSlice";

interface DownloadSliceState {
    // The number of sections that have been gathered
    gathered: number;
    // The number of sections to gather
    numberToGather: number;
    // Name of the file being downloaded
    fileName: string;
    // The devices the file is being downloaded from
    deviceKey: DeviceId;
    // Holds the gathered sections
    fileContents: string;

    // Tracks if a download is in progress
    downloadInProgress: boolean;
}

const initialState: DownloadSliceState = {
    gathered: 0,
    numberToGather: -1,
    fileName: '',
    deviceKey: '',
    fileContents: '',
    downloadInProgress: false,
}

export const downloadFilesSlice = createSlice({
    name: 'downloadFilesSlice',
    initialState,
    reducers: {
        addFileChunk: (state, action) => {
            return {
                ...state,
                gathered: state.gathered + 1,
                numberToGather: action.payload.numberToGather,
                fileName: action.payload.fileName,
                deviceKey: action.payload.deviceKey,
                fileContents: state.fileContents + action.payload.data,
            }
        },

        onStartDownload: (state, action) => {
            return {
                ...state,
                gathered: 0,
                numberToGather: -1,
                downloadInProgress: true,
                fileName: action.payload.fileName,
                deviceKey: action.payload.deviceKey,
            };
        },

        onFinishDownload: (state, action) => {
            return {
                ...initialState
            }
        }
    },
});

export const { addFileChunk, onStartDownload, onFinishDownload, } = downloadFilesSlice.actions;
export default downloadFilesSlice.reducer;