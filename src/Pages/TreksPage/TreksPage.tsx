import React, { FC, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, Modal, Image, } from "react-native";
import DatePicker from "react-native-date-picker";
import { useSelector } from "react-redux";
import { DeviceDefinition, DeviceId } from "../../redux/slices/deviceSlice";
import { RootState, store } from "../../redux/store";
import { FileTypes, buildDeviceDirPath, buildDeviceFileName } from "../../Utils/FileUtils";
import { DeviceDataObj, TimeDataMap } from "../../redux/slices/deviceDataSlice";
import { AddPointToKML, ConvertToString, CreateDefaultKMLDoc } from "../../Utils/KMLUtils";
import moment from "moment";
import * as RNFS from 'react-native-fs';
import { ParameterSigFigs } from "../../Constants/Parameters/ParameterDefs";
import Spinner from 'react-native-loading-spinner-overlay';
// import { Button } from "react-native-elements";

interface TreksPageProps {
    deviceKey: DeviceId;
}

const TreksPage: FC<TreksPageProps> = React.memo(({ deviceKey }) => {
    // Start by gathering information from the redux store

    // Get the device definition
    const deviceDef: DeviceDefinition = useSelector((state: RootState) => state.deviceSlice.deviceDefinitions[deviceKey]);

    // Next, get the first and last time stamps
    const firstTimeStamp: number | undefined = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].firstDataTimeStamp);
    // Then, get the last time stamp
    const lastTimeStamp: number | undefined = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].timeStamps.pop());

    // Convert the time stamps to date objects
    const startT: Date = firstTimeStamp ? new Date(firstTimeStamp) : new Date();
    const latest: Date = lastTimeStamp ? new Date(lastTimeStamp) : new Date();

    // Build the state variables for the page

    // Create the file name for the trek
    const [fileName, setFileName] = useState<string>(buildDeviceFileName(deviceDef.deviceName, FileTypes.TrekFile, true));
    // Create a state variable to track the selected start time. If firstTimeStamp or lastTimeStamp are undefined, use the current time
    const [startTime, setStartTime] = useState<Date>(firstTimeStamp ? new Date(firstTimeStamp) : new Date());
    // Create a state variable to track the selected end time. If firstTimeStamp or lastTimeStamp are undefined, use the current time
    const [endTime, setEndTime] = useState<Date>(lastTimeStamp ? new Date(lastTimeStamp) : new Date());
    // Create a state variable to track if the blocking widget is active. This should be true when the trek is being created and saved
    const [blockingPageActive, setBlockingPageActive] = useState<boolean>(false);
    
    

    

    // This function will save a created trek to the device
    const saveTrek = async (kmlDoc: Document) => {
        // Get the path to the directory where the file will be saved
        const dirPath: string = buildDeviceDirPath(deviceDef.deviceName, FileTypes.TrekFile);

        // Check if the directory exists
        const dirExits: boolean = await RNFS.exists(dirPath);

        // Create dest dir if exists
        if (!dirExits) {
            // Will create sub dirs so no need to do recursive
            await RNFS.mkdir(dirPath);
        }

        console.log('Saving trek: ', dirPath + fileName);

        await RNFS.writeFile(dirPath + fileName, ConvertToString(kmlDoc))
            .catch(err => console.log('Failed to save trek: ', err));
    }

    const setBlocking = async () => {
        await setBlockingPageActive(true);
    }
    const clearBlocking = async () => {
        setBlockingPageActive(false);
    }

    // This function handles generating a trek based on the selected time range
    const createTrek: () => Promise<void> = async () => {
        // Do not make the trek if the start time is greater than or equal to the end time
        if (startTime >= endTime) {
            console.log('Not making Trek: The start time is greater than or equal to end time');
            return;
        }

        // Log that a trek is being created with the selected file name
        console.log('Creating trek: ', fileName);

        // Get the name of the current device data file from the deviceSlice
        const dataFileName: string = store.getState().deviceSlice.deviceDefinitions[deviceKey].fileName;

        // If the file name is empty, then the file has not been created yet, no data to build a trek from, so return
        if (dataFileName == '') {
            console.log('Not making Trek: No data file for device');
            return;
        }

        // Next, try to open the device data file for reading. If failed to open, return. Read all at once to prevent issues with the file being written to while reading
        let fileContents: string = '';
        try {
            fileContents = await RNFS.readFile(dataFileName);
        } catch (err) {
            console.log('Failed to read file: ', err);
            return;
        }

        // Next, parse fileContents into lines
        const lines: string[] = fileContents.split('\n');

        // Clear the fileContents variable to free up memory
        fileContents = '';

        // Get the header from the file by taking the first line from lines
        const fileHeader: string[] = (lines.shift() || '').split(',');

        // Create a empty kml document that will be used to build the trek
        let kmlDoc: Document = CreateDefaultKMLDoc(fileName);

        // Get the index of the time column from the file header
        const timeIndex: number = fileHeader.indexOf('Time');
        // Get the index of the date column from the file header
        const dateIndex: number = fileHeader.indexOf('Date');
        // Get the latitude index
        const latIndex: number = fileHeader.indexOf('Latitude');
        // Get the longitude index
        const lonIndex: number = fileHeader.indexOf('Longitude');
        // Get the altitude index
        const altIndex: number = fileHeader.indexOf('Altitude');

        // Iterate through the lines until we find the first line that has a time stamp that is greater than or equal to the start time
        let line: string[] = [];
        let timeStampInRange: boolean = false;

        do {
            // Get the next line from lines and split into an array
            line = (lines.shift() || '').split(',');

            // Next, rebuild the date time object from the line
            const lineDate: Date = new Date(line[dateIndex] + ' ' + line[timeIndex]);

            // Check if the line date is greater than or equal to the start time
            if (lineDate >= startTime) {
                timeStampInRange = true;
            }

        } while (lines.length > 0 && !timeStampInRange);

        // If timeStampInRange is false, then return b/c no time stamps are in the range
        if (!timeStampInRange) {
            console.log('Not making Trek: No time stamps in range');
            return;
        }

        // Iterate through the lines until we find the first line that has a time stamp that is greater than the end time. Add an entry into the kml document for each line that is kept
        do {
            // Rebuild the date time object from the line
            const lineDate: Date = new Date(line[dateIndex] + ' ' + line[timeIndex]);

            // If the line date is greater than the end time, then break the loop
            if (lineDate > endTime) {
                break;
            }

            // Create the data string for the kml entry
            // Example:
            // <Header>
            // <DataLine>
            // <Parameter Name> = <Value>
            // ...
            // <Longitude> = <Value>
            // <Latitude> = <Value>
            // <Altitude> = <Value>
            // <Date> = <Value>
            // <Time> = <Value>
            let data: string = '';

            // Add the header to the data string
            data += fileHeader.join(',') + '\n';
            // Add the line to the data string
            data += line.join(',') + '\n';

            // Add each parameter to data
            fileHeader.forEach((param, index) => {
                // Skip the time, date, longitude, latitude, and altitude columns
                if (param == 'Time' || param == 'Date' || param == 'Longitude' || param == 'Latitude' || param == 'Altitude') {
                    return;
                }

                // Add the parameter to data
                data += param + ' = ' + line[index] + '\n';
            });

            // Add the GPS data
            data += 'Longitude = ' + line[lonIndex] + '\n';
            data += 'Latitude = ' + line[latIndex] + '\n';
            data += 'Altitude = ' + line[altIndex] + '\n';
            data += 'Date = ' + line[dateIndex] + '\n';
            data += 'Time = ' + line[timeIndex] + '\n';

            // Add the data to the kml document
            AddPointToKML(kmlDoc, line[timeIndex], data, line[latIndex] + ',' + line[lonIndex] + ',' + line[altIndex]);

            // Check if there are more lines to process
            if (lines.length > 0) {
                // Get the next line from lines and split into an array
                line = (lines.shift() || '').split(',');
            } else {
                break;
            }
        } while (1);

        // Save the trek to the file
        await saveTrek(kmlDoc);
        // Log that the trek has been saved
        console.log('Finished saving trek');
    }

    const renderDownloadProgressView = () => {
        return (
            <Modal visible={blockingPageActive} transparent animationType="none">
                <View style={styles.overlay}>
                    <Text style={styles.downloadTitle}>Creating Trek: {fileName}</Text>
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

            {/* File Name Input */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabelText}>File Name:</Text>
                <TextInput style={styles.input} onEndEditing={e => setFileName(e.nativeEvent.text)} defaultValue={fileName} />
            </View>

            {/* Start Time Selector */}
            <View style={styles.sectionContainer}>
                <DatePicker 
                    minimumDate={latest}
                    maximumDate={endTime}
                    date={startTime}
                    mode="datetime"
                    textColor="black"
                    onDateChange={nDate => setStartTime(nDate)}
                    />
                <Text style={StyleSheet.compose(styles.sectionLabelText, {position: 'absolute'})}>Start Time:</Text>
            </View>

            {/* End Time Selector */}
            <View style={styles.sectionContainer}>
                <DatePicker 
                    minimumDate={startTime}
                    maximumDate={latest}
                    date={endTime}
                    mode="datetime"
                    textColor="black"
                    onDateChange={nDate => setEndTime(nDate)}
                    />
                <Text style={StyleSheet.compose(styles.sectionLabelText, {position: 'absolute'})}>End Time:</Text>
            </View>

            <View style={StyleSheet.compose(styles.sectionContainer, {borderBottomWidth: 0,})}>
                <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={async () => {
                        setBlocking()
                            .then(_ => createTrek())
                            .then(_ => clearBlocking())
                    }}>
                    <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Save Trek</Text>
                </TouchableOpacity>
            </View>

            {/* <Spinner
                visible={blockingPageActive}
                textContent={'Creating and saving trek'}
                textStyle={styles.spinnerTextStyle}
                /> */}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },

    sectionContainer: {
        width: '90%',

        borderBottomWidth: 1,

        marginHorizontal: '5%',
        marginBottom: 10,
    },

    sectionLabelText: {
        color: 'black',
        fontSize: 18,
    },

    input: {
        borderWidth: 1, 
        borderRadius: 4, 
        height: 35, 
        margin:0, 
        textAlign: 'center', 
        minWidth: 60, 
        color: 'black',
        backgroundColor: 'white',
        marginBottom: 5,
    },

    spinnerTextStyle: {
        color: 'black',
    },

    button: {
        borderColor: 'black',
        borderWidth: 1,

        marginTop: 10,
        marginBottom: 10,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',

        // backgroundColor: '#d3d3d3',
        backgroundColor: '#055D9C',

        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 10,

        borderBottomWidth: 2,
    },
    defaultButton: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10, 
        marginRight: 10, 
        borderRadius: 10,
    },

    defaultTextStyle: {
        color: 'black',
        fontSize: 12,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
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

export default TreksPage;