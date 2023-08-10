import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Image from 'react-native-scalable-image';

interface TreksDescriptionPageProps {

}

const TreksDescriptionPage: FC<TreksDescriptionPageProps> = React.memo(({}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '90%', marginHorizontal: '5%'}}>
            <View style={{height: '15%'}}>
                <View style={{height: seperatorHeight}} />
                <Text style={styles.titleText}>Treks Page</Text>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <View style={{height: '85%'}}>
                <ScrollView style={{width: '100%', height: '100%'}}>
                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>One of the main challenges when collecting data is how to correlate the data to the location it was recorded at. To overcome this challenge, users can record data in Treks. A Trek is a collection of data that is correlated to the location it was recorded at. </Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth} source={require('../../../../screenShots/SettingsPage/SettingsPage.png')} />
                    </View>

                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The Treks page consists of 3 components: Trek Name, Start Time, and End Time. The Trek Name component holds the name for the Trek. The default name for the field is {"{DeviceName}_{Date Time}.kml"}. The Start and End time components are used to change the bounds of the data included in the Trek. This is useful for removing extra data such as the data collected between when a device connects but is before the Trek starts.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <Text style={styles.contentText}>After a Trek is created, the Trek can be found in the Device Files or All Files page. Treks are created as kml files, a type of file that maps location data to text data. The files can be opened in programs such as Google Earth.</Text>
                    <View style={{height: seperatorHeight / 2}} />

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

export default TreksDescriptionPage;