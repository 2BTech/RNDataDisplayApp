import * as RNFS from 'react-native-fs';
import { ParameterSigFigs } from "../../Constants/Parameters/ParameterDefs";
import { ParameterDataObj, addDeviceData, ParameterMap } from "../slices/deviceDataSlice";
import { Platform } from 'react-native';
import { ConnectionType, DeviceId, updateDeviceFileName } from '../slices/deviceSlice';
import { FileTypes, buildFullDataFilePath, mkpath } from '../../Utils/FileUtils';
import { Action, ActionCreator, AnyAction, CombinedState, Middleware, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState, store } from '../store';
import { Dispatch } from 'react';

const buildDataDate: (() => string) = () => {
    const d = new Date();

    return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + "," + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
}

const buildDataLine: ((data: ParameterMap, parameterNames: string[]) => string) = (data, parameterNames) => {
    let line = parameterNames.map(parameter => {
        // console.log(data[parameter].breakdown.current.toFixed(ParameterSigFigs[parameter]));
        return data[parameter].breakdown.current.toFixed(ParameterSigFigs[parameter])
    });

    return line + ',' + buildDataDate();
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

        // Save the data to a file

        // If a beacon device, wait for the first item in the data array to receive a second item before starting to log data
        const connType: ConnectionType = getState().deviceSlice.deviceDefinitions[reading.deviceKey].connectionType;
        if (connType == ConnectionType.Beacon) {
            const firstParamName = getState().deviceDataSlice.deviceData[reading.deviceKey].parameterNames[0];
            if (getState().deviceDataSlice.deviceData[reading.deviceKey].data[firstParamName].breakdown.numberOfPoints < 2) {
                return;
            }

            const dataLine = buildDataLine(getState().deviceDataSlice.deviceData[reading.deviceKey].data, getState().deviceDataSlice.deviceData[reading.deviceKey].parameterNames);

            let filePath: string = (store.getState().deviceSlice.deviceDefinitions[reading.deviceKey].fileName) || '';
            if (filePath == '') {
                filePath = buildFullDataFilePath(getState().deviceSlice.deviceDefinitions[reading.deviceKey].deviceName, FileTypes.LocalDataFile, true);

                dispatch(updateDeviceFileName({
                    deviceKey: reading.deviceKey,
                    fileName: filePath,
                }));
            }

            // console.log('Filepath: ', filePath);

            await mkpath(filePath.split('/').slice(0, -1).join('/'));

            const fileExists = await RNFS.exists(filePath);

            if (!fileExists) {
                await RNFS.write(filePath, [...getState().deviceDataSlice.deviceData[reading.deviceKey].parameterNames, 'Date', 'Time'].join(',') + '\n');
            }
            await RNFS.appendFile(filePath, dataLine + '\n');
        } else {
            const dataLine = buildDataLine(getState().deviceDataSlice.deviceData[reading.deviceKey].data, getState().deviceDataSlice.deviceData[reading.deviceKey].parameterNames);
            
            let filePath: string = (store.getState().deviceSlice.deviceDefinitions[reading.deviceKey].fileName);
            if (filePath == '') {
                filePath = buildFullDataFilePath(getState().deviceSlice.deviceDefinitions[reading.deviceKey].deviceName, FileTypes.LocalDataFile, false);

                dispatch(updateDeviceFileName({
                    deviceKey: reading.deviceKey,
                    fileName: filePath,
                }));
            }

            await mkpath(filePath.split('/').slice(0, -1).join('/'));

            const fileExists = await RNFS.exists(filePath);

            if (!fileExists) {
                await RNFS.write(filePath, [...getState().deviceDataSlice.deviceData[reading.deviceKey].parameterNames, 'Date', 'Time'].join(',') + '\n');
            }
            await RNFS.appendFile(filePath, dataLine + '\n');
        }
    }
}

export const logDataMiddleware: Middleware<{}, RootState> = store => next => action => {
    if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
    }
    return next(action);
}