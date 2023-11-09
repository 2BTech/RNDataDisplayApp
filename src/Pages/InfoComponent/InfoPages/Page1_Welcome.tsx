import React, { FC, useState, } from 'react';
import { View, Text, StyleSheet, Dimensions, } from 'react-native';
import BulletPoint from '../../Components/bulletPoint';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface WelcomePageProps {
    jumpToPage: ((pageIndex: number) => void)
}

const WelcomePage: FC<WelcomePageProps> = React.memo(({jumpToPage}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%',}}>
            <View style={{height: '25%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: seperatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.titleText}>Welcome to the 2B Connect App!</Text>
                    </View>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <View style={{height: '10%'}} />
            <Text style={styles.contentText}>The 2B Connect app allows for easy access to Bluetooth enabled 2B Technologies devices.</Text>

            <View style={{height: '20%'}} />
            <Text style={styles.featuresText}>Features:</Text>
            
            <View style={{width: '90%', flex: 1, marginHorizontal: '5%'}}>
                <BulletPoint onPress={() => jumpToPage(1)} text='Connect to devices' />
                <BulletPoint onPress={() => jumpToPage(2)} text='View Real Time Data' />
                <BulletPoint onPress={() => jumpToPage(4)} text='Log and Export Data' />
                <BulletPoint onPress={() => jumpToPage(6)} text='View and Change Device Settings' />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    contentText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',

        width: '90%', 
        marginHorizontal: '5%',
    },

    featuresText: {
        color: 'black',
        fontSize: 22,

        width: '90%', 
        marginHorizontal: '5%',
    },

    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
});

export default WelcomePage;