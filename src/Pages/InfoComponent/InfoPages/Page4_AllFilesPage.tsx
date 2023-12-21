import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Image from '../../Components/react-native-scalable-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFolderOpen, } from '@fortawesome/free-solid-svg-icons';

interface AllFilesPageDescriptionProps {

}

const AllFilesPageDescription: FC<AllFilesPageDescriptionProps> = React.memo(({}) => {
    const separatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%'}}>
            <View style={{height: '15%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: separatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faFolderOpen} size={35} />
                        <Text style={styles.titleText}>All Files Page</Text>
                    </View>
                <View style={{height: separatorHeight / 4}} />
            </View>

            <ScrollView style={{width: '100%', height: '85%'}} showsVerticalScrollIndicator={false}>
                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>The all Files Page gives access to all device files that are stored on your phone. This can be used to access device files even when the device is not connected. It can be accessed by pressing the button with the open folder icon on the bottom bar.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth} source={require('../../../../screenShots/AllFilesPage/AllFilesPage.png')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>Files are separated first by the device that created it, and then by type. Devices are displayed in order of creation, with the newest at the top of the list. To select a new device, press on the select box at the top of the page and then the desired device.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/LocalFilesPage/LocalFilesPageLocal.jpg')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>Each file is represented by a Files Widget. The widget displays the file name and has buttons to export and delete the file.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/LocalFilesPage/LocalFilesPageTrek.jpg')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>After pressing the export button, the share menu will be opened. The share menu will give you a variety of options to export the file. Select the one best suited to your needs.</Text>
                <View style={{height: separatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/LocalFilesPage/LocalFilesShare.jpg')} />
                </View>

                <View style={{height: separatorHeight}} />
                <Text style={styles.contentText}>To delete a file, press the garbage can icon on the file widget. The file will then be deleted and the files list will update.</Text>
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
});

export default AllFilesPageDescription;