import React, { FC } from "react";
import { StyleSheet, TouchableNativeFeedback, View, TouchableOpacity, } from "react-native";
// import Dropdown, { DropdownItem } from "../Components/Dropdown/Dropdown";
import { DeviceDefinition, DeviceId } from "../../redux/slices/deviceSlice";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faQuestion, } from "@fortawesome/free-solid-svg-icons";
import Dropdown, { DropdownItem } from "../Components/Dropdown/DropdownV2";

interface PageHeaderProps {
    availableDevices: Array<DeviceDefinition>;
    selectedDevice: DropdownItem;
    infoFunction: undefined | (() => void);
    selectDeviceFunction: ((selected: DropdownItem) => void);
}

const PageHeader: FC<PageHeaderProps> = ({availableDevices, selectedDevice, infoFunction, selectDeviceFunction}) => {
    const deviceOptions: Array<DropdownItem> = availableDevices.map((device: DeviceDefinition) => {
        const t: DropdownItem = {
            label: device.deviceName,
            value: device.deviceKey,
        }
        return t;
    });

    return (
        <View style={styles.container}>
            <View style={{width: '80%', height: '100%'}}>
                <Dropdown 
                    currentVal={selectedDevice} 
                    options={availableDevices.map(dev => {
                        return {
                            value: dev.deviceKey,
                            label: dev.deviceName,
                        }
                    })} 
                    onSelectItem={selectDeviceFunction}
                    itemStartHeight={0}
                    />
            </View>
            <TouchableOpacity style={styles.iconContainer} onPress={infoFunction ? infoFunction : () => {}}>
                <FontAwesomeIcon icon={faQuestion} color='white' size={30} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
    },

    iconContainer: {
        marginTop: 10,
        width: 50,
        height: 50,

        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'white',

        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PageHeader;