import React, {FC} from "react";
import { View, Text, Image, StyleSheet, } from "react-native";

interface AddDevicesViewProps {

};

const AddDevicesView: FC<AddDevicesViewProps> = React.memo(({}) => {
    return (
        <View>
            <View style={styles.separator} />
            <View style={{width: '100%'}}>
                <Text style={styles.titleText}>Welcome to the 2B Connect App!</Text>
            </View>
            <View style={styles.separator} />
            {/* Add 2B Logo */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{width: 100, height: 100}} source={require('../../../Assets/splash.png')} />
            </View>

            {/* Provide a link to the Add Devices Page */}
            <View style={styles.separator} />

            <View style={{width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.titleText}>To get started, please add a device by pressing on the + button on the bottom nav bar.</Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    separator: {
        height: '10%',
    },

    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddDevicesView;