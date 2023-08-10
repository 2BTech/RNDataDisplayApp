import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Image from 'react-native-scalable-image';

interface AddDevicesDescriptionProps {

}

const AddDevicesDescription: FC<AddDevicesDescriptionProps> = React.memo(({}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '90%', marginHorizontal: '5%'}}>
            <View style={{height: '15%'}}>
                <View style={{height: seperatorHeight}} />
                <Text style={styles.titleText}>Add Devices Page</Text>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <View style={{height: '85%'}}>
                <ScrollView style={{width: '100%', height: '100%'}}>
                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The Add Devices Page provides an interface for connecting to and disconnecting from different devices. To access the page, press the button with the + icon on the bottom navigation bar.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth} source={require('../../../../screenShots/AddDevicesPage/AddDevicesPage.png')} />
                    </View>

                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The page displays 2 lists of devices: Connected Devices and Available Devices. The Avaialble Devices list will be cleared on an interval to make sure only availabe devices are present in the list. To connect to an available device, press on the green + icon on the device widget.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth * (4/3)} source={require('../../../../screenShots/AddDevicesPage/DeviceCard.png')} />
                    </View>

                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>To Disconnect from a device, press on the red - button on the device widget.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth} source={require('../../../../screenShots/AddDevicesPage/AddDevicesPageConnected.png')} />
                    </View>

                </ScrollView>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    contentText: {
        fontSize: 18,
        color: 'black',
        width: '100%',
        textAlign: 'center',
        flex: 1,
        alignSelf: 'stretch',
    },
    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },

    sectionTitleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
});

export default AddDevicesDescription;