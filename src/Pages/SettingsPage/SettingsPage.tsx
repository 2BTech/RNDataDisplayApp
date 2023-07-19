import React, { FC, } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import Accordian from "./Components/Accordian/Accordian";
import { AccordianItemProps } from "./Components/Accordian/AccordianItem";
import ValueSetting from "./Components/ValueSetting/ValueSetting";

interface SettingsPageProps {

}

const SettingsPage: FC<SettingsPageProps> = ({}) => {

    const accordianContent: AccordianItemProps[] = [
        {
            title: 'Native development',
            content: <Text style={styles.textSmall}>React Native lets you create truly native apps and
            doesn't compromise your users' experiences. It provides a core set of platform
            agnostic native components </Text>
        },
        {
            title: 'Fast refresh',
            content: <Text style={styles.textSmall}>See your changes as soon as you save.
            With the power of JavaScript, React Native lets you iterate at
            lightning speed.</Text>
        },
        {
            title: 'Cross-platform',
            content: <View>
                <Text style={styles.textSmall}>React components wrap existing native code
            and interact with native APIs via React’s declarative UI paradigm
            and JavaScript. This enables native app development for whole new teams
            of developers</Text>
            <View style={styles.seperator}></View>
            <Button title="See more..."/>
            </View>
        },
        {
            title: 'Value Setting',
            content: <ValueSetting description="Test Setting" value={1.23} />
        },
    ]

    return (
        <View style={styles.container}>
            <Accordian children={accordianContent} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',

        backgroundColor: 'white',
    },



    textSmall: {
        fontSize: 16,
        color: 'black',
    },
    seperator: {
        height: 12
    }
})

export default SettingsPage;