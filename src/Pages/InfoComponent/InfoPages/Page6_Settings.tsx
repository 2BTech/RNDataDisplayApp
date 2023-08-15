import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Image from '../../Components/react-native-scalable-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

interface SettingsDescriptionProps {

}

const SettingsDescription: FC<SettingsDescriptionProps> = React.memo(({}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%',}}>
            <View style={{height: '15%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: seperatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faGears} size={35} />
                        <Text style={styles.titleText}>Settings Page</Text>
                    </View>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <View style={{height: '85%'}}>
                <ScrollView style={{width: '100%', height: '100%'}} showsVerticalScrollIndicator={false}>
                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The Settings Page is used to change the settings on a connected direct connect device. This page is not available for beacon devices. To access the Settings Page, first select the desired direct connect device and then press on the button with the gears icon on the bottom navigation bar.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth} source={require('../../../../screenShots/SettingsPage/SettingsPage.png')} />
                    </View>

                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The Settings Page displays the settings for the selected device in a few different ways. After changing one or more settings, press Save to write the changes to the connected device.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <Text style={styles.contentText}>To revert the page settings back to the initial values, press refresh. All changes will be reverted back to the initial value and the page will be updated to reflect the changes.</Text>
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
        textAlign: 'center',
        flex: 1,
        alignSelf: 'stretch',

        width: '90%', marginHorizontal: '5%',
    },
    titleText: {
        fontSize: 25,
        color: 'black',
        width: '65%',
        textAlign: 'center',
    },

    sectionTitleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
});

export default SettingsDescription;