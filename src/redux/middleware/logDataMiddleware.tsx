import * as RNFS from 'react-native-fs';
import { ParameterSigFigs } from "../../Constants/Parameters/ParameterDefs";
import { ParameterDataObj, addDeviceData, ParameterMap } from "../slices/deviceDataSlice";
import { Platform } from 'react-native';
import { ConnectionType, DeviceId, updateDeviceFileName } from '../slices/deviceSlice';
import { FileTypes, buildFullDataFilePath, mkpath } from '../../Utils/FileUtils';
import { Action, ActionCreator, AnyAction, CombinedState, Middleware, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState, store } from '../store';
import { Dispatch } from 'react';
import { convertGPSToString } from '../../Utils/GPSUtils';

const buildDataDate: (() => string) = () => {
    const d = new Date();

    return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + "," + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
}

const buildDataLine: ((data: ParameterMap, parameterNames: string[], gpsCoords: string) => string) = (data, parameterNames, gpsCoords) => {
    let line = parameterNames.map(parameter => {
        // console.log(data[parameter].breakdown.current.toFixed(ParameterSigFigs[parameter]));
        return data[parameter].breakdown.current.toFixed(ParameterSigFigs[parameter])
    });

    return line + ',' + gpsCoords + ',' + buildDataDate();
}

interface logDataFunct {
    deviceKey: DeviceId;
    funt: Function
}

export interface ParameterPoint {
    val: number;
    unt: string;
}

export type ParameterPointMap = {
    [key: string]: ParameterPoint;
}

export interface DeviceReading {
    deviceKey: DeviceId;
    data: ParameterPointMap;
}

// Async Redux-Thunk action
export function applyData(reading: DeviceReading) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        // console.log('Applying data: ', reading.deviceKey);
        
        // Add data to the global state
        dispatch(addDeviceData({
            ...reading,
            gpsCoords: getState().gpsSlice.gpsCoords,
        }));

        // Get the current app state
        const appState: CombinedState<RootState> = getState();

        // If the device is a beacon, check if all parameters have been received
        const connType: ConnectionType = appState.deviceSlice.deviceDefinitions[reading.deviceKey].connectionType;
        if (connType == ConnectionType.Beacon) {
            // If any of the parameters have two points, then all parameters have been received
            let allParamsReceived = false;
            Object.values(appState.deviceDataSlice.deviceData[reading.deviceKey].data).forEach(param => {
                if (param.breakdown.numberOfPoints > 1) {
                    allParamsReceived = true;
                }
            });

            // If allParamsReceived is false, then return
            if (!allParamsReceived) {
                console.log('Not logging data for ', reading.deviceKey, ' because not all parameters have been received');
                return;
            }
        }

        // Get the data file name for the device. If one does not exist, create one
        let filePath: string = (appState.deviceSlice.deviceDefinitions[reading.deviceKey].fileName) || '';

        // If the file path is empty, then create a new file path
        if (filePath == '' || filePath == undefined) {
            filePath = buildFullDataFilePath(appState.deviceSlice.deviceDefinitions[reading.deviceKey].deviceName, FileTypes.LocalDataFile, connType == ConnectionType.Beacon);

            dispatch(updateDeviceFileName({
                deviceKey: reading.deviceKey,
                fileName: filePath,
            }));
        }

        // If the file path does not exist, then create it and write the data header to the file

        // Make sure the directory exists
        await mkpath(filePath.split('/').slice(0, -1).join('/'));

        // Check if the file exists
        const fileExists = await RNFS.exists(filePath);

        // If the file does not exist, create it and write the header
        if (!fileExists) {
            await RNFS.write(filePath, [...([...appState.deviceDataSlice.deviceData[reading.deviceKey].parameterNames].sort()), 'Longitude', 'Latitude', 'Altitude', 'Date', 'Time'].join(',') + '\n');
        }

        // Build the data line
        const dataLine = buildDataLine(appState.deviceDataSlice.deviceData[reading.deviceKey].data, appState.deviceDataSlice.deviceData[reading.deviceKey].parameterNames, convertGPSToString(appState.gpsSlice.gpsCoords));

        // Append the data line to the file
        await RNFS.appendFile(filePath, dataLine + '\n');

        // console.log('Writing data to file: ', filePath, ' - ', dataLine);
    }
}

export const logDataMiddleware: Middleware<{}, RootState> = store => next => action => {
    if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
    }
    return next(action);
}