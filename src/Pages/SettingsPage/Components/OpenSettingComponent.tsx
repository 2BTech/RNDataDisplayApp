import React, { FC, useState, } from "react";
import { SettingObj } from "../../../redux/slices/deviceSettingsSlice";
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-elements";

interface OpenSettingsProps {
    setting: SettingObj;
    level: number;
    onChangeValue: ((setting: SettingObj) => void);
}

const OpenSettingComponent: FC<OpenSettingsProps> = ({setting, level, onChangeValue}) => {
    const onChangeText = (text: string) => {
        console.log('Setting text to ', text);

        onChangeValue({
            ...setting,
            currentVal: typeof setting.currentVal == 'number' ? Number(text) : text,
        })

        // setTextVal(text);
        
        // // Update the toChange dictionary with the new setting
        // toChange[setting.id] = {
        //     id: setting.id,
        //     newValue: (setting.valueType = 'int') ? parseInt(text) : text,
        //     valueType: setting.valueType,
        //     isDevice: setting.isDevice,
        // };
        // if (setting.isDevice) {
        //     toChange[setting.id].deviceName = setting.;
        // }

        // setToChange(toChange);
    }

    return (
        <View style={StyleSheet.compose(styles.container, {marginLeft: level * 10})}>
            <Text style={styles.descriptionText}>{setting.description}</Text>
            <TextInput style={styles.input} onEndEditing={event => onChangeText(event.nativeEvent.text)} defaultValue={'' + setting.currentVal} />
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

    input: {
        borderWidth: 1, 
        borderRadius: 4, 
        height: 35, 
        margin:0, 
        textAlign: 'center', 
        minWidth: 60, 
        color:"black",
        backgroundColor: 'white',
    },
});

export default OpenSettingComponent;