import React, { FC, useState, } from 'react';
import { View, Text, StyleSheet, } from 'react-native';

interface WelcomePageProps {

}

const WelcomePage: FC<WelcomePageProps> = React.memo(({}) => {
    return (
        <View style={{width: '90%', marginHorizontal: '5%'}}>
            <View style={{height: '15%'}} />
            <Text style={styles.titleText}>Welcome to the 2B Connect App!</Text>
            <View style={{height: '10%'}} />
            <Text style={styles.contentText}>The 2B Connect app is your one stop shop for interacting with Bluetooth enabled 2B Technologies devices. Using the </Text>

            <View style={{height: '20%'}} />
            <Text style={styles.contentText}>Features:</Text>
            <Text style={styles.contentText}>View real time data</Text>
            <Text style={styles.contentText}>Log and export data</Text>
            <Text style={styles.contentText}>Change device settings</Text>
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
        backgroundColor: 'white',
        alignSelf: 'stretch',
    },
    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
});

export default WelcomePage;