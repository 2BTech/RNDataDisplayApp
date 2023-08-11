import React, { FC, useEffect, useState, } from "react";
import { FlatList, StyleSheet, Text, View, } from "react-native";
import { DeviceId } from "../../redux/slices/deviceSlice";
import FileButton, { FileButtonProps, } from "../FilesPage/Components/FilesButton";
import * as RNFS from 'react-native-fs';
import { FileEntry, FileTypes, queryAllFiles, exportFile, deleteFile, } from "../../Utils/FileUtils";
import { ConnectedProps, connect, } from "react-redux";
import LoadingFileButton from "../FilesPage/Components/LoadingFileButton";
import { RootState } from "../../redux/store";
import Share, { ShareOptions } from 'react-native-share';
import FileTypeSelector from "../FilesPage/Components/FileTypeSelector";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import Dropdown from "../Components/Dropdown/DropdownV2";
import { mergeObjects } from "../../Utils/ObjUtils";
import DropDownPicker from 'react-native-dropdown-picker';
// import Dropdown, { DropdownItem } from "../Components/Dropdown/Dropdown";

interface AllFilesPageProps extends PropsFromRedux {

}

export type DeviceFileTypeMap = {
    [key: string]: {[key: string]: FileEntry[]};
}

const stringToFileType: (fType: string) => FileTypes = (fType) => {
    if ([FileTypes.LocalDataFile, FileTypes.TrekFile, FileTypes.DownloadedFile].find(typ => typ == fType) == undefined) {
        console.log('Failed to find: ', fType);
    }

    return [FileTypes.LocalDataFile, FileTypes.TrekFile, FileTypes.DownloadedFile].find(typ => typ == fType) || FileTypes.LocalDataFile;
}

const AllFilesPage: FC<AllFilesPageProps> = React.memo(({devices}) => {
    const [allFiles, setAllFiles] = useState<DeviceFileTypeMap | undefined>(undefined);
    const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
    const [selectedFileType, setSelectedFileType] = useState<FileTypes>(FileTypes.LocalDataFile);
    
    // Drop down state values
    const [dropdownIsOpen, setDropDownIsOpen] = useState<boolean>(false);
    const [dropdownValue, setDropdownValue] = useState(null);

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
                        {/* <DropDownPicker 
                            open={dropdownIsOpen}
                            value={dropdownValue}
                            items={allFiles ? Object.keys(allFiles).map(item => {return {label: item, value: item}}) : []}
                            setOpen={setDropDownIsOpen}
                            setValue={setDropdownValue}
                            /> */}
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
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        devices: state.deviceSlice.deviceDefinitions,
    };
}

const connector = connect(mapStateToProps, undefined);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default AllFilesPage;