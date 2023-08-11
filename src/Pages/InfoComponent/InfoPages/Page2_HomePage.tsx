import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
// import Image from 'react-native-scalable-image';
import Image from '../../Components/react-native-scalable-image';

interface HomePageDescriptionProps {

}

const HomePageDescription: FC<HomePageDescriptionProps> = React.memo(({}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '90%', marginHorizontal: '5%'}}>
            <View style={{height: '15%'}}>
                <View style={{height: seperatorHeight}} />
                <Text style={styles.titleText}>Home Page</Text>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <View style={{height: '85%'}}>
                <ScrollView style={{width: '100%', height: '100%'}}>
                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The Home Page provides a quick overview of the most recent measurement from the selected device.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth} source={require('../../../../screenShots/HomePageDefault.png')} />
                    </View>

                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>The page consists of a collection of cells that display the most recent reading for each parameter. The values in some cells are color coded to match concentation levels of the paramter.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    {/* ToDo, switch to a picture of just a single cell */}
                    <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                        <Image width={picWidth} source={require('../../../../screenShots/singleCell.png')} />
                    </View>

                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>To get a more detailed view of a specific reading, press the cell.</Text>
                    <View style={{height: seperatorHeight / 2}} />
                </ScrollView>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    contentText: {
        fontSize: 18,
        color: 'black',
        width: '100%',
        textAlign: 'center',
        flex: 1,
        alignSelf: 'stretch',
    },
    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },

    sectionTitleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
});

export default HomePageDescription;