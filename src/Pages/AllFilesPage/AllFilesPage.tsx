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
import Dropdown from "../Components/Dropdown/DropdownV2";
import { mergeObjects } from "../../Utils/ObjUtils";
// import Dropdown, { DropdownItem } from "../Components/Dropdown/Dropdown";

interface AllFilesPageProps extends PropsFromRedux {

}

type DeviceFileMap = {
    [key: string]: {[key: string]: FileEntry[]};
}

const stringToFileType: (fType: string) => FileTypes = (fType) => {
    return [FileTypes.LocalDataFile, FileTypes.TrekFile, FileTypes.DownloadedFile].find(typ => typ == fType) || FileTypes.LocalDataFile;
}

const AllFilesPage: FC<AllFilesPageProps> = ({devices}) => {
    const [allFiles, setAllFiles] = useState<DeviceFileMap | undefined>(undefined);
    const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
    const [selectedFileType, setSelectedFileType] = useState<FileTypes>(FileTypes.LocalDataFile);
    
    const exportFile = async (file: FileEntry) => {
        // console.log('Export file: ', file.fileName);
        
        const shareOptions: ShareOptions = {
            title: file.fileName,
            url: 'file:///' + file.filePath,
        };

        await Share.open(shareOptions)
            // .then(result => console.log('Finished exporting file'))
            .catch(err => console.log('Failed to export file: ', err));
    }

    const deleteFile = async (file: FileEntry) => {
        // console.log('Delete file: ', file.fileName);
        await RNFS.unlink(file.filePath);

        let dirPath = file.filePath;
        dirPath = dirPath.slice(0, dirPath.lastIndexOf('/') - 1);

        let entries = await RNFS.readDir(dirPath);

        // Check if the directory is empty
        if (entries.length == 0) {
            // Delete dir because it is empty
            await RNFS.unlink(dirPath);

            dirPath = file.filePath;
            dirPath = dirPath.slice(0, dirPath.lastIndexOf('/') - 1)

            entries = await RNFS.readDir(dirPath);

            if (entries.length == 0) {
                await RNFS.unlink(dirPath);
            }
        }
    }

    const gatherAllFiles: () => Promise<void> = async () => {
        const filesMap = await queryAllFiles(RNFS.DocumentDirectoryPath) || {};

        // console.log('Files map:', filesMap);

        setAllFiles(filesMap);
        if (Object.keys(filesMap).length > 0) {
            const selected = Object.keys(filesMap).sort()[0];
            setSelectedDevice(selected);
            if (Object.keys(filesMap[selected])) {
                setSelectedFileType(stringToFileType(Object.keys(filesMap[selected]).sort()[0]));
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
                        // currentMap = {
                        //     ...currentMap,
                        //     ...map,
                        // }
                        currentMap = mergeObjects(currentMap, map);
                    }
                } else if (entries[i].isFile()) {
                    const fName = entries[i].path.replace(RNFS.DocumentDirectoryPath + '/', '');

                    const sections = fName.split('/');
                    if (sections.length == 1) {
                        continue;
                    }

                    if (sections.length == 3) {
                        console.log('Device: ', sections[0], ' Section: ', sections[1], ' Name: ', sections[2]);

                        console.log(currentMap);
                        if (currentMap[sections[0]]) {
                            // Device and file type is not null
                            if (currentMap[sections[0]][sections[1]]) {
                                console.log('Device and section exist');
                                currentMap[sections[0]][sections[1]].push({
                                    fileName: sections[2],
                                    filePath: entries[i].path,
                                    existsOnPhone: true,
                                    isDownloadable: false,
                                });
                            } else {
                                console.log('Device exits but not section');
                                // Device exists, but not type
                                currentMap[sections[0]][sections[1]] = [{
                                    fileName: sections[2],
                                    filePath: entries[i].path,
                                    existsOnPhone: true,
                                    isDownloadable: false,
                                }];
                            }
                        } else {
                            console.log('Section is null');
                            // Device object doesn't exist
                            currentMap[sections[0]] = {
                                [sections[1]]: [{
                                    fileName: sections[2],
                                    filePath: entries[i].path,
                                    existsOnPhone: true,
                                    isDownloadable: false,
                                }],
                            }
                        }
                        console.log(currentMap);
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

    if (selectedDevice != undefined && allFiles != undefined) {
        if (allFiles[selectedDevice] == null) {
            setSelectedDevice(Object.keys(allFiles)[0]);
            return (
                <></>
            )
        }

        const deviceDropdown = Object.keys(allFiles).map(item => {return {label: item, value: item}});
        
        if (allFiles[selectedDevice][selectedFileType] == null) {
            setSelectedFileType(stringToFileType(Object.keys(allFiles[selectedDevice])[0]));
        }
        return (
            <View style={styles.container}>
                <View style={{height: 75, width: '100%'}}>
                    {/* <Dropdown defaultLabel={selectedDevice || 'Select Device'}
                        data={Object.keys(allFiles || {}).map(deviceName => {
                            return {
                                label: deviceName,
                                value: deviceName,
                            }
                        })}
                        onSelect={(item: DropdownItem) => console.log('Selected: ', item.value)}
                        /> */}
                        <Dropdown 
                            options={allFiles ? Object.keys(allFiles).map(item => {return {label: item, value: item}}) : []}
                            currentVal={deviceDropdown.find(val => val.label == selectedDevice) || {label: 'Select Device', value: 'Select Device'}}
                            onSelectItem={item => {
                                if (typeof item.value == 'string') {
                                    setSelectedDevice(item.value);
                                }
                            }}
                            itemStartHeight={10}
                            />
                </View>
                    <View style={{width: '100%', marginBottom: 5}}>
                        <FileTypeSelector selectedFileType={selectedFileType} availableFileTypes={Object.keys(allFiles[selectedDevice]).map(fType => stringToFileType(fType))} onSelectFileType={setSelectedFileType} />
                    </View>
                    <FlatList 
                        data={allFiles[selectedDevice][selectedFileType]}
                        renderItem={(entry) => <FileButton key={entry.item.fileName} fileName={entry.item.fileName} onExportClicked={entry.item.existsOnPhone ? () => {exportFile(entry.item); gatherAllFiles();} : undefined} onDeleteClicked={entry.item.existsOnPhone ? () => {deleteFile(entry.item); gatherAllFiles();} : undefined} onDownloadClicked={undefined} />}
                        keyExtractor={(entry) => entry.fileName}
                        />
            </View>
        );
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