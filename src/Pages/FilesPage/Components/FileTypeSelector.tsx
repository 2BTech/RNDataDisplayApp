import React, { FC } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, } from 'react-native';
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
                    const backgroundColor = typ == selectedFileType ? 'lightgray' : 'white';
                    return (
                        <TouchableOpacity key={typ} style={StyleSheet.compose(styles.buttonContainer, {backgroundColor, width: buttonWidth})} onPress={() => onSelectFileType(typ)}>
                            <Text style={styles.buttonText}>{typ}</Text>
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
        backgroundColor: 'lightblue',
        flexDirection: 'row',

        borderBottomWidth: 1,
    },

    buttonContainer: {
        height: 50,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
    },
    buttonText: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '100%',
        width: '100%',
    },
});

export default FileTypeSelector;