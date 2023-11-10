import * as RNFS from 'react-native-fs';
import { mergeObjects } from './ObjUtils';
import { DeviceFileTypeMap } from '../Pages/AllFilesPage/AllFilesPage';
import Share, { ShareOptions } from 'react-native-share';

export enum FileTypes {
    // A file that was built from data received by the device .csv
    LocalDataFile = 'Local',
    // A file that was copied from the device .csv
    DownloadedFile = 'Download',
    // A location based file that maps received data to the location it was received .kml
    TrekFile = 'Trek',
}

export interface FileEntry {
    // Name of the file
    fileName: string;
    // Full path to access the file on the device
    filePath: string;

    // Flag that is true if there is a copy of the file on the phone
    existsOnPhone: boolean;
    // Flag that is true when the file can be downloaded from the connected device
    isDownloadable: boolean;
}

export type FileSectionFilesMap = {
    [key in FileTypes]: FileEntry[];
}

export const FileDirs = {
    [FileTypes.DownloadedFile]: 'Download',
    [FileTypes.LocalDataFile]: 'Local',
    [FileTypes.TrekFile]: 'Trek',
}

export const FileExts = {
    [FileTypes.DownloadedFile]: '.csv',
    [FileTypes.LocalDataFile]: '.csv',
    [FileTypes.TrekFile]: '.kml',
}

// Returns a result in the following format: dd_mm_yyyy
export const buildFileDate: ((includeTime: boolean) => string) = (includeTime: boolean = false) => {
    const d = new Date();

    // If include time, generate the string in the following format: yyyy_MM_dd_hh_mm_ss
    if (includeTime) {
        return d.getFullYear() + '_' + (d.getMonth() + 1).toString().padStart(2, '0') + '_' + d.getDate().toString().padStart(2, '0') + '_' + d.getHours().toString().padStart(2, '0') + '_' + d.getMinutes().toString().padStart(2, '0') + '_' + d.getSeconds().toString().padStart(2, '0');
    } else {
        return d.getFullYear() + '_' + (d.getMonth() + 1).toString().padStart(2, '0') + '_' + d.getDate().toString().padStart(2, '0');
    }
}

// Ex: PAM-0001 => PAM_0001
export const formatNameForFiles: ((deviceName: string) => string) = (deviceName: string) => {
    return deviceName.replace('-', '_');
}

export const buildDeviceDirPath: ((deviceName: string, fileType: FileTypes) => string) = (deviceName: string, fileType: FileTypes) => {
    return RNFS.DocumentDirectoryPath + '/' + formatNameForFiles(deviceName) + '/' + FileDirs[fileType] + '/';
}

export const buildDeviceFileName: ((deviceName: string, fileType: FileTypes, includeTime: boolean) => string) = (deviceName: string, fileType: FileTypes, includeTime: boolean = false) => {
    return formatNameForFiles(deviceName) + '_' + buildFileDate(includeTime) + FileExts[fileType];
}

export const buildFullDataFilePath: ((deviceName: string, fileType: FileTypes, includeTime: boolean) => string) = (deviceName: string, fileType: FileTypes, includeTime: boolean = false) => {
    return buildDeviceDirPath(deviceName, fileType) + buildDeviceFileName(deviceName, fileType, includeTime);
}

// Makes sure all items in a path exists. Expexts the full system path
export async function mkpath(path: string) {
    const dirExists = await RNFS.exists(path);
    if (!dirExists) {
        await RNFS.mkdir(path);
    }
}

export const queryAllFiles: (dirPath: string) => Promise<DeviceFileTypeMap | undefined> = async (dirPath: string) => {

    const dirExists = await RNFS.exists(dirPath);
    if (dirExists) {
        let currentMap: DeviceFileTypeMap = {

        };

        const entries: RNFS.ReadDirItem[] = await RNFS.readDir(dirPath);

        entries.sort((a, b) => {
            return a.name < b.name ? -1 : (a.name == b.name ? 0 : 1);
        });

        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isDirectory()) {
                const map: (undefined | DeviceFileTypeMap) = await queryAllFiles(entries[i].path);
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
                    if (currentMap[sections[0]]) {
                        // Device and file type is not null
                        if (currentMap[sections[0]][sections[1]]) {
                            currentMap[sections[0]][sections[1]].push({
                                fileName: sections[2],
                                filePath: entries[i].path,
                                existsOnPhone: true,
                                isDownloadable: false,
                            });
                        } else {
                            // Device exists, but not type
                            currentMap[sections[0]][sections[1]] = [{
                                fileName: sections[2],
                                filePath: entries[i].path,
                                existsOnPhone: true,
                                isDownloadable: false,
                            }];
                        }
                    } else {
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
                }
            }
        }

        return currentMap;
    } else {
        return undefined;
    }
}

export const deleteFile = async (file: FileEntry) => {
    // Get the file's directory
    const dirPath = file.filePath.slice(0, file.filePath.lastIndexOf('/'));

    console.log('Delete file: ', file.fileName, ' from ', dirPath);

    // Delete the file
    await RNFS.unlink(file.filePath);

    // Check if the directory is empty
    let entries: RNFS.ReadDirItem[] = await RNFS.readDir(dirPath);

    // Check if the directory is empty
    if (entries.length == 0) {
        console.log('Delete dir: ', dirPath);

        // Delete dir because it is empty
        await RNFS.unlink(dirPath);
    }





    
    // await RNFS.unlink(file.filePath);

    // let dirPath = file.filePath;
    // dirPath = dirPath.slice(0, dirPath.lastIndexOf('/') - 1);

    // let entries = await RNFS.readDir(dirPath);

    // // Check if the directory is empty
    // if (entries.length == 0) {
    //     // Delete dir because it is empty
    //     await RNFS.unlink(dirPath);

    //     dirPath = file.filePath;
    //     dirPath = dirPath.slice(0, dirPath.lastIndexOf('/') - 1)

    //     entries = await RNFS.readDir(dirPath);

    //     if (entries.length == 0) {
    //         await RNFS.unlink(dirPath);
    //     }
    // }
}

export const exportFile = async (file: FileEntry) => {
    // console.log('Export file: ', file.fileName);
    
    const shareOptions: ShareOptions = {
        title: file.fileName,
        url: 'file:///' + file.filePath,
    };

    await Share.open(shareOptions)
        // .then(result => console.log('Finished exporting file'))
        .catch(err => console.log('Failed to export file: ', err));
}

export const writeFile = async (deviceName: string, fileName: string, fileType: FileTypes, content: string) => {
    const dirPath = buildDeviceDirPath(deviceName, fileType);

    const dirExists = await RNFS.exists(dirPath);
    if (!dirExists) {
        await mkpath(dirPath);
    }

    const filePath = dirPath + fileName;

    const fileExits = await RNFS.exists(filePath);
    if (fileExits) {
        await RNFS.unlink(filePath);
    }

    await RNFS.writeFile(filePath, content);
}