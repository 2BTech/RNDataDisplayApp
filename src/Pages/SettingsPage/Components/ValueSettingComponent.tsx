import React, { FC, } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SettingObj } from "../../../redux/slices/deviceSettingsSlice";

interface ValueSettingComponentProps {
    setting: SettingObj;
    level: number;
    onChangeValue: ((setting: SettingObj) => void);
}

const ValueSettingComponent: FC<ValueSettingComponentProps> = ({setting, level, onChangeValue, }) => {
    return (
        <View style={StyleSheet.compose(styles.container, {marginLeft: level * 10})}>
            <Text style={styles.descriptionText}>{setting.description}</Text>
            <Text style={styles.valueText}>{setting.currentVal}</Text>
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
});

export default ValueSettingComponent;