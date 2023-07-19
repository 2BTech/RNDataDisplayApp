import React, { FC, } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, } from 'react-native';

interface LoadingFileButtonProps {

}

const LoadingFileButton: FC<LoadingFileButtonProps> = ({}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.fileNameText}>Loading</Text>
            <ActivityIndicator size={'large'} color={'lightblue'} />
        </View>
    );
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        
        borderWidth: 3,
        borderRadius: 10,
        margin: 3,
        paddingVertical: 5,
    },
    fileNameText: {
        width: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',

        fontSize: 20,
        color: 'black',
    },
});

export default LoadingFileButton;