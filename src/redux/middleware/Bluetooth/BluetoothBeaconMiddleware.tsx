import { Peripheral } from "react-native-ble-manager";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../store";
import { Action, CombinedState } from "redux";
import { Middleware } from "@reduxjs/toolkit";
import { updateBeaconData } from "../../slices/beaconSlice";
import { PackageConstantValueName, PacketConstants } from "../../../Constants/Bluetooth/BeaconBluetooth";
import { ParameterDefaultUnits, ParameterSigFigs } from "../../../Constants/Parameters/ParameterDefs";
import { DeviceReading, ParameterPointMap, applyData } from "../logDataMiddleware";
import { Platform } from "react-native";

const isAndroid = Platform.OS == 'android';

const arraysAreEqual: (arr1: number[], arr2: number[]) => boolean = (arr1: number[], arr2: number[]) => {
    if (arr1 == undefined || arr2 == undefined) {
        return false;
    } else if (arr1.length != arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

const bytesToShort: (byte1: number, byte2: number) => number = (byte1: number, byte2: number) => {
    return ((byte1 << 8) + byte2) & 0xFFFF;
}

const bytesToInt: (byte1: number, byte2: number, byte3: number, byte4: number) => number = (byte1: number, byte2: number, byte3: number, byte4: number) => {
    return ((byte1 & 0xFF) << 24) + ((byte2 & 0xFF) << 16) + ((byte3 & 0xFF) << 8) + (byte4 & 0xFF);
}

const bytesToFloat: (byte1: number, byte2: number, byte3: number, byte4: number) => number = (byte1: number, byte2: number, byte3: number, byte4: number) => {
    const buffer = new ArrayBuffer(4);
    const f32 = new Float32Array(buffer);
    const ui8 = new Uint8Array(buffer);

    ui8[3] = byte1;
    ui8[2] = byte2;
    ui8[1] = byte3;
    ui8[0] = byte4;

    return f32[0];
}

// Thunk action to parse beacon data
export function handleBeaconData(device: Peripheral) {
    return async (dispatch: ThunkDispatch<RootState, void, Action>, getState: () => CombinedState<RootState>) => {
        // Do not parse data for the device if it is not connected
        if (!getState().deviceSlice.connectedDevices.includes(device.id)) {
            // console.log('Ignoring data from not connected beacon: ', device.name);
            return;
        }

        const prevData = getState().beaconSlice[device.id];
        const curData = device.advertising.manufacturerData?.bytes || [];

        // Make sure the curData array is large enough to be complete
        if (curData == undefined || !(isAndroid ? curData.length >= 31 : curData.length >= 21)) {
            // console.log('Beacon data is incomplete for ', device.name);
            return;
        }

        if (arraysAreEqual(prevData, curData)) {
            // console.log('Beacon data has not changed for ', device.name);
            return;
        }
        
        // console.log('Parsing beacon data for ', device.name);

        // console.log('Cur: ', curData);
        // console.log('Pre: ', prevData);

        dispatch(updateBeaconData({
            deviceKey: device.id,
            data: curData,
        }));
        
        let serialNum = isAndroid ? bytesToShort(curData[12], curData[11]) : bytesToShort(curData[2], curData[1]);
        // console.log('Beacon ', device.name, ' serial number = ', serialNum);

        let marker: string = String.fromCharCode(isAndroid ? curData[14] : curData[4]);
        let value: number = isAndroid ? bytesToFloat(curData[18], curData[17], curData[16], curData[15]) : bytesToFloat(curData[8], curData[7], curData[6], curData[5]);

        const con: PacketConstants = Object.values(PacketConstants).find(value => value == marker) || PacketConstants.UNKNOWN_CONSTANT;
        
        if (con == PacketConstants.UNKNOWN_CONSTANT) {
            // Do not include unknown values
            return;
        }

        // console.log(PackageConstantValueName[con], ' = ', value);
        if (ParameterDefaultUnits[PackageConstantValueName[con]] == undefined) {
            console.log('No units for `', PackageConstantValueName[con], '`');
        }

        let data: ParameterPointMap = {

        };

        data[PackageConstantValueName[con]] = {
            val: value,
            unt: ParameterDefaultUnits[PackageConstantValueName[con]] || '',
        };

        // console.log('Units for ', con, ' - ', PackageConstantValueName[con], ' ', ParameterDefaultUnits[PackageConstantValueName[con]]);

        dispatch(applyData({
            deviceKey: device.id,
            data
        }));
    }
}

export const discoverDeviceMiddleware: Middleware<{}, RootState> = store => next => action => {
    if (action.type == 'deviceSlice/discoverDevice') {
        if (store.getState().deviceSlice.availableDevices.includes(action.payload.deviceKey)) {
            return;
        } else if (store.getState().deviceSlice.connectedDevices.includes(action.payload.deviceKey)) {
            return;
        }
    }

    return next(action);
}