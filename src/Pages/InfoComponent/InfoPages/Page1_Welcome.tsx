import React, { FC, useState, } from 'react';
import { View, Text, StyleSheet, } from 'react-native';

interface WelcomePageProps {
    jumpToPage: ((pageIndex: number) => void)
}

const WelcomePage: FC<WelcomePageProps> = React.memo(({jumpToPage}) => {

    const bullet = (text: String, onPress: (() => void)) => {
        return (
          <View style={ styles.row }>
            <View style={ styles.bullet }>
              <Text style={styles.bulletPoint}>{'\u2022' + " "}</Text>
            </View>
            <View style={ styles.bulletText }>
              <Text style={styles.bulletText} onPress={onPress}>{text}</Text>
            </View>
          </View>
        );
    }

    return (
        <View style={{width: '90%', marginHorizontal: '5%'}}>
            <View style={{height: '15%'}} />
            <Text style={styles.titleText}>Welcome to the 2B Connect App!</Text>
            <View style={{height: '10%'}} />
            <Text style={styles.contentText}>The 2B Connect app allows for easy access to Bluetooth enabled 2B Technologies devices.</Text>

            <View style={{height: '20%'}} />
            <Text style={styles.featuresText}>Features:</Text>
            {
                bullet('View Real Time Data', () => jumpToPage(1))
            }
            {
                bullet('Log and Export Data', () => jumpToPage(3))
            }
            {
                bullet('View and Change Device Settings', () => jumpToPage(5))
            }
        </View>
    );
});

const styles = StyleSheet.create({
    contentText: {
        fontSize: 18,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },

    featuresText: {
        color: 'black',
        fontSize: 22,
    },

    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },



    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flex: 1,
        marginVertical: 4,
    },
    bullet: {
        width: 10,
        color: 'black',
    },
    bulletText: {
        flex: 1,
        color: 'blue',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
    bulletPoint: {
        fontSize: 18,
        color: 'black',
    },
});

export default WelcomePage;