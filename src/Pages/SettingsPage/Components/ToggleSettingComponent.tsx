import React, { FC, useState, } from 'react';
import { SettingObj } from '../../../redux/slices/deviceSettingsSlice';
import { StyleSheet, View, Text, Switch, } from 'react-native';

interface ToggleSettingComponentProps {
    setting: SettingObj;
    level: number;
    onChangeValue: ((setting: SettingObj) => void);
}

const ToggleSettingComponent: FC<ToggleSettingComponentProps> = ({setting, level, onChangeValue}) => {
    // const [isEnabled, setIsEnabled] = useState<boolean>(true);

    return (
        <View style={StyleSheet.compose(styles.container, {marginLeft: level * 10})}>
            <Text style={styles.descriptionText}>{setting.description}</Text>
            <Switch style={{}} onValueChange={(val: boolean) => {
                onChangeValue({
                    ...setting,
                    currentVal: val,
                })
            }} value={typeof setting.currentVal == 'boolean' ? setting.currentVal : false} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderBottomWidth:1,
        borderStyle:"solid",
        borderColor: 'gray',
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingTop:15,
        marginRight: 10,
    },

    descriptionText: {
        fontSize: 20,
        color: 'black',
    },

    valueText: {
        fontSize: 20,
        color: 'black',
    },

    switchStyle: {
        color: "black"
    },
})

export default ToggleSettingComponent;