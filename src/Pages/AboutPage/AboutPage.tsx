import React, { FC, } from "react";
import { StyleSheet, View, Text,TouchableOpacity, Linking, } from "react-native";

interface AboutPageProps {
    openTutorial: (() => void)
}

const AboutPage: FC<AboutPageProps> = React.memo(({openTutorial}) => {
    return (
        <View style={styles.container}>
            <View style={{height: '5%'}} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>2B Connect</Text>
            </View>

            <View style={{height: '10%'}} />

            <View>
                <Text style={styles.infoText}>Build Version: 2.1.2</Text>
                <Text style={styles.infoText}>Build Date: Sep 2023</Text>
            </View>

            <View style={{width: '100%', flexDirection: 'row'}}>
                <Text style={styles.supportText}>Support: </Text>
                <Text style={StyleSheet.compose(styles.supportText, {color: 'blue', textDecorationLine: 'underline'})} onPress={() => Linking.openURL('https://twobtech.com')}>https://twobtech.com</Text>
            </View>

            <View style={{height: '30%'}} />

            <View style={{width: '100%', alignItems: 'center'}}>
                <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={openTutorial}>
                    <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Tutorial</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '100%',
        marginHorizontal: '5%',
    },

    titleContainer: {
        width: '100%',
        height: '10%',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 25,
        color: 'black',
    },

    infoText: {
        color: 'black',
        fontSize: 20,
    },

    supportText: {
        color: 'black',
        fontSize: 20,
    },

    defaultTextStyle: {
        color: 'black',
        fontSize: 12,
    },

    defaultButton: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10, 
        marginRight: 10, 
        borderRadius: 10,
    },

    button: {
        borderColor: 'black',
        borderWidth: 1,

        marginTop: 10,
        marginBottom: 10,
        width: '75%',
        marginLeft: '5%',
        marginRight: '5%',

        // backgroundColor: '#d3d3d3',
        backgroundColor: '#055D9C',

        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 10,

        borderBottomWidth: 2,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
});

export default AboutPage;