import * as RNFS from 'react-native-fs';

// Returns the anticipated path to the firmware file
export const getBaseFirmwareDir = (deviceName: string): string => {
    // Create the path to the directory that holds the firmware files
    return `${RNFS.DocumentDirectoryPath}/firmware/` + deviceName + '/';
}

// Returns true if the firmware file exists
export const checkFirmwareFileExists = async (deviceName: string): Promise<boolean> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = getBaseFirmwareDir(deviceName);

    // The firmware directory does not exist return false
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        return false;
    }

    // Read all entries in the firmware directory
    const firmwareDirectoryEntries = await RNFS.readDir(firmwareDirectoryPath);

    // Check if the firmware file exists
    return firmwareDirectoryEntries.some((entry) => entry.isFile() && entry.name.endsWith('firmware.bin'));
};

// Returns the firmware file path if the file exists, else returns undefined
export const getFirmwareFilePath = async (deviceName: string): Promise<string | undefined> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = getBaseFirmwareDir(deviceName);

    // The firmware directory does not exist return false
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        return undefined;
    }

    // Read all entries in the firmware directory
    const firmwareDirectoryEntries = await RNFS.readDir(firmwareDirectoryPath);

    // Get the firmware file entry
    const entry = firmwareDirectoryEntries.find((entry) => entry.isFile() && entry.name.endsWith('firmware.bin'));

    // If the firmware file does not exist return undefined
    if (entry == undefined) {
        return undefined;
    } else {
        return entry.path;
    }
}

// Returns the firmware version if the file exists, else returns undefined
export const getFirmwareVersion = async (deviceName: string): Promise<string | undefined> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = getBaseFirmwareDir(deviceName);

    console.log('Firmware directory path: ', firmwareDirectoryPath);

    // The firmware directory does not exist return false
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        console.log('Firmware directory does not exist');
        return undefined;
    }

    // Read all entries in the firmware directory
    const firmwareDirectoryEntries = await RNFS.readDir(firmwareDirectoryPath);

    console.log('Number of entries: ', firmwareDirectoryEntries.length);

    // Get the firmware file entry
    const entry = firmwareDirectoryEntries.find((entry) => entry.isFile() && entry.name.endsWith('firmware.bin'));

    // If the firmware file does not exist return undefined
    if (entry == undefined) {
        console.log('Firmware file does not exist');
        return undefined;
    } else {
        // Return the firmware version
        return entry.name.split('firmware.bin')[0];
    }
}

export const fetchFirmwareSize = async (deviceName: string): Promise<number> => {
    try {
        let response = await fetch(
            'https://air.api.dev.airqdb.com/v2/update/size?id=' + deviceName,
        );
        let responseJson = await response.json();
        const numSections = Math.ceil(Number(responseJson) / 50000);
        return numSections;
    } catch (err) {
        console.log('Fetch firmware size error: ', err);
        return -1;
    }
}

export const fetchFirmwareUrl = async (deviceName:string, numSections: number, updateProgress: ((index: number) => void)): Promise<string[]> => {
    let firmware: string[] = [];
    for (let i = 0; i < numSections; i++) {
        updateProgress((i + 1) / numSections);
        let response = await fetch(
            'https://air.api.dev.airqdb.com/v2/update?id=' + deviceName + '&count=' + i
        );

        const text = await response.text();
        firmware.push(text);
    }

    return firmware;
}

// Handles downloading the firmware and saving it to a file
export const downloadFirmware = async (deviceName: string, onProgress: (progress: number) => void): Promise<boolean> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = getBaseFirmwareDir(deviceName);

    // Create the firmware directory if it does not exist
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        console.log('Creating firmware directory');
        await RNFS.mkdir(firmwareDirectoryPath);
    }

    // ToDo, get the newest firmware version from the server. Not yet implemented

    const firmwareVersion: string = 'Test';

    // Create the path to the firmware file
    const firmwareFilePath = firmwareDirectoryPath + firmwareVersion + 'firmware.bin';

    // Get the size of the firmware file
    const firmwareSize = await fetchFirmwareSize(deviceName);

    // Make sure the size if valid by checking if it is greater than 0
    if (firmwareSize <= 0) {
        // throw new Error('Invalid firmware size');

        // Log the error and return false
        console.log('Invalid firmware size');
        return false;
    }

    // Fetch the firmware chunks and combine them into a single string
    const firmwareContents = (await fetchFirmwareUrl(deviceName, firmwareSize, onProgress)).join();

    // Write the firmware file
    await RNFS.writeFile(firmwareFilePath, firmwareContents, 'utf8');

    // Check if the firmware file exists
    const firmwareFileExists = await checkFirmwareFileExists(deviceName);

    // If the firmware file does not exist throw an error
    if (!firmwareFileExists) {
        // throw new Error('Firmware file does not exist');

        // Log the error and return false
        console.log('Firmware file does not exist');
        return false;
    }

    // Return true to indicate that the firmware file was downloaded successfully
    return true;
}