import { createSlice } from "@reduxjs/toolkit";
import type { DeviceId } from "./deviceSlice";
import { GPSCoordinate } from "./gpsSlice";
import { convertGPSToString } from "../../Utils/GPSUtils";
import { ParameterDefaultUnits } from "../../Constants/Parameters/ParameterDefs";
 
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
    firstDataTimeStamp: number | undefined;
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
            parameterUnits: ParameterDefaultUnits.CO,
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
            parameterUnits: ParameterDefaultUnits.CO2,
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
            parameterUnits: ParameterDefaultUnits.O3,
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
            parameterUnits: ParameterDefaultUnits.PM1,
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
            parameterUnits: ParameterDefaultUnits['PM 2.5'],
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
            parameterUnits: ParameterDefaultUnits['PM 10'],
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
            parameterUnits: ParameterDefaultUnits.SO2,
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
            parameterUnits: ParameterDefaultUnits.NO,
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
            parameterUnits: ParameterDefaultUnits.NO2,
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
            parameterUnits: ParameterDefaultUnits.NOx,
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
            parameterUnits: ParameterDefaultUnits.Methane,
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
    firstDataTimeStamp: undefined,
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

// A default ParameterDataObj that is used to initialize the parameter data object
const defaultParameterData: ParameterDataObj = {
    dataPoints: [],
    parameterName: '',
    parameterUnits: '',
    breakdown: {
        min: 0,
        max: 0,
        mean: 0,
        exponentialMovingAverage: 0,
        current: 0,

        sum: 0,
        numberOfPoints: 0,
    },
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

// Helper function that removes all entries from the object that are older than the given value
const removeOldEntries = (obj: TimeDataMap, timeStamp: number) => {
    // If the object is undefined or empty, return an empty object
    if (obj === undefined || Object.keys(obj).length == 0) {
        return {};
    }

    // Create a new object to store the new data
    let ret: TimeDataMap = {};

    // Get a list of all the keys in the object. Parse from strings to numbers because the keys are timeStamps and will be used for comparison or insertion
    let keys: number[] = Object.keys(obj).map(key => parseInt(key));

    // Search through the keys until we find the first key that is greater than the given value
    let i = 0;
    while (i < keys.length && keys[i] < timeStamp) {
        i++;
    }

    // For each key that is greater than the given value, add it to the new object
    for (i; i < keys.length; i++) {
        ret[keys[i]] = obj[keys[i]];
    }

    // Return the cleaned object
    return ret;
}

// Takes a list of timeStamps and removes all entries that are older than the given value
const removeOldTimeStamps = (timeStamps: number[], timeStamp: number) => {
    // If the list is undefined or empty, return an empty list
    if (timeStamps === undefined || timeStamps.length == 0) {
        return [];
    }

    // Search through timeStamps until we find the first timeStamp that is greater than the given value
    let i = 0;
    while (i < timeStamps.length && timeStamps[i] < timeStamp) {
        i++;
    }

    // Return the timeStamps that are greater than the given value
    return timeStamps.slice(i);
}

// Helper function that filters out old DataPointObj's from an array
const removeOldDataPoints = (dataPoints: DataPointObj[], timeStamp: number) => {
    // If the list is undefined or empty, return an empty list
    if (dataPoints === undefined || dataPoints.length == 0) {
        return [];
    }

    // Search through the dataPoints until we find the first dataPoint that is greater than the given value
    let i = 0;
    while (i < dataPoints.length && dataPoints[i].time < timeStamp) {
        i++;
    }

    // Return the dataPoints that are greater than the given value
    return dataPoints.slice(i);
}

// Constant that holds the number of milliseconds in an hour
const millisecondsInHour = 1000 * 60 * 60;

export const deviceDataSlice = createSlice({
    name: 'deviceDataSlice',
    initialState,
    reducers: {
        // Create initial objects for the given device
        // action.payload: {
        //  deviceKey: string,
        // }
        addDeviceToData: (state, action) => {
            return {
                ...state,
                deviceData: {
                    ...state.deviceData,
                    [action.payload.deviceKey]: {
                        parameterNames: [],
                        data: {},
                        timeData: {},
                        timeStamps: [],
                        // Tracks when the first data was added
                        firstDataTimeStamp: undefined,
                    },
                },
            }
        },

        // Updated version of AddDeviceData that contains less if statements
        // action.payload: {
        //  deviceKey: string,
        //  data: {
        //      [key: string]: {
        //          val: number,
        //          unt: string,
        //      }
        //  },
        //  gpsCoords: GPSCoordinate,
        // }
        addDeviceData: (state, action) => {
            // Used to relate the measurement to the time it was taken
            const timeStamp = Date.now();

            // Build the updated parameter data object
            let parameterData: ParameterMap = {
                ...state.deviceData[action.payload.deviceKey].data
            };

            // For each parameter in the new data, update the parameter data
            // Example:
            //  {
            //      CO: {
            //          val: 0.5,
            //          unt: 'ppm',
            //      }
            //  }
            Object.keys(action.payload.data).forEach((parameterName: string) => {
                // Extract the value and units for the current parameter
                const {val, unt} = action.payload.data[parameterName];

                // Get the existing data for the parameter
                const existingData: ParameterDataObj = (parameterData[parameterName] || {...defaultParameterData, parameterName: parameterName, parameterUnits: unt});
                // Get the existing breakdown for the parameter
                const existingBreakdown = existingData.breakdown;

                // Add the parameter data to the parameter data object
                parameterData[parameterName] = {
                    dataPoints: [...removeOldDataPoints(existingData.dataPoints, timeStamp - millisecondsInHour), {value: val, time: timeStamp}],
                    parameterName,
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

            return {
                // Copy the existing state
                ...state,
                // Overwrite the device data with the updated data
                deviceData: {
                    // Copy the existing device data for other devices
                    ...state.deviceData,
                    // Overwrite the device data for the given device
                    [action.payload.deviceKey]: {
                        // Copy the existing device data
                        ...state.deviceData[action.payload.deviceKey],
                        // If the first data point was added, set the first data point time stamp
                        firstDataTimeStamp: state.deviceData[action.payload.deviceKey].firstDataTimeStamp || timeStamp,
                        // Update the parameter names by getting all unique parameter names from the new data and the existing parameter names
                        parameterNames: getUnique((state.deviceData[action.payload.deviceKey] || {parameterNames: []}).parameterNames, Object.keys(action.payload.data)),
                        // Update the time data
                        timeData: {
                            // Remove all entries that are older than 1 hour
                            ...removeOldEntries(state.deviceData[action.payload.deviceKey].timeData, timeStamp - millisecondsInHour),
                            // Add the new time data
                            [timeStamp]: buildTimeData(parameterData, action.payload.gpsCoords),
                        },
                        // Update the time stamps
                        timeStamps: [...removeOldTimeStamps(state.deviceData[action.payload.deviceKey].timeStamps, timeStamp - millisecondsInHour), timeStamp],
                        // Update the parameter data
                        data: parameterData,
                    },
                },
            }
        },
    },
});

export const { addDeviceData, addDeviceToData, } = deviceDataSlice.actions;
export default deviceDataSlice.reducer;