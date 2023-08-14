import { SettingObj } from "../../redux/slices/deviceSettingsSlice";

export const requestSettingsCommand = '{"command": 100, "body": []}';

// ToDo, type settings filed
export const BuildChangeSettingsCommand = (settings: SettingObj[]) => {
    return JSON.stringify({
        command: 101,
        body: settings,
    });
}

export const requestDataFileNamesCommand = '{"command": 110, body: []}';

export const BuildRequestDataFileCommand = (fileName: string) => {
    return JSON.stringify({
        command: 111,
        body: {
            fileName,
            part: '0',
        },
    });
}

export const BuildRequestFilePartCommand = (fileName: string, partIndex: number) => {
    return JSON.stringify({
       command: 111,
       body: {
        fileName,
        part: String(partIndex),
       },
    });
}

export const BuildFirmwareUploadMessage = (data: string, index: number, numParts: number) => {
    return JSON.stringify({
        command: 600,
        body: {
            index,
            numParts,
            data,
        }
    });
}