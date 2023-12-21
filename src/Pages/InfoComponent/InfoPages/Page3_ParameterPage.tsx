import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Image from '../../Components/react-native-scalable-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

interface ParameterViewDescriptionProps {

}

const ParameterViewDescription: FC<ParameterViewDescriptionProps> = React.memo(({}) => {
    const separatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%'}}>
            <View style={{height: '15%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: separatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faHome} size={35} />
                        <Text style={styles.titleText}>Parameter Page</Text>
                    </View>
                <View style={{height: separatorHeight / 4}} />
            </View>

            <ScrollView style={{width: '100%', height: '85%'}} showsVerticalScrollIndicator={false}>
                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>The Parameter View Page displays a detailed view of a given parameter. The page consists of up to 4 sections: Break Down, Description, Ranges, Graph.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth} source={require('../../../../screenShots/ParameterDescription/ParameterDescriptionPage.png')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>The breakdown section provides a collection of data to help describe the received data. The break down consists of 5 fields: Current, Min, Max, Mean, Moving Avg. The Current field displays the most recent measurement for the selected parameter. The Min and Max fields provide the bounds for the measurements received from the device. The Mean field shows the average across all of the readings. The Moving Avg field gives a weighted average where the most recent measurement have a stronger effect on the avg.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/ParameterDescription/ParameterDescriptionBreakDown.png')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>The Description section gives a general overview of what the selected parameter is. It is only present for the main parameters measured by each device.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/ParameterDescription/ParameterDescriptionDescription.png')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>The ranges section presents a chart that describes different concentrations of the parameter. This section is not present on all parameters.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/ParameterDescription/ParameterDescriptionRanges.png')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>The Graph section provides a graph that plots the last hour of readings for the selected parameter. The graph will auto-scale to match the graph.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/ParameterDescription/ParameterDescriptionGraph.png')} />
                </View>
                <View style={{height: separatorHeight / 2}} />

            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    contentText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        flex: 1,
        alignSelf: 'stretch',

        width: '90%', marginHorizontal: '5%'
    },
    titleText: {
        fontSize: 25,
        color: 'black',
        width: '65%',
        textAlign: 'center',
    },

    sectionTitleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
});

export default ParameterViewDescription;