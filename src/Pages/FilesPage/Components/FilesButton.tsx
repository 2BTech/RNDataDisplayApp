import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { FC } from "react";
import { StyleSheet, View, Text, TouchableOpacity, } from "react-native";
import { Icon } from "react-native-elements";
import { faFileExport, faTrash, faFileDownload, } from "@fortawesome/free-solid-svg-icons";

export interface FileButtonProps {
    fileName: string;
    onExportClicked: undefined | (() => void);
    onDeleteClicked: undefined | (() => void);
    onDownloadClicked: undefined | (() => void);
}

const FileButton: FC<FileButtonProps> = ({fileName, onExportClicked: onSaveClicked, onDeleteClicked, onDownloadClicked}) => {
    const count = (onSaveClicked ? 1 : 0) + (onDeleteClicked ? 1 : 0) + (onDownloadClicked ? 1 : 0);
    const iconWidth = ((count == 3) ? '33%' : ((count == 2) ? '50%' : '100%'))
    
    return (
        <View style={styles.container}>
            <Text style={styles.fileNameText}>{fileName}</Text>
            <View style={styles.buttonContainer}>
            {
                onSaveClicked && 
                <TouchableOpacity style={{borderRightWidth: (onDeleteClicked || onDownloadClicked) ? 1 : 0, width: iconWidth, height: 40, justifyContent: 'center', alignItems: 'center', }} onPress={onSaveClicked}>
                    <FontAwesomeIcon icon={faFileExport} size={25} />
                </TouchableOpacity>
            }
            {
                onDeleteClicked && 
                <TouchableOpacity style={{borderRightWidth: (onDownloadClicked) ? 1 : 0, width: iconWidth, height: 40, justifyContent: 'center', alignItems: 'center', }} onPress={onDeleteClicked}>
                    <FontAwesomeIcon icon={faTrash} size={25} />
                </TouchableOpacity>
            }
            {
                onDownloadClicked &&
                <TouchableOpacity style={{width: iconWidth, height: 40, justifyContent: 'center', alignItems: 'center', }} onPress={onDownloadClicked}>
                    <FontAwesomeIcon icon={faFileDownload} size={25} />
                </TouchableOpacity>
            }
            </View>
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
    buttonContainer: {
        // flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    }
});

export default FileButton;