import React, { FC } from "react";
import { StyleSheet, View, Text, } from "react-native";
import { Icon } from "react-native-elements";

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
                onSaveClicked && <Icon containerStyle={{borderRightWidth: (onDeleteClicked || onDownloadClicked) ? 1 : 0, width: iconWidth, height: 40, justifyContent: 'center', }} name="file-export" type="font-awesome-5" onPress={onSaveClicked} />
            }
            {
                onDeleteClicked && <Icon containerStyle={{borderRightWidth: onDownloadClicked ? 1 : 0, width: iconWidth, height: 40, justifyContent: 'center', }} name="trash" type="font-awesome-5" onPress={onDeleteClicked} />
            }
            {
                onDownloadClicked && <Icon containerStyle={{ width: iconWidth, height: 40, justifyContent: 'center', }} name="file-download" type="font-awesome-5" onPress={onDownloadClicked} />
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