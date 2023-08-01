import React, { FC, useEffect, useState, } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View, } from "react-native";
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

interface FilesPageProps extends PropsFromRedux {
    deviceKey: DeviceId;
}

const FilesPage: FC<FilesPageProps> = ({deviceKey, deviceRemoteFiles, startDownloadingFile}) => {
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
    }

    const query =async () => {
        let t = await queryAllFiles
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

        deviceRemoteFiles?.forEach(entry => {
            fileSections[FileTypes.DownloadedFile].push({
                existsOnPhone: false,
                fileName: entry,
                filePath: '',
                isDownloadable: true,
            });
        });

        setFileEntries(fileSections);
    };

    useEffect(() => {
        queryDeviceFiles();
    }, [deviceKey]);

    const renderFileObjects = () =>
    {
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

    return (
        <View style={styles.container}>
            <FileTypeSelector selectedFileType={selectedFileType} availableFileTypes={isBeacon ? [FileTypes.LocalDataFile, FileTypes.TrekFile] : [FileTypes.LocalDataFile, FileTypes.TrekFile, FileTypes.DownloadedFile]} onSelectFileType={setSelectedFileType} />
            {
                renderFileObjects()
            }
        </View>
    );
}

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
    }
});

const mapStateToProps = (state: RootState, ownProps: any) => {
    return {
        deviceRemoteFiles: state.deviceFilesSlice[ownProps.deviceKey],
    };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
    return {
        startDownloadingFile: (fileName: string, deviceKey: DeviceId) => {
            
        }
    };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default FilesPage;