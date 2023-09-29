import * as RNFS from 'react-native-fs';

// Returns true if the firmware file exists
export const checkFirmwareFileExists = async (): Promise<boolean> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = `${RNFS.DocumentDirectoryPath}/firmware/`;

    // The firmware directory does not exist return false
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        return false;
    }

    // Read all entries in the firmware directory
    const firmwareDirectoryEntries = await RNFS.readDir(firmwareDirectoryPath);

    // Check if the firmware file exists
    const firmwareFileExists = firmwareDirectoryEntries.find((entry) => entry.isFile() && entry.name.endsWith('firmware.bin'));

    return firmwareFileExists != undefined;
};

// Returns the firmware version if the file exists, else returns undefined
export const getFirmwareVersion = async (): Promise<string | undefined> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = `${RNFS.DocumentDirectoryPath}/firmware/`;

    // The firmware directory does not exist return undefined
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        return undefined;
    }

    // Read all entries in the firmware directory
    const firmwareDirectoryEntries = await RNFS.readDir(firmwareDirectoryPath);

    // Check if the firmware file exists
    const firmwareFileEntry = firmwareDirectoryEntries.find((entry) => entry.isFile() && entry.name.endsWith('firmware.bin'));

    // If the firmware file does not exist return undefined
    if (firmwareFileEntry == undefined) {
        return undefined;
    }

    // Get the firmware version from the file name by removing the 'firmware.bin' from the end
    return firmwareFileEntry.name.slice(0, - 'firmware.bin'.length);
}

// Returns the firmware file path if the file exists, else returns undefined
export const getFirmwareFilePath = async (): Promise<string | undefined> => {
    // Create the path to the directory that holds the firmware files
    const firmwareDirectoryPath = `${RNFS.DocumentDirectoryPath}/firmware/`;

    // The firmware directory does not exist return undefined
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        return undefined;
    }

    // Read all entries in the firmware directory
    const firmwareDirectoryEntries = await RNFS.readDir(firmwareDirectoryPath);

    // Check if the firmware file exists
    const firmwareFileEntry = firmwareDirectoryEntries.find((entry) => entry.isFile() && entry.name.endsWith('firmware.bin'));

    // If the firmware file does not exist return undefined
    if (firmwareFileEntry == undefined) {
        return undefined;
    }

    // Return the firmware file path
    return firmwareFileEntry.path;
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
        updateProgress(i);
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
    const firmwareDirectoryPath = `${RNFS.DocumentDirectoryPath}/firmware/`;

    // Create the firmware directory if it does not exist
    if (!(await RNFS.exists(firmwareDirectoryPath))) {
        await RNFS.mkdir(firmwareDirectoryPath);
    }

    // ToDo, get the newest firmware version from the server. Not yet implemented

    const firmwareVersion: string = 'Test';

    // Create the path to the firmware file
    const firmwareFilePath = `${firmwareDirectoryPath}/${firmwareVersion}firmware.bin`;

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
    const firmwareFileExists = await checkFirmwareFileExists();

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