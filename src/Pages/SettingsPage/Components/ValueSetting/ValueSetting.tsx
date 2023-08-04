import React, { FC } from "react";
import { StyleSheet, View, Text, } from 'react-native';

interface ValueSettingProps {
    description: string;
    value: number | string;
}

const ValueSetting: FC<ValueSettingProps> = React.memo(({description, value}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.descriptionText}>{description}: </Text>
            <Text style={styles.valueText}>{value}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingTop: 15,
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
})

export default ValueSetting;
