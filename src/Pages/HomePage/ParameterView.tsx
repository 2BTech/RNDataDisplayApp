import React, { FC, useState, } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, } from "react-native";
import { Icon } from 'react-native-elements';
import { useSelector } from "react-redux";
import { ParameterRanges, ParameterDescriptions, AirQualityRangeMap, AirQualityColorCodes, ParameterSigFigs } from "../../Constants/Parameters/ParameterDefs";
import { ParameterBreakdownObj, ParameterDataObj } from "../../redux/slices/deviceDataSlice";
import { DeviceId } from "../../redux/slices/deviceSlice";
import { RootState } from "../../redux/store";
import { AxisDomain, Chart, ChartDataPoint, Line, VerticalAxis } from "../Components/Graph";
import { HorizontalAxisTime } from "../Components/Graph/HorizontalAxisTime";

interface ParameterViewProps {
    parameterName: string;
    deviceKey: DeviceId;
}

interface ParameterSectionComponent {
    sectionName: string;
    sectionContent: any;
    isExpanded: boolean;
    toggleIsExpanded: (() => void);
}

const ParameterSection: FC<ParameterSectionComponent> = ({sectionName, sectionContent, isExpanded, toggleIsExpanded}) => {
    // const [isExpanded, setIsExpanded] = useState(true);

    // const toggleIsExpaned = () => {
    //     setIsExpanded(!isExpanded);
    // }

    return (
        <View style={styles.parameterSectionContainer}>
            <TouchableOpacity style={styles.parameterTitleContainer} onPress={toggleIsExpanded}>
                <Text style={styles.parameterSectionTitleText}>
                    {sectionName}
                </Text>
                <Icon style={styles.icon} type="font-awesome" name={isExpanded ? "chevron-down" : "chevron-up"} />
            </TouchableOpacity>
            {
                isExpanded && sectionContent
            }
        </View>
    );
}

