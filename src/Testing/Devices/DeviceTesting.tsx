import React, { FC, useEffect, } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { ConnectionType, DeviceDefinition, DeviceId, discoverDevice } from '../../redux/slices/deviceSlice';
import { addDeviceData } from '../../redux/slices/deviceDataSlice';
import { Dispatch, AnyAction, ThunkDispatch, Action } from '@reduxjs/toolkit';
import { DeviceReading, applyData } from '../../redux/middleware/logDataMiddleware';
import { ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

const wait = (ms: number) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(undefined)
    }, ms)
    )

const createTestDevices = async (dispatch: Dispatch<AnyAction>, onCreateData: ((deviceReading: DeviceReading) => Promise<void>)) => {
    console.log('Creating test devices');

    const testDevices: DeviceDefinition[] = [
        {
            deviceKey: 'TestDevice1',
            deviceName: 'PAM-0001',
            connectionType: ConnectionType.DirectConnect,
            isConnected: false,
        },
        {
            deviceKey: 'TestDevice2',
            deviceName: 'PAM-0002',
            connectionType: ConnectionType.Beacon,
            isConnected: false,
        },
        // {
        //     deviceKey: 'TestDevice2',
        //     deviceName: 'PAM-0002',
        //     connectionType: ConnectionType.DirectConnect,
        // },
        // {
        //     deviceKey: 'TestDevice3',
        //     deviceName: 'PAM-0003',
        //     connectionType: ConnectionType.DirectConnect,
        // },
        // {
        //     deviceKey: 'TestDevice4',
        //     deviceName: 'PAM-0004',
        //     connectionType: ConnectionType.DirectConnect,
        // },
        // {
        //     deviceKey: 'TestDevice5',
        //     deviceName: 'PAM-0005',
        //     connectionType: ConnectionType.DirectConnect,
        // },
    ];

    for (let i = 0; i < testDevices.length; i++) {
        // console.log('Adding device: ', deviceDef);
        dispatch(discoverDevice(testDevices[i]));
        createTestData1(testDevices[i].deviceKey, onCreateData);
        await wait(250);
    }
}

const randomRange = (min: number, max: number) => {
    return Math.random() * (max - min + 1) + min;
}

const createTestData1 = async (deviceKey: DeviceId, onCreateData: ((deviceReading: DeviceReading) => Promise<void>)) => {
    // console.log('Starting create test data loop for ', deviceKey);

    // Infinite loop
    for (;;) {
        // Wait 1 second
        await wait(10000);
        
        const testData: DeviceReading = {
            deviceKey: deviceKey,
            data: {
                CO: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                CO2: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                O3: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                PM1: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                'PM 2.5': {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                'PM 10': {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                SO2: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                NO: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                NO2: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                NOx: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
                Methane: {
                    val: randomRange(5, 50),
                    unt: 'ppm'
                },
            }
        };
        // console.log('Adding test device data for ', deviceKey);
        // dispatch(addDeviceData(testData));
        onCreateData(testData);
    }
};

interface DeviceTesterProps {
    onCreateData: ((deviceReading: DeviceReading) => Promise<void>)
}

const DeviceTester: FC<DeviceTesterProps> = ({onCreateData}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        createTestDevices(dispatch, onCreateData);
    }, []);

    return (
        <></>
    )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
    return {
        onCreateData: (deviceReading: DeviceReading) => dispatch(applyData(deviceReading)),
    };
}

export default connect(undefined, mapDispatchToProps)(DeviceTester);