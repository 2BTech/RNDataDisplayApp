import React, { FC } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform, } from 'react-native';
import { FileTypes } from '../../../Utils/FileUtils';
import type {DimensionValue} from 'react-native';

interface FileTypeSelectorProps {
    availableFileTypes: FileTypes[];
    selectedFileType: FileTypes;
    onSelectFileType: ((selectedType: FileTypes) => void)
}

const FileTypeSelector: FC<FileTypeSelectorProps> = ({availableFileTypes, selectedFileType, onSelectFileType}) => {
    let buttonWidth: DimensionValue = `${((1 / availableFileTypes.length) * 100)}%`;
    return (
        <View style={styles.container}>
            {
                availableFileTypes.map(typ => {
                    const backgroundColor = typ == selectedFileType ? '#c0e6f0' : '#efefef';
                    return (
                        <TouchableOpacity key={typ} style={StyleSheet.compose(styles.buttonContainer, {backgroundColor, width: buttonWidth})} onPress={() => onSelectFileType(typ)}>
                            <View style={{height: '33%', width: '100%'}} />
                            <Text style={styles.buttonText}>{typ}</Text>
                            <View style={{height: '33%', width: '100%'}} />
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        backgroundColor: '#c0e6f0',
        flexDirection: 'row',

        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    buttonContainer: {
        height: 50,
        borderLeftWidth: 1,
        borderBottomWidth: 1,

        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        width: '100%',
        height: '100%',
    },
    buttonText: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '34%',
        width: '100%',
        alignSelf: 'center',
    },
});

export default FileTypeSelector;