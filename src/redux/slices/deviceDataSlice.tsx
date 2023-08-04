import { createSlice } from "@reduxjs/toolkit";
import type { DeviceId } from "./deviceSlice";
import { GPSCoordinate } from "./gpsSlice";
import { convertGPSToString } from "../../Utils/GPSUtils";
 
export interface DataPointObj {
    value: number;
    time: number;
}

export interface ParameterBreakdownObj {
    // Calculated values
    min: number;
    max: number;
    mean: number;
    exponentialMovingAverage: number;
    current: number;

    // Values used to calculate values
    sum: number;
    numberOfPoints: number;
}

export interface ParameterDataObj {
    dataPoints: DataPointObj[];
    parameterName: string;
    parameterUnits: string;
    breakdown: ParameterBreakdownObj;
};

export type ParameterMap = {
    [keyof: string]: ParameterDataObj;
}

export interface DeviceDataObj {
    parameterNames: string[];
    data: ParameterMap;
    timeData: TimeDataMap;
    timeStamps: number[];
}

export interface TimeData {
    points: ParameterPointMap;
    gpsCoords: string;
}

export type TimeDataMap = {
    [key: number]: TimeData;
}

export type DataPointMap = {
    [key: string]: DataPointObj;
};

export type deviceDataMap = {
    [key: DeviceId]: DeviceDataObj;
}

export interface DeviceDataState {
    deviceData: deviceDataMap;
}

