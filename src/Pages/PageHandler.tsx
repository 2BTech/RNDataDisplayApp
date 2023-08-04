import React, { FC, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import PageHeader from "./PageHeaderComponents/PageHeader";
import { ConnectionType, DeviceDefinition, DeviceId, DeviceSliceState } from "../redux/slices/deviceSlice";
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import PageNavBar, { NavButtonDef } from "./PageHeaderComponents/PageNavBar";
import HomePage from "./HomePage/HomePage";
import AddDevicesPage from "./AddDevicesPage/AddDevicesPage";
import FilesPage from "./FilesPage/FilesPage";
import TreksPage from "./TreksPage/TreksPage";
import SettingsPage from "./SettingsPage/SettingsPage";
import AllFilesPage from "./AllFilesPage/AllFilesPage";
import { faHome, faFolder, faGears, faMap, faFolderOpen, faPlus, } from "@fortawesome/free-solid-svg-icons";
import { DropdownItem } from "./Components/Dropdown/DropdownV2";

interface PageHandlerProps {

}

const PageHandler: FC<PageHandlerProps> = React.memo(({}) => {
    const deviceDefs: DeviceSliceState = useSelector((state: RootState) => state.deviceSlice);
    const [selectedDevice, setSelectedDevice] = useState<DeviceDefinition>(deviceDefs.deviceDefinitions['Default']);
    const [selectedPage, setSelectedPage] = useState<string>('Home');

    const renderSelectedPage = (pageName: string) => {
        switch (pageName) {
            case 'Home':
                return (
                    <HomePage deviceKey={selectedDevice.deviceKey} pageHeight={Dimensions.get('screen').height * 0.8} />
                );

            case 'Files':
                // console.log('Rendering files page');
                return (
                    <FilesPage deviceKey={selectedDevice.deviceKey} deviceRemoteFiles={[]} startDownloadingFile={(fileName: string, deviceKey: DeviceId) => {console.log('Start downloading ', fileName, ' from ', deviceKey)}} />
                );

            case 'All Files':
                return (
                    <AllFilesPage devices={{}} />
                );

            case 'Devices':
                return (
                    <AddDevicesPage />
                );

            case 'Treks':
                return (
                    <TreksPage deviceKey={selectedDevice.deviceKey} />
                );

            case 'Settings': 
                return (
                    <SettingsPage deviceKey={selectedDevice.deviceKey} />
                );

            default:
                return (
                    <View style={styles.container}>
                        <Text>Unhandled page type: {pageName}</Text>
                    </View>
                )
        }
    }

    let navButtons: NavButtonDef[] = [
        {
            title: 'Home',
            icon: faHome
        },
    ];
    if (selectedDevice.deviceKey != 'Default') {
        navButtons.push({
            title: 'Files',
            icon: faFolder,
        });

        if (selectedDevice.connectionType == ConnectionType.DirectConnect) {
            navButtons.push({
                title: 'Settings',
                icon: faGears,
            });
        }
        navButtons.push({
            title: 'Treks',
            icon: faMap,
        });
    }

    navButtons.push({
        title: 'All Files',
        icon: faFolderOpen,
    });

    navButtons.push({
        title: 'Devices',
        icon: faPlus,
    });

    const updateSelectedDevice: (selected: DropdownItem) => void = (selected) => {
        setSelectedDevice(Object.values(deviceDefs.deviceDefinitions).find(dev => dev.deviceKey == selected.value) || deviceDefs.deviceDefinitions['Default']);
    }

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.headerContainer}>
                <PageHeader selectedDevice={{label: selectedDevice.deviceName, value: selectedDevice.deviceKey}} availableDevices={deviceDefs.connectedDevices.map(deviceKey => deviceDefs.deviceDefinitions[deviceKey])} selectDeviceFunction={updateSelectedDevice} infoFunction={undefined} />
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
            {
                renderSelectedPage(selectedPage)
            }
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <PageNavBar buttons={navButtons} onSelectNewPage={setSelectedPage} selectedPage={selectedPage} />
            </View>

        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
    },

    // Header styles
    headerContainer: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor: 'lightblue',
    },

    // Content styles
    contentContainer: {
        width: '100%',
        height: '80%',
        flexDirection: 'row',
    },

    // Footer styles
    footerContainer: {
        width: '100%',
        height: '10%',
        flex: 1,
        flexDirection: 'row',
    },
});

export default PageHandler;