import React, { FC, useEffect, useState, } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View, } from "react-native";
import { SafeAreaProvider, } from "react-native-safe-area-context";
import { ConnectionType, DeviceId } from "../../redux/slices/deviceSlice";
import FileButton, { FileButtonProps, } from "../FilesPage/Components/FilesButton";
import * as RNFS from 'react-native-fs';
import { FileEntry, FileSectionFilesMap, FileTypes, buildDeviceDirPath } from "../../Utils/FileUtils";
import { ConnectedProps, connect, useSelector } from "react-redux";
import LoadingFileButton from "../FilesPage/Components/LoadingFileButton";
import { RootState } from "../../redux/store";
import Share, { ShareOptions } from 'react-native-share';
import FileTypeSelector from "../FilesPage/Components/FileTypeSelector";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

interface AllFilesPageProps extends PropsFromRedux {

}

type DeviceFileMap = {
    [key: string]: {[key: string]: FileEntry[]};
}

const AllFilesPage: FC<AllFilesPageProps> = ({devices}) => {
    const [allFiles, setAllFiles] = useState<DeviceFileMap | undefined>(undefined);
    const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
    const [selectedFileType, setSelectedFileType] = useState<string>('');
    
    const gatherAllFiles: () => Promise<void> = async () => {
        const filesMap = await queryAllFiles(RNFS.DocumentDirectoryPath) || {};

        console.log('Devices with files: ', Object.keys(filesMap));
        setAllFiles(filesMap);
        if (Object.keys(filesMap).length > 0) {
            const selected = Object.keys(filesMap).sort()[0];
            setSelectedDevice(selected);
            if (Object.keys(filesMap[selected])) {
                setSelectedFileType(Object.keys(filesMap[selected]).sort()[0]);
            }
        }
    }

    const queryAllFiles: (dirPath: string) => Promise<DeviceFileMap | undefined> = async (dirPath: string) => {

        const dirExists = await RNFS.exists(dirPath);
        if (dirExists) {
            let currentMap: DeviceFileMap = {

            };

            const entries: RNFS.ReadDirItem[] = await RNFS.readDir(dirPath);

            entries.sort((a, b) => {
                return a.name < b.name ? -1 : (a.name == b.name ? 0 : 1);
            });

            for (let i = 0; i < entries.length; i++) {
                if (entries[i].isDirectory()) {
                    const map: (undefined | DeviceFileMap) = await queryAllFiles(entries[i].path);
                    if (map) {
                        currentMap = {
                            ...currentMap,
                            ...map,
                        }
                    }
                } else if (entries[i].isFile()) {
                    const fName = entries[i].path.replace(RNFS.DocumentDirectoryPath + '/', '');

                    const sections = fName.split('/');
                    if (sections.length == 1) {
                        continue;
                    }

                    if (sections.length == 3) {
                        console.log('Device: ', sections[0], ' Section: ', sections[1], ' Name: ', sections[2]);

                        if (currentMap[sections[0]]) {
                            if (currentMap[sections[0]][sections[1]]) {
                                currentMap[sections[0]][sections[1]].push({
                                    fileName: sections[2],
                                    filePath: entries[i].path,
                                    existsOnPhone: true,
                                    isDownloadable: false,
                                });
                            } else {
                                currentMap[sections[0]][sections[1]] = [{
                                    fileName: sections[2],
                                    filePath: entries[i].path,
                                    existsOnPhone: true,
                                    isDownloadable: false,
                                }];
                            }
                        } else {
                            currentMap[sections[0]] = {
                                [sections[1]]: [{
                                    fileName: sections[2],
                                    filePath: entries[i].path,
                                    existsOnPhone: true,
                                    isDownloadable: false,
                                }],
                            }
                        }
                    }
                }
            }

            return currentMap;
        } else {
            return undefined;
        }
    }

    useEffect(() => {
        gatherAllFiles();
    }, []);

    if (selectedDevice) {

    } else {
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

        return (
            <View style={styles.container}>
                <FileTypeSelector selectedFileType={selectedFileType} availableFileTypes={[FileTypes.LocalDataFile, FileTypes.TrekFile, FileTypes.DownloadedFile]} onSelectFileType={setSelectedFileType} />
                <FlatList
                        data={loadingEntries}
                        renderItem={(entry) => <LoadingFileButton />}
                        keyExtractor={(entry) => entry.key}
                        />
            </View>
        );
    }
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

const mapStateToProps = (state: RootState) => {
    return {
        devices: state.deviceSlice.deviceDefinitions,
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

export default AllFilesPage;