const defaultDeviceData: DeviceDataObj = {
    data: {
        CO: {
            dataPoints: [],
            parameterName: 'CO',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        CO2: {
            dataPoints: [],
            parameterName: 'CO2',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        O3: {
            dataPoints: [],
            parameterName: 'O3',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        PM1: {
            dataPoints: [],
            parameterName: 'PM1',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        'PM 2.5': {
            dataPoints: [],
            parameterName: 'PM 2.5',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        'PM 10': {
            dataPoints: [],
            parameterName: 'PM 10',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        SO2: {
            dataPoints: [],
            parameterName: 'SO2',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        NO: {
            dataPoints: [],
            parameterName: 'NO',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        NO2: {
            dataPoints: [],
            parameterName: 'NO2',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        NOx: {
            dataPoints: [],
            parameterName: 'NOx',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
        Methane: {
            dataPoints: [],
            parameterName: 'Methane',
            parameterUnits: 'ppm',
            breakdown: {
                min: 0,
                max: 0,
                mean: 0,
                exponentialMovingAverage: 0,
                current: 0,
    
                sum: 0,
                numberOfPoints: 0,
            },
        },
    },
    parameterNames: ['CO', 'CO2', 'O3', 'PM1', 'PM 2.5', 'PM 10', 'SO2', 'NO', 'NO2', 'NOx', 'Methane'],
    timeData: {},
    timeStamps: [],
}

export const initialState: DeviceDataState = {
    deviceData: {
        'Default': defaultDeviceData,
    },
}

export type ParameterPointMap = {
    [parameterName: string]: number | string;
}

// Expected payload: {
//  type: '',
//  payload: {
//    data: [key = parameterName]:number
//  }    
// }

const getMin = (valA: number, valB: number): number => {
    return valA < valB ? valA : valB;
}
const getMax = (valA: number, valB: number): number => {
    return valA > valB ? valA : valB;
}
const getExponentialMovingAverage = (curVal: number, lastAvg: number, smoothing: number, count: number): number => {
    if (count == 1) {
        return curVal;
    }

    return (curVal * (smoothing / (1 + count))) + (lastAvg * (1 - (smoothing / (1 + count))));
}
const buildDataLine: ((data: ParameterMap) => ParameterPointMap) = (data: ParameterMap) => {
    let ret: ParameterPointMap = {};

    Object.keys(data).forEach(paramName => {
        ret[paramName] = data[paramName].breakdown.current;
    });

    return ret;
}

const buildTimeData: ((data: ParameterMap, coords: GPSCoordinate) => TimeData) = (data: ParameterMap, coords: GPSCoordinate) => {
    return {
        points: buildDataLine(data),
        gpsCoords: convertGPSToString(coords),
    };
}

// Return a list containing the unique items between the two lists
// If newValues has no new items, currentList is returned
const getUnique = (currentList: string[], newValues: string[]) => {
    if (currentList.length == 0) {
        return newValues;
    } else if (newValues.length == 0) {
        return currentList;
    } else {
        let temp = [...currentList];

        newValues.forEach(val => {
            if (temp.indexOf(val) == -1) {
                temp.push(val);
            }
        })

        return (temp.length == currentList.length) ? currentList : temp;
    }
}

export const deviceDataSlice = createSlice({
    name: 'deviceDataSlice',
    initialState,
    reducers: {
        // Add data to a device
        addDeviceData: (state, action) => {
            // console.log('Adding device data: ', state.deviceData[action.payload.deviceKey]);
            // console.log('addDeviceData: ', action.payload);

            let parameterData: ParameterMap = {

            }

            Object.keys(action.payload.data).forEach((parameterName: string) => {
                const {val, unt} = action.payload.data[parameterName];
                // console.log('Parameter name: ', parameterName);

                const existingDataPoints = (((state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {dataPoints: []}}}).data[parameterName] || {[parameterName]: {dataPoints: []}}).dataPoints || []);
                const existingBreakdown: ParameterBreakdownObj = (((state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {min: val, max: val, sum: 0, exponentialMovingAverage: 0, numberOfPoints: 0}}}}).data[parameterName] || {[parameterName]: {breakdown: {min: val, max: val, sum: 0, exponentialMovingAverage: 0, numberOfPoints: 0}}}).breakdown || {min: val, max: val, sum: 0, exponentialMovingAverage: 0, numberOfPoints: 0});

                // console.log('Existing data: ', existingDataPoints);

                // console.log(parameterName, ' = ', val);
                // console.log('dataPoints: ', [...((state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {dataPoints: []}}}).data[parameterName].dataPoints), {value: val, time: new Date().getTime()}]);
                // console.log('parameterName: ', parameterName);
                // console.log('breakdown.current: ', val);
                // console.log('breakdown.min: ', getMin(val, (state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {min: val}}}}).data[parameterName].breakdown.min));
                // console.log('breakdown.max: ', getMax(val, (state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {max: val}}}}).data[parameterName].breakdown.max));
                // console.log('breakdown.exponentialMovingAverage: ', getExponentialMovingAverage(val, (state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {exponentialMovingAverage: val}}}}).data[parameterName].breakdown.exponentialMovingAverage, 2, (state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {numberOfPoints: 0}}}}).data[parameterName].breakdown.numberOfPoints + 1));
                // console.log('breakdown.mean: ', ((state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {sum: 0}}}}).data[parameterName].breakdown.sum + val) / ((state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {numberOfPoints: 0}}}}).data[parameterName].breakdown.numberOfPoints + 1));
                // console.log('breakdown.sum: ', ((state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {sum: 0}}}}).data[parameterName].breakdown.sum + val));
                // console.log('breakdown.numberOfPoints: ', (state.deviceData[action.payload.deviceKey] || {data: {[parameterName]: {breakdown: {numberOfPoints: 0}}}}).data[parameterName].breakdown.numberOfPoints + 1);

                parameterData[parameterName] = {
                    dataPoints: [...existingDataPoints, {value: val, time: new Date().getTime()}],
                    parameterName: parameterName,
                    parameterUnits: unt,
                    breakdown: {
                        current: val,
                        min: getMin(val, existingBreakdown.min),
                        max: getMax(val, existingBreakdown.max),
                        exponentialMovingAverage: getExponentialMovingAverage(val, existingBreakdown.exponentialMovingAverage, 2, existingBreakdown.numberOfPoints + 1),
                        mean: (existingBreakdown.sum + val) / (existingBreakdown.numberOfPoints + 1),

                        sum: existingBreakdown.sum + val,
                        numberOfPoints: existingBreakdown.numberOfPoints + 1,
                    },

                }
            });

            const timeStamp = Date.now();

            // console.log('Finished building parameter data');
            return {
                ...state,
                deviceData: {
                    ...state.deviceData,
                    [action.payload.deviceKey]: {
                        ...state.deviceData[action.payload.deviceKey],
                        parameterNames: getUnique((state.deviceData[action.payload.deviceKey] || {parameterNames: []}).parameterNames, Object.keys(action.payload.data)),
                        data: {
                            ...(state.deviceData[action.payload.deviceKey] || {data: {}}).data,
                            ...parameterData,
                        },
                        timeData: {
                            ...(state.deviceData[action.payload.deviceKey] || {timeData: {}}).timeData,
                            [timeStamp]: buildTimeData(parameterData, action.payload.gpsCoords),
                        },
                        timeStamps: [...(state.deviceData[action.payload.deviceKey] || {timeStamps: []}).timeStamps, timeStamp],
                    },
                },
            };
        },
    },
});

export const { addDeviceData, } = deviceDataSlice.actions;
export default deviceDataSlice.reducer;