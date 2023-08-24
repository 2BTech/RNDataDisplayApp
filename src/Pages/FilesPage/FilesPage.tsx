import React, { FC, useEffect, useState, } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View, Modal, Image, } from "react-native";
import { SafeAreaProvider, } from "react-native-safe-area-context";
import { ConnectionType, DeviceId } from "../../redux/slices/deviceSlice";
import FileButton, { FileButtonProps, } from "./Components/FilesButton";
import * as RNFS from 'react-native-fs';
import { FileEntry, FileSectionFilesMap, FileTypes, buildDeviceDirPath, deleteFile, exportFile, queryAllFiles } from "../../Utils/FileUtils";
import { ConnectedProps, connect, useSelector } from "react-redux";
import LoadingFileButton from "./Components/LoadingFileButton";
import { RootState } from "../../redux/store";
import Share, { ShareOptions } from 'react-native-share';
import FileTypeSelector from "./Components/FileTypeSelector";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { startDownloadingFile } from "../../redux/middleware/Bluetooth/BluetoothDirectMiddleware";

interface FilesPageProps extends PropsFromRedux {
    deviceKey: DeviceId;
}

const FilesPage: FC<FilesPageProps> = React.memo(({deviceKey, deviceRemoteFiles, startDownloadingFile, downloadState}) => {
    const deviceName: DeviceId = useSelector((state: RootState) => (state.deviceSlice.deviceDefinitions[deviceKey].deviceName));
    const isBeacon: boolean = useSelector((state: RootState) => (state.deviceSlice.deviceDefinitions[deviceKey].connectionType == ConnectionType.Beacon));

    const [selectedFileType, setSelectedFileType] = useState<FileTypes>(FileTypes.LocalDataFile);
    const [fileEntries, setFileEntries] = useState<FileSectionFilesMap | undefined>(undefined);

    const loadingEntries = [
        {
            key: 'Loading button 1',
        },
        {
            key: 'Loading button 2',
        },
        {
            key: 'Loading button 3',
        },
        {
            key: 'Loading button 4',
        },
        {
            key: 'Loading button5',
        },
        {
            key: 'Loading button 6',
        },
        {
            key: 'Loading button 7',
        },
        {
            key: 'Loading button 8',
        },
        {
            key: 'Loading button 9',
        },
    ]

    const downloadFile = (file: FileEntry) => {
        console.log('Download file: ', file.fileName);
        startDownloadingFile(file.fileName, deviceKey);
    }

    const queryDeviceFiles = async () => {
        // console.log('Querying device files for: ', deviceName);

        let fileSections: FileSectionFilesMap = {
            [FileTypes.DownloadedFile]: [],
            [FileTypes.LocalDataFile]: [],
            [FileTypes.TrekFile]: [],
        };

        let dirPath = buildDeviceDirPath(deviceName, FileTypes.DownloadedFile);

        let dirExists = await RNFS.exists(dirPath);
        if (dirExists) {
            const entries: RNFS.ReadDirItem[] = await RNFS.readDir(dirPath);

            entries.sort((a, b) => {
                return a.name < b.name ? -1 : (a.name == b.name ? 0 : 1);
            })

            for (let i = 0; i < entries.length; i++) {
                fileSections[FileTypes.DownloadedFile].push({
                    existsOnPhone: true,
                    fileName: entries[i].name,
                    filePath: dirPath + entries[i].name,
                    isDownloadable: true,
                });
            }
        }

        dirPath = buildDeviceDirPath(deviceName, FileTypes.LocalDataFile);

        dirExists = await RNFS.exists(dirPath);
        if (dirExists) {
            const entries: RNFS.ReadDirItem[] = await RNFS.readDir(dirPath);

            entries.sort((a, b) => {
                return a.name < b.name ? -1 : (a.name == b.name ? 0 : 1);
            })

            for (let i = 0; i < entries.length; i++) {
                // console.log(entries[i]);
                fileSections[FileTypes.LocalDataFile].push({
                    existsOnPhone: true,
                    fileName: entries[i].name,
                    filePath: dirPath + entries[i].name,
                    isDownloadable: false,
                });
            }
        }

        dirPath = buildDeviceDirPath(deviceName, FileTypes.TrekFile);

        dirExists = await RNFS.exists(dirPath);
        if (dirExists) {
            let entries: RNFS.ReadDirItem[] = await RNFS.readDir(dirPath);

            entries.sort((a, b) => {
                return a.name < b.name ? -1 : (a.name == b.name ? 0 : 1);
            });

            for (let i = 0; i < entries.length; i++) {
                fileSections[FileTypes.TrekFile].push({
                    existsOnPhone: true,
                    fileName: entries[i].name,
                    filePath: dirPath + entries[i].name,
                    isDownloadable: false,
                });
            }
        }

        // console.log('Download files: ', deviceRemoteFiles);
        deviceRemoteFiles?.forEach(entry => {
            const exists = fileSections[FileTypes.DownloadedFile].find(file => file.fileName == entry) != undefined;

            // console.log(entry, ' : ', exists);

            if (!exists) {
                fileSections[FileTypes.DownloadedFile].push({
                    existsOnPhone: false,
                    fileName: entry,
                    filePath: '',
                    isDownloadable: true,
                });
            }
        });

        setFileEntries(fileSections);
    };

    useEffect(() => {
        queryDeviceFiles();
    }, [deviceKey, downloadState.downloadInProgress]);

    const renderFileObjects = () => {
        if (fileEntries == undefined) {
            return <FlatList
                        data={loadingEntries}
                        renderItem={(entry) => <LoadingFileButton />}
                        keyExtractor={(entry) => entry.key}
                        />
        }

        if (fileEntries[selectedFileType].length == 0) {
            return  <View style={styles.noFilesContainer}>
                        <Text style={styles.noFilesText}>There are no {selectedFileType} files. If this is incorrect, please reload the app.</Text>
                    </View>
        } else {
            return <FlatList
                        data={fileEntries[selectedFileType]}
                        renderItem={(entry) => <FileButton key={entry.item.fileName} fileName={entry.item.fileName} onExportClicked={entry.item.existsOnPhone ? () => {exportFile(entry.item)} : undefined} onDeleteClicked={entry.item.existsOnPhone ? () => deleteFile(entry.item).then(() => queryDeviceFiles()) : undefined} onDownloadClicked={entry.item.isDownloadable ? () => downloadFile(entry.item) : undefined} />}
                        keyExtractor={(entry) => entry.fileName}
                        />
        }
    }

    const renderDownloadProgressView = () => {
        return (
            <Modal visible={downloadState.downloadInProgress} transparent animationType="none">
                <View style={styles.overlay}>
                    <Text style={styles.downloadTitle}>Downloading file: {downloadState.fileName}</Text>
                    <Text style={styles.progressText}>Download progress: {downloadState.gathered} / {downloadState.numberToGather}</Text>
                    <Image source={require('../../gifs/loader.gif')} style={{width: 50, height: 50, }} />
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.container}>
            {
                renderDownloadProgressView()
            }
            <FileTypeSelector selectedFileType={selectedFileType} availableFileTypes={isBeacon ? [FileTypes.LocalDataFile, FileTypes.TrekFile] : [FileTypes.LocalDataFile, FileTypes.TrekFile, FileTypes.DownloadedFile]} onSelectFileType={setSelectedFileType} />
            {
                renderFileObjects()
            }
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    scollView: {
        width: '100%',
        height: '100%',
    },

    noFilesContainer: {
        width: '100%',
        height: '100%',

        justifyContent: 'center',
        alignContent: 'center',
    },
    noFilesText: {
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',

        width: '50%',
        marginLeft: '25%',
    },


    overlay: {
        flex: 1,
        position: 'absolute',
        left: '5%',
        top: '5%',
        // opacity: 0.5,
        backgroundColor: '#CCFFFF',
        width: '90%',
        height: '90%',

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 2,
    },
    downloadTitle: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
    },
    progressText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
});

const mapStateToProps = (state: RootState, ownProps: any) => {
    return {
        deviceRemoteFiles: state.deviceFilesSlice[ownProps.deviceKey],

        downloadState: state.downloadFilesSlice,
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
    return {
        startDownloadingFile: (fileName: string, deviceKey: DeviceId) => {
            dispatch(startDownloadingFile(fileName, deviceKey));
        }
    };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(FilesPage);