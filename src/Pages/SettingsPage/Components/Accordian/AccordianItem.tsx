import React, { FC, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, UIManager, LayoutAnimation, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

if(Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface AccordianItemProps {
    title: string;
    content: React.ReactNode;
}

export enum SettingType {
    value,
    open,
    toggle,
    options,
    menu,
}

interface SettingObj {

}

const AccordianItem: FC<AccordianItemProps> = ({title, content}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggleIsExpaned = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={toggleIsExpaned}>
                <Text style={styles.title}>{title}</Text>
                <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#bbb" />
            </TouchableOpacity>

            {/* Content */}
            {
                isExpanded && <View style={styles.bodyContainer}>{content}</View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 4,
        width: '100%',
    },
    header: {
        height: 50,
        padding: 12,
        backgroundColor: '#666',
        color: '#eee',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
    },
    bodyContainer: {
        padding: 12,
    },


    text: {
        color: 'black',
    }
})

export default AccordianItem;