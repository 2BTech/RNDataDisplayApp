import React, { FC, useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AccordianItem, { AccordianItemProps } from "./AccordianItem";

interface AccordianProps {
    children: AccordianItemProps[];
}

const Accordian: FC<AccordianProps> = ({children}) => {
    return (
        <View style={styles.container}>
            {
                children.map(child => <AccordianItem key={child.title} {...child} />)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: 'lightgray',
    },
});

export default Accordian;
