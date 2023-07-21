import React, { FC, useState, } from "react";
import { ConnectedProps, connect, useSelector } from "react-redux";
import { ScrollView, SectionList, StyleSheet, View } from "react-native";
import DevicePageSection from "./Components/DevicePageSection";
import DeviceCard from "./Components/DeviceCard";
import { RootState } from "../../redux/store";
import { ConnectionType, DeviceDefinition, DeviceDefinitionMap, DeviceId, connectToDevice, disconnectFromDevice } from "../../redux/slices/deviceSlice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { connectToDirectConnect } from "../../redux/middleware/Bluetooth/BluetoothDirectMiddleware";

interface AddDevicesPageProps extends PropsFromRedux {

};

const AddDevicesPage: FC<AddDevicesPageProps> = ({connectToDirectCon}) => {
    const deviceDefs: DeviceDefinitionMap = useSelector((state: RootState) => state.deviceSlice.deviceDefinitions);
    const available = useSelector((state: RootState) => state.deviceSlice.availableDevices);
    const connected = useSelector((state: RootState) => state.deviceSlice.connectedDevices);
    const dispatch = useDispatch();

    const connectionData = {
        connected: {
            title: 'Connected Devices',
            data: new Array<DeviceDefinition>,
        },
        available: {
            title: 'Available Devices',
            data: new Array<DeviceDefinition>,
        },
    }

    Object.values(available).forEach(deviceId => {
        if (deviceId != 'Default' && deviceDefs[deviceId]) {
            connectionData.available.data.push(deviceDefs[deviceId]);
        }
    });
    Object.values(connected).forEach(deviceId => {
        if (deviceId != 'Default' && deviceDefs[deviceId]) {
            connectionData.connected.data.push(deviceDefs[deviceId]);
        }
    });

    // Object.values(deviceDefs).forEach(def => {
    //     if (def.deviceKey == 'Default') {
    //         return;
    //     }

    //     if (def.isConnected) {
    //         connectionData.connected.data.push(def);
    //     } else {
    //         connectionData.available.data.push(def);
    //     }
    // });

    const connectToBeacon = (deviceKey: DeviceId): void => {
        console.log('Connect to beacon: ', deviceDefs[deviceKey].deviceName);
        dispatch(connectToDevice(deviceKey));
    }
    const connectToDirect = (deviceKey: DeviceId): void => {
        console.log('Connect to direct: ', deviceDefs[deviceKey].deviceName);
        connectToDirectCon(deviceKey);
    }
    const disconnectBeacon = (deviceKey: DeviceId): void => {
        console.log('Disconnect from beacon: ', deviceDefs[deviceKey].deviceName);
        dispatch(disconnectFromDevice(deviceKey));
    }
    const disconnectDirect = (deviceKey: DeviceId): void => {
        console.log('Disconnect from direct: ', deviceDefs[deviceKey].deviceName);
        dispatch(disconnectFromDevice(deviceKey));
    }
    
    console.log('Rendering add devices page');
    return (
        <View style={styles.container}>
            <SectionList
                sections={Object.values(connectionData)}
                keyExtractor={(item, index) => item.deviceName + index}
                renderItem={({item, index}) => {
                    return (
                        <DeviceCard deviceName={item.deviceName} isConnected={item.isConnected} cardFunct={item.connectionType == ConnectionType.Beacon ? (item.isConnected ? () => {disconnectBeacon(item.deviceKey)} : () => {connectToBeacon(item.deviceKey)}) : (item.isConnected ? () => {disconnectDirect(item.deviceKey)} : () => {connectToDirect(item.deviceKey)})} connectionType={item.connectionType} isEven={index % 2 == 0} />
                    );
                }}
                renderSectionHeader={({section: {title}}) => <DevicePageSection sectionName={title} />}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
    return {
        connectToDirectCon: (deviceId: DeviceId) => {
            dispatch(connectToDirectConnect(deviceId));
        },
    };
}

const connector = connect(undefined, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AddDevicesPage);