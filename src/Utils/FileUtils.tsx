import * as RNFS from 'react-native-fs';

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
    [FileTypes.DownloadedFile]: 'Downloaded',
    [FileTypes.LocalDataFile]: 'Local',
    [FileTypes.TrekFile]: 'Trek',
}

export const FileExts = {
    [FileTypes.DownloadedFile]: '.csv',
    [FileTypes.LocalDataFile]: '.csv',
    [FileTypes.TrekFile]: '.kml',
}

// Returns a result in the following format: dd_mm_yyyy
export const buildFileDate: (() => string) = () => {
    const d = new Date();

    return ("0" + d.getDate()).slice(-2) + "_" + ("0" + (d.getMonth() + 1)).slice(-2) + "_" + d.getFullYear();
}

// Ex: PAM-0001 => PAM_0001
export const formatNameForFiles: ((deviceName: string) => string) = (deviceName: string) => {
    return deviceName.replace('-', '_');
}

export const buildDeviceDirPath: ((deviceName: string, fileType: FileTypes) => string) = (deviceName: string, fileType: FileTypes) => {
    return RNFS.DocumentDirectoryPath + '/' + formatNameForFiles(deviceName) + '/' + FileDirs[fileType] + '/';
}

export const buildDeviceFileName: ((deviceName: string, fileType: FileTypes) => string) = (deviceName: string, fileType: FileTypes) => {
    return formatNameForFiles(deviceName) + '_' + buildFileDate() + FileExts[fileType];
}

export const buildFullDataFilePath: ((deviceName: string, fileType: FileTypes) => string) = (deviceName: string, fileType: FileTypes) => {
    return buildDeviceDirPath(deviceName, fileType) + buildDeviceFileName(deviceName, fileType);
}

// Makes sure all items in a path exists. Expexts the full system path
export async function mkpath(path: string) {
    const dirExists = await RNFS.exists(path);
    if (!dirExists) {
        await RNFS.mkdir(path);
    }
}