import React, { FC, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Dimensions, ActivityIndicator, } from "react-native";
// import { LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import ParameterDescriptions, { ParameterSigFigs, getParameterValueColor } from "../../../Constants/Parameters/ParameterDefs";
import { Chart, ChartDataPoint, HorizontalAxis, Line, Tooltip, VerticalAxis } from "../../Components/Graph";
import { HorizontalAxisTime } from "../../Components/Graph/HorizontalAxisTime";
import { ParameterDataObj } from "../../../redux/slices/deviceDataSlice";
import { DeviceId } from "../../../redux/slices/deviceSlice";
import { RootState } from "../../../redux/store";
import moment from "moment";

interface ParamaterOverviewPageProps {
    deviceKey: DeviceId;
    parameterNames: Array<string>;
    onPressParameter: ((parameterName: string) => void) | undefined;
    pageHeight: number;
}

interface ParamaterCellProps {
    deviceKey: DeviceId;
    paramterName: string;
    onPressParameter: ((parameterName: string) => void) | undefined;

    cellHeight: number;
}

interface CellSizeObj {
    width: number;
    height: number;
}

const LoadingCell: FC = ({}) => {
    return (
        <View style={styles.parameterCellContainer}>
            <ActivityIndicator size={'large'} color={'lightblue'} />
        </View>
    );
}

const ParameterValueCell: FC<ParamaterCellProps> = ({paramterName, deviceKey, onPressParameter, cellHeight}) => {
    const parameterData: ParameterDataObj = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].data[paramterName]);
    return (
        <TouchableHighlight underlayColor={'lightblue'} style={styles.parameterCellContainer} onPress={onPressParameter ? () => onPressParameter(paramterName) : () => {}}>
            <View style={styles.container}>
                <Text style={styles.parameterCellTitle}>{paramterName}</Text>
                <Text style={StyleSheet.compose(styles.parameterValueText, {color: getParameterValueColor(paramterName, parameterData.breakdown.current)})}>{parameterData.breakdown.current.toFixed(ParameterSigFigs[paramterName])} {parameterData.parameterUnits}</Text>
            </View>
        </TouchableHighlight>
    );
}

const ParameterDateTimeCell: FC<ParamaterCellProps> = ({paramterName, deviceKey, onPressParameter, cellHeight}) => {
    const timeStamps: number[] = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].timeStamps);

    const lastTime = moment(timeStamps.length > 0 ? new Date(timeStamps[timeStamps.length - 1]) : new Date())

    return (
        <TouchableHighlight underlayColor={'lightblue'} style={styles.parameterCellContainer} onPress={onPressParameter ? () => onPressParameter(paramterName) : () => {}}>
            <View style={styles.container}>
                <Text style={styles.parameterCellTitle}>{paramterName}</Text>
                <Text style={styles.parameterValueText}>{paramterName == 'Date' ? lastTime.format('DD/MM/yyyy') : lastTime.format('hh:mm:ss')}</Text>
            </View>
        </TouchableHighlight>
    );
}

