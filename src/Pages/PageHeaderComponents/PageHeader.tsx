import React, { FC } from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import Dropdown, { DropdownItem } from "../Components/Dropdown/Dropdown";
import { DeviceDefinition, DeviceId } from "../../redux/slices/deviceSlice";
import { Icon } from "react-native-elements";

interface PageHeaderProps {
    availableDevices: Array<DeviceDefinition>;
    infoFunction: undefined | (() => void);
    selectDeviceFunction: undefined | ((deviceKey: DeviceId) => void);
}

const PageHeader: FC<PageHeaderProps> = ({availableDevices, infoFunction, selectDeviceFunction}) => {
    const deviceOptions: Array<DropdownItem> = availableDevices.map((device: DeviceDefinition) => {
        const t: DropdownItem = {
            label: device.deviceName,
            value: device.deviceKey,
        }
        return t;
    });

    const onSelectDevice = (item: DropdownItem) => {
        console.log(item);
        if (selectDeviceFunction) {
            selectDeviceFunction(item.value);
        }
    };

    return (
        <View style={styles.container}>
            <Dropdown defaultLabel="Select Device" data={deviceOptions} onSelect={onSelectDevice} />
            <View style={styles.iconContainer}>
                <TouchableNativeFeedback onPress={infoFunction ? infoFunction : () => {}} background={TouchableNativeFeedback.Ripple('#AAF', true)}>
                    <Icon name="question" type="font-awesome-5" color={'white'} />
                </TouchableNativeFeedback>
            </View>
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

        justifyContent: 'center',
    },
});

export default PageHeader;