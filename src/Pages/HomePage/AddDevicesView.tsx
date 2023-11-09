import React, {FC} from "react";
import { View, Text, Image, StyleSheet, } from "react-native";

interface AddDevicesViewProps {

};

const AddDevicesView: FC<AddDevicesViewProps> = React.memo(({}) => {
    return (
        <View>
            <View style={styles.seperator} />
            <View style={{width: '100%'}}>
                <Text style={styles.titleText}>Welcome to the 2B Connect App!</Text>
            </View>
            <View style={styles.seperator} />
            {/* Add 2B Logo */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{width: 100, height: 100}} source={require('../../../Assets/splash.png')} />
            </View>

            {/* Provide a link to the Add Devices Page */}
            <View style={styles.seperator} />

            <View style={{width: '90%', paddingHorizontal: '5%'}}>
                <Text style={styles.titleText}>To get started, please add a device by pressing on the + button on the bottom nav bar.</Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    seperator: {
        height: '10%',
    },

    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    }
});

export default AddDevicesView;