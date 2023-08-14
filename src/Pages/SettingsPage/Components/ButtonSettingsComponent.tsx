import React, { FC, useState, } from 'react';
import { SettingObj } from '../../../redux/slices/deviceSettingsSlice';
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native';

interface ButtonSettingComponentProps {
    setting: SettingObj;
    level: number;
    onChangeValue: ((setting: SettingObj) => void);
    onPress: (() => void);
}

const ButtonSettingComponent: FC<ButtonSettingComponentProps> = React.memo(({setting, level, onChangeValue, onPress}) => {
    // const [isEnabled, setIsEnabled] = useState<boolean>(true);

    return (
        <View style={StyleSheet.compose(styles.container, {marginLeft: level * 10})}>
            <Text style={styles.descriptionText}>{setting.description}</Text>
            <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={onPress}>
                <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Start</Text>
            </TouchableOpacity>
        </View>
    );
});

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

    defaultTextStyle: {
        color: 'black',
        fontSize: 12,
    },

    defaultButton: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10, 
        marginRight: 10, 
        borderRadius: 10,
    },
    
    button: {
        borderColor: 'black',
        borderWidth: 1,

        marginTop: 10,
        marginBottom: 10,
        width: '33%',
        marginLeft: '5%',
        marginRight: '5%',

        // backgroundColor: '#d3d3d3',
        backgroundColor: '#055D9C',

        borderBottomWidth: 2,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
})

export default ButtonSettingComponent;