const ParameterView: FC<ParameterViewProps> = ({parameterName, deviceKey}) => {
    const [breakdownIsExpanded, setBreakdownIsExpaned] = useState<boolean>(false);
    const [descriptionIsExpanded, setDescriptionIsExpanded] = useState<boolean>(false);
    const [rangesIsExpanded, setRangesIsExpanded] = useState<boolean>(false);
    const [graphIsExpanded, setGraphIsExpanded] = useState<boolean>(true);

    // console.log('Rendering parameter view for ', deviceKey, ': ', parameterName);

    const parameterData: ParameterDataObj = useSelector((state: RootState) => state.deviceDataSlice.deviceData[deviceKey].data[parameterName]) || {dataPoints: [], parameterName, breakdown: {min: 0, max: 0, current: 0, mean: 0, exponentialMovingAverage: 0}};

    const breakdownKeys: (keyof ParameterBreakdownObj)[] = ['current', 'min', 'max', 'mean', 'exponentialMovingAverage'];
    const parameterBreakdown = <View style={styles.breakDownContainer}>
        {
            breakdownKeys.map((val) => {
                return (
                    <View key={val} style={styles.breakdownSectionContainer}>
                        <Text style={styles.breakdownSectionText}>
                            {val}:
                        </Text>
                        <Text style={styles.breakdownValueText}>
                            {parameterData.breakdown[val].toFixed(ParameterSigFigs[parameterName])}
                        </Text>
                        <Text style={styles.breakdownUnitText}>
                            {parameterData.parameterUnits}
                        </Text>
                    </View>
                );
            }).filter(val => val != undefined)
        }
    </View>;

    // console.log('Break is not null: ', (parameterBreakdown != undefined));

    const parameterDescription = ParameterDescriptions[parameterName] &&
    <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
            {
                ParameterDescriptions[parameterName]
            }
        </Text>
    </View>;

    // console.log('Description is not null: ', (parameterDescription != undefined));

    const ranges: AirQualityRangeMap = ParameterRanges[parameterName];
    const parameterRanges = ranges &&
    <View style={styles.rangeTableContainer}>
        {/* Label */}
        <View style={styles.rangeEntryContainer}>
            <Text style={styles.rangeTextQuality}>Quality</Text>
            <Text style={styles.rangeTextMin}>Min</Text>
            <Text style={styles.rangeTextTo}>To</Text>
            <Text style={styles.rangeTextMax}>Max</Text>
        </View>

        {/* Good */}
        {
            ranges.Good && <View style={styles.rangeEntryContainer}>
                <Text style={StyleSheet.compose(styles.rangeTextQuality, {color: AirQualityColorCodes.Good})}>Good</Text>
                <Text style={styles.rangeTextMin}>{ranges.Good.min}</Text>
                <Text style={styles.rangeTextTo}>To</Text>
                <Text style={styles.rangeTextMax}>{ranges.Good.max}</Text>
            </View>
        }

        {/* Moderate */}
        {
            ranges.Moderate && <View style={styles.rangeEntryContainer}>
                <Text style={StyleSheet.compose(styles.rangeTextQuality, {color: AirQualityColorCodes.Moderate})}>Moderate</Text>
                <Text style={styles.rangeTextMin}>{ranges.Moderate.min}</Text>
                <Text style={styles.rangeTextTo}>To</Text>
                <Text style={styles.rangeTextMax}>{ranges.Moderate.max}</Text>
            </View>
        }
    
        {/* Unhealthy for Sensitive People */}
        {
            ranges["Unhealthy for sensitive groups"] && <View style={styles.rangeEntryContainer}>
                <Text style={StyleSheet.compose(styles.rangeTextQuality, {color: AirQualityColorCodes["Very unhealthy"]})}>Unhealthy for sensitive people</Text>
                <Text style={styles.rangeTextMin}>{ranges["Unhealthy for sensitive groups"].min}</Text>
                <Text style={styles.rangeTextTo}>To</Text>
                <Text style={styles.rangeTextMax}>{ranges["Unhealthy for sensitive groups"].max}</Text>
            </View>
        }

        {/* Unhealthy */}
        {
            ranges.Unhealthy && <View style={styles.rangeEntryContainer}>
                <Text style={StyleSheet.compose(styles.rangeTextQuality, {color: AirQualityColorCodes.Unhealthy})}>Unhealthy</Text>
                <Text style={styles.rangeTextMin}>{ranges.Unhealthy.min}</Text>
                <Text style={styles.rangeTextTo}>To</Text>
                <Text style={styles.rangeTextMax}>{ranges.Unhealthy.max}</Text>
            </View>
        }

        {/* Very Unhealthy */}
        {
            ranges["Very Unhealthy"] && <View style={styles.rangeEntryContainer}>
                <Text style={StyleSheet.compose(styles.rangeTextQuality, {color: AirQualityColorCodes["Very unhealthy"]})}>Very Unhealthy</Text>
                <Text style={styles.rangeTextMin}>{ranges["Very Unhealthy"].min}</Text>
                <Text style={styles.rangeTextTo}>To</Text>
                <Text style={styles.rangeTextMax}>{ranges["Very Unhealthy"].max}</Text>
            </View>
        }

        {/* Hazardous */}
        {
            ranges.Hazardous && <View style={styles.rangeEntryContainer}>
                <Text style={StyleSheet.compose(styles.rangeTextQuality, {color: AirQualityColorCodes.Hazardous})}>Hazardous</Text>
                <Text style={styles.rangeTextMin}>{ranges.Hazardous.min}</Text>
                <Text style={styles.rangeTextTo}>To</Text>
                <Text style={styles.rangeTextMax}>{ranges.Hazardous.max}</Text>
            </View>
        }
    </View>;

    // console.log('Parameter ranges is not null: ', (parameterRanges != undefined));

    let xRange: AxisDomain = {
        min: parameterData.dataPoints.length > 0 ? parameterData.dataPoints[0].time : 0,
        max: parameterData.dataPoints.length > 0 ? parameterData.dataPoints[parameterData.dataPoints.length - 1].time : 1,
    };
    let yRange: AxisDomain = {
        min: parameterData.dataPoints.length > 0 ? parameterData.dataPoints[0].value : 0,
        max: parameterData.dataPoints.length > 0 ? parameterData.dataPoints[parameterData.dataPoints.length - 1].value : 1,
    };

    // console.log('Number of initial data points: ', parameterData.dataPoints.length);
    let graphData: ChartDataPoint[] = parameterData.dataPoints.map(point => {
        if (Number.isNaN(point.value)) {
            return {x: NaN, y: NaN,};   
        }
        yRange.min = Math.min(point.value, yRange.min);
        yRange.max = Math.max(point.value, yRange.max);

        return {
            x: point.time,
            y: point.value,
        };
    }).filter(val => !Number.isNaN(val.y));
    // console.log('Number of filtered data points: ', graphData.length);
    if (Number.isNaN(yRange.min)) {
        yRange = {min: 0, max: 1};
    }

    if (graphData.length == 0) {
        // console.log('Graph data is empty');
        graphData.push({x: 0, y: 0});
    }

    let diff = (xRange.max - xRange.min) / 20;
    if (diff < 1) {
        diff = 1;
    }
    xRange.max += diff;
    xRange.min -= diff;

    diff = (yRange.max - yRange.min) / 20;
    if (diff < 1) {
        diff = 1;
    }
    yRange.max += diff;
    yRange.min -= diff;

    // console.log('Graph data: ', graphData);
    // console.log('Graph y range: ', yRange);
    // console.log('Graph data: ', graphData);

    const parameterGraph =// undefined &&
    <Chart
        style={{ height: 300, width: '100%' }}
        xDomain={xRange}
        yDomain={yRange}
        // Creates room for axis labels
        padding={{ left: 30, top: 20, bottom: 20, right: 20, }}
        >
            <VerticalAxis tickCount={5} />
            <HorizontalAxisTime tickCount={5} />
            <Line 
                data={graphData}
                smoothing="none" 
                theme={{ stroke: { color: 'green', width: 1 }}}
            />
    </Chart>;

    return (
        <View style={styles.container}>
            {/* Parameter name */}
            <View style={styles.parameterNameContainer}>
                <Text style={styles.parameterName}>
                    {parameterName}
                </Text>
            </View>

            {/* Parameter break down */}
            {parameterBreakdown != undefined ? <ParameterSection sectionName="Break down" sectionContent={parameterBreakdown} isExpanded={breakdownIsExpanded} toggleIsExpanded={() => setBreakdownIsExpaned(!breakdownIsExpanded)} /> : <></>}

            {/* Parameter Description */}
            {parameterDescription != undefined ? <ParameterSection sectionName="Description" sectionContent={parameterDescription} isExpanded={descriptionIsExpanded} toggleIsExpanded={() => setDescriptionIsExpanded(!descriptionIsExpanded)} /> : <></>}

            {/* Parameter Value Ranges */}
            {parameterRanges != undefined ? <ParameterSection sectionName="Ranges" sectionContent={parameterRanges} isExpanded={rangesIsExpanded} toggleIsExpanded={() => setRangesIsExpanded(!rangesIsExpanded)} /> : <></>}

            {/* Parameter graph */}
            {parameterGraph != undefined ? <ParameterSection sectionName="Graph" sectionContent={parameterGraph} isExpanded={graphIsExpanded} toggleIsExpanded={() => setGraphIsExpanded(!graphIsExpanded)} /> : <></>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'column',

        width: '100%',
        height: '100%',

        borderTopWidth: 1,

        backgroundColor: 'white',
    },

    // Style for the container holding a parameter section
    parameterSectionContainer: {
        // Expand to include all items
        flex: 1,
        // Expand in the column direction
        flexDirection: 'column',

        // The section should fill all of the width
        width: '100%',

        // Add a line to the top to seperate different sections
        borderTopWidth: 2,

        // Add space between components
        marginTop: 5,
        backgroundColor: 'white',
    },
    parameterTitleContainer: {
        borderBottomWidth: 1,
        borderRightWidth: 1,
        
        alignSelf: 'flex-start',
        
        paddingLeft: 20,
        paddingRight: 10,

        backgroundColor: 'lightgray',
    
        flexDirection: 'row',
    },
    // Styling for a parameter section text
    parameterSectionTitleText: {
        // Set the size of the section title text
        fontSize: 20,
        // Align the text to the left,
        textAlign: 'left',
        color: 'black',
    },
    icon: {
        // marginRight: 10,
        // borderLeftWidth: 1,
        paddingLeft: '5%',
      },

    parameterNameContainer: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        
        paddingLeft: 20,
        paddingRight: 10,

        backgroundColor: 'white',
    },
    parameterName: {
        textAlign: 'center',
        textAlignVertical: 'center',
        
        fontSize: 30,
        color: 'black',
    },

    descriptionContainer: {
        width: '100%',
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    descriptionText: {
        fontSize: 15,
        color: 'black',
    },

    breakDownContainer: {
        width: '100%',

        marginTop: 10,
        backgroundColor: 'white',
    },
    breakdownSectionContainer: {
        width: '100%',

        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    breakdownSectionText: {
        textAlign: 'left',
        fontSize: 20,
        paddingLeft: 30,
        minWidth: '30%',
        color: 'black',
    },
    breakdownValueText: {
        fontSize: 20,
        paddingLeft: 20,
        textDecorationLine: 'underline',
        color: 'black',
    },
    breakdownUnitText: {
        fontSize: 20,
        paddingLeft: 20,
        color: 'black',
    },

    rangeTableContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    rangeEntryContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    rangeTextQuality: {
        fontSize: 20,
        textAlign: 'center',
        width: '40%',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        color: 'black',
        textAlignVertical: 'center',
    },
    rangeTextMin: {
        fontSize: 20,
        textAlign: 'center',
        width: '20%',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        color: 'black',
        textAlignVertical: 'center',
    },
    rangeTextTo: {
        fontSize: 20,
        textAlign: 'center',
        width: '20%',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        color: 'black',
        textAlignVertical: 'center',
    },
    rangeTextMax: {
        fontSize: 20,
        textAlign: 'center',
        width: '20%',
        borderBottomWidth: 1,
        color: 'black',
        textAlignVertical: 'center',
    }
});

export default ParameterView;