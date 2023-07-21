import React, { FC, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Button, } from "react-native";
import DatePicker from "react-native-date-picker";
import { useSelector } from "react-redux";
import { DeviceId } from "../../redux/slices/deviceSlice";
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

const TreksPage: FC<TreksPageProps> = ({ deviceKey }) => {
    const deviceDef = useSelector((state: RootState) => state.deviceSlice.deviceDefinitions[deviceKey]);
    const timeData: TimeDataMap = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].timeData);
    const timeStamps = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].timeStamps);

    const earliest: Date = new Date(timeStamps.length > 0 ? timeStamps[0] : 0);
    const latest: Date = new Date(timeStamps.length > 0 ? timeStamps[timeStamps.length - 1] : 1);

    const [fileName, setFileName] = useState<string>(buildDeviceFileName(deviceDef.deviceName, FileTypes.TrekFile, true));
    const [startTime, setStartTime] = useState<number>(earliest.getTime());
    const [endTime, setEndTime] = useState<number>(latest.getTime());

    const [blockingPageActive, setBlockingPageActive] = useState<boolean>(false);

    const saveTrek = async (kmlDoc: Document) => {
        const dirPath = buildDeviceDirPath(deviceDef.deviceName, FileTypes.TrekFile);

        // Check if the directory exists
        const dirExits = await RNFS.exists(dirPath);

        // Create dest dir if exists
        if (!dirExits) {
            // Will create sub dirs so no need to do recursive
            await RNFS.mkdir(dirPath);
        }

        console.log('Saving trek: ', dirPath + fileName);

        await RNFS.writeFile(dirPath + fileName, ConvertToString(kmlDoc))
            .catch(err => console.log('Failed to save trek: ', err));
    }

    const testFunct = async () => {
        setBlockingPageActive(true);
        await createTrek()
        
        alert('Finished saving trek');

        setBlockingPageActive(false)
    }

    const createTrek = async () => {
        console.log('Creating trek: ', fileName);
        setBlockingPageActive(true);

        const devData: DeviceDataObj = store.getState().deviceDataSlice.deviceData[deviceKey];
        const timeStamps: number[] = devData.timeStamps.filter(time => time >= startTime && time <= endTime);
        const selected: string[] = devData.parameterNames;
        const header: string = devData.parameterNames.join(',');

        console.log('Timestamps. Count: ', timeStamps.length, ' / ', devData.timeStamps.length);
        console.log('Header: ', devData.parameterNames.join(','));

        let kmlDoc: Document = CreateDefaultKMLDoc(fileName);

        timeStamps.forEach(time => {
            let content = header + 'Date,Time' + '\n';
            let data: (string | number)[] = [];
            let cont: string[] = [];
            selected.forEach(param => {
                const val: (string | number) = devData.timeData[time].points[param];
                if (val) {
                    if (typeof val == 'number' && Object.keys(ParameterSigFigs).includes(param)) {
                        data.push(val.toFixed(ParameterSigFigs[param]));
                        cont.push(param + ' = ' + val.toFixed(ParameterSigFigs[param]));
                    } else {
                        data.push(val);
                        cont.push(param + ' = ' + val);
                    }
                }
            });
            const timeStamp = moment(new Date(time));
            data.push(timeStamp.format('DD/MM/yyyy'));
            data.push(timeStamp.format('HH:mm:ss'));
            cont.push('Date = ' + timeStamp.format('DD/MM/yyyy'));
            cont.push('Time = ' + timeStamp.format('HH:mm:ss'));

            content += data.join(',') + '\n';
            content += cont.join('\n');

            AddPointToKML(kmlDoc, timeStamp.format('HH:mm:ss'), content, devData.timeData[time].gpsCoords);

            setBlockingPageActive(false);
        });

        await saveTrek(kmlDoc);

        setBlockingPageActive(false);

        console.log('Finished saving trek');
    }

    return (
        <ScrollView style={styles.container}>
            {/* File Name Input */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabelText}>File Name</Text>
                <TextInput style={styles.input} onEndEditing={e => setFileName(e.nativeEvent.text)} defaultValue={fileName} />
            </View>

            {/* Start Time Selector */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabelText}>Start Time</Text>
                <DatePicker 
                    minimumDate={earliest}
                    maximumDate={new Date(endTime)}
                    date={new Date(startTime)}
                    mode="datetime"
                    textColor="black"
                    onDateChange={nDate => setStartTime(nDate.getTime())}
                    />
            </View>

            {/* End Time Selector */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabelText}>End Time</Text>
                <DatePicker 
                    minimumDate={new Date(startTime)}
                    maximumDate={latest}
                    date={new Date(endTime)}
                    mode="datetime"
                    textColor="black"
                    onDateChange={nDate => setEndTime(nDate.getTime())}
                    />
            </View>

            <View style={StyleSheet.compose(styles.sectionContainer, {borderBottomWidth: 0,})}>
                <Button title={'Save Trek'} onPress={testFunct} />
            </View>

            <Spinner 
                visible={blockingPageActive}
                textContent={'Creating and saving trek'}
                textStyle={styles.spinnerTextStyle}
                />
        </ScrollView>
    );
}

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
});

export default TreksPage;