const ParameterGraphCell: FC<ParamaterCellProps> = ({paramterName, deviceKey, onPressParameter, cellHeight}) => {
    const parameterData: ParameterDataObj = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].data[paramterName]);

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: parameterData.dataPoints.slice(-5).map(point => point.value),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
    }
    if (data.datasets[0].data.length == 0) {
        data.datasets[0].data.push(0);
    }

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    const [cellSizeObj, setGraphSize] = useState<CellSizeObj|undefined>(undefined);

    return (
        // <TouchableOpacity style={styles.parameterCellContainer} onPress={onPressParameter ? () => onPressParameter(paramterName) : () => {}}>
        //     <Text style={styles.parameterCellTitle}>{paramterName}</Text>
        //     {
        //         <Chart
        //             style={{ height: '67%', width: '100%' }}
        //             xDomain={{ min: 0.5, max: 3.5, }}
        //             yDomain={{ min: 0.5, max: 3.5, }}
        //             // Creates room for axis labels
        //             padding={{ left: 0, top: 0, bottom: 0, right: 0 }}
        //             >
        //                 <VerticalAxis tickCount={5} />
        //                 <HorizontalAxisTime tickCount={5} />
        //                 <Line 
        //                     data={[{ x: 1, y: 2 }, {x: 2, y: 1}, {x: 3, y: 3}]}
        //                     smoothing="none" 
        //                     theme={{ stroke: { color: 'green', width: 1 } }}
        //                 />
        //         </Chart>
        //     }
        //     <Text style={styles.parameterValueText}>{parameterData.breakdown.current.toFixed(ParameterSigFigs[paramterName])} {parameterData.parameterUnits}</Text>
        // </TouchableOpacity>

        <TouchableHighlight underlayColor={'lightblue'} style={styles.parameterCellContainer} onPress={onPressParameter ? () => onPressParameter(paramterName) : () => {}}>
            <View>
            <Text style={styles.parameterCellTitle}>{paramterName}</Text>
            {
                <Chart
                    style={{ height: '67%', width: '100%' }}
                    xDomain={{ min: 0.5, max: 3.5, }}
                    yDomain={{ min: 0.5, max: 3.5, }}
                    // Creates room for axis labels
                    padding={{ left: 0, top: 0, bottom: 0, right: 0 }}
                    >
                        <VerticalAxis tickCount={5} />
                        <HorizontalAxisTime tickCount={5} />
                        <Line 
                            data={[{ x: 1, y: 2 }, {x: 2, y: 1}, {x: 3, y: 3}]}
                            smoothing="none" 
                            theme={{ stroke: { color: 'green', width: 1 } }}
                        />
                </Chart>
            }
            <Text style={styles.parameterValueText}>{parameterData.breakdown.current.toFixed(ParameterSigFigs[paramterName])} {parameterData.parameterUnits}</Text>
            </View>
        </TouchableHighlight>
    );
};

const ParameterOverviewPage: FC<ParamaterOverviewPageProps> = ({parameterNames, deviceKey, onPressParameter, pageHeight}) => {

    const cellHeight = pageHeight / 3;

    const renderParameterCells = (parameters: string[]): Array<JSX.Element> => {
        let toReturn: Array<JSX.Element> = [];

        // console.log('renderParameterCells');
        // console.log('parameters: ', parameters);

        // Create 6 boxes with a loading effect
        if (parameterNames.length == 0) {
            // console.log('Creating loading cells');
            toReturn.push(
                <View key={'parameterRow0'} style={styles.parameterRowContainer}>
                    <LoadingCell />
                    <LoadingCell />
                </View>
            );
            toReturn.push(
                <View key={'parameterRow1'} style={styles.parameterRowContainer}>
                    <LoadingCell />
                    <LoadingCell />
                </View>
            );
            toReturn.push(
                <View key={'parameterRow2'} style={styles.parameterRowContainer}>
                    <LoadingCell />
                    <LoadingCell />
                </View>
            );
            return toReturn;
        }

        for (let i = 0; i + 1 < parameterNames.length; i += 2) {
            toReturn.push(
            <View key={'parameterRow' + i / 2} style={styles.parameterRowContainer}>
                <ParameterValueCell paramterName={parameterNames[i]} deviceKey={deviceKey} onPressParameter={onPressParameter} cellHeight={cellHeight} />
                <ParameterValueCell paramterName={parameterNames[i + 1]} deviceKey={deviceKey} onPressParameter={onPressParameter} cellHeight={cellHeight} />
            </View>
            );
        }

        if (parameterNames.length % 2 == 1) {
            toReturn.push(
                <View key={'parameterRowlast'} style={styles.parameterRowContainer}>
                    <ParameterValueCell paramterName={parameterNames[parameterNames.length - 1]} deviceKey={deviceKey} onPressParameter={onPressParameter} cellHeight={cellHeight} />
                </View>
            );
        }

        toReturn.push(
            <View key={'parameterRow dt'} style={styles.parameterRowContainer}>
                <ParameterDateTimeCell paramterName={'Date'} deviceKey={deviceKey} onPressParameter={onPressParameter} cellHeight={cellHeight} />
                <ParameterDateTimeCell paramterName={'Time'} deviceKey={deviceKey} onPressParameter={onPressParameter} cellHeight={cellHeight} />
            </View>
            );

        return toReturn;
    }

    return (
        <View style={styles.container}>
            {
                renderParameterCells(parameterNames)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

        width: '100%',
        height: '100%',
    },

    parameterCellContainer: {
        flex: 1,
        width: '50%',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    parameterRowContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    parameterCellTitle: {
        fontSize: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '33%',
        color: 'black',
    },
    parameterValueText: {
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '67%',
        width: '100%',
        color: 'black',

        position: 'absolute',
        top: '33%',
        left: 0,
    },
});

export default ParameterOverviewPage;