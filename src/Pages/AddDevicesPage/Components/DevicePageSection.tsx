import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native';
import { Icon } from 'react-native-elements';

interface DevicePageSectionProps {
    sectionName: string;
};

const DevicePageSection: FC<DevicePageSectionProps> = ({sectionName}) => {
    return (
        <Text style={styles.text}>{sectionName}</Text>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     borderWidth: 2,
    //     borderRadius: 5,

    //     flexDirection: 'row',

    //     width: '80%',
    //     height: 50,
    //     justifyContent: 'space-between',
    //     alignContent: 'center',

    //     marginHorizontal: 10,
    //     paddingHorizontal: 10,
    //     marginTop: 15,
    // },
    // sectionTitleText: {
    //     fontSize: 20,
    //     textAlignVertical: 'center',
    // }

    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,

        marginLeft: '5%',
        marginVertical: 5,
    },
})

export default DevicePageSection;