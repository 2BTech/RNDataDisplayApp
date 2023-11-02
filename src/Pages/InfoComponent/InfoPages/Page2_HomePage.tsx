import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
// import Image from 'react-native-scalable-image';
import Image from '../../Components/react-native-scalable-image';
import BulletPoint from '../../Components/bulletPoint';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

interface HomePageDescriptionProps {

}

const HomePageDescription: FC<HomePageDescriptionProps> = React.memo(({}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%'}}>
            <View style={{height: '15%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: seperatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faHome} size={35} />
                        <Text style={styles.titleText}>Home Page</Text>
                    </View>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <ScrollView style={{width: '100%', height: '85%'}} showsVerticalScrollIndicator={false}>
                    
                <View style={{height: seperatorHeight}} />
                <Text style={styles.contentText}>The Home Page provides a quick and easy way to view all of the data from the selected device.</Text>
                <View style={{height: seperatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth} source={require('../../../../screenShots/HomePageDefault.png')} />
                </View>

                <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>Each parameter reported by the device is displayed in a cell that prominently displays the most recent reading.</Text>
                <View style={{height: seperatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth} source={require('../../../../screenShots/singleCell.png')} />
                </View>

                <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>A more detailed view can be accessed on the Parameter page. This page can be accessed by pressing on a parameter cell or by using the arrows on the bottom of the page.</Text>
                <View style={{height: seperatorHeight / 2}} />

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

        width: '90%', marginHorizontal: '5%',
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

    featuresText: {
        fontSize: 16,
        color: 'black',
        width: '100%',
        textAlign: 'left',
        flex: 1,
        alignSelf: 'stretch',
    },
});

export default HomePageDescription;