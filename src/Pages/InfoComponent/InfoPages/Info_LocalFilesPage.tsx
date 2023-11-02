import React, { FC, } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Image from '../../Components/react-native-scalable-image';
import BulletPoint from "../../Components/bulletPoint";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFolder, } from '@fortawesome/free-solid-svg-icons';

interface Info_LocalFilesPageProps {

}

const Info_LocalFilesPage: FC<Info_LocalFilesPageProps> = React.memo(({}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%'}}>
            <View style={{height: '15%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: seperatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesomeIcon icon={faFolder} size={35} />
                        <Text style={styles.titleText}>Local Files Page</Text>
                    </View>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <ScrollView style={{width: '100%', height: '85%'}} showsVerticalScrollIndicator={false}>
                <View style={{height: seperatorHeight}} />
                <Text style={styles.contentText}>The Local Files Page provides access to all files pertaining to the selected device. It can be accessed by pressing the button with the closed folder icon on the bottom bar.</Text>
                <View style={{height: seperatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth} source={require('../../../../screenShots/AllFilesPage/AllFilesPage.png')} />
                </View>

                <View style={{height: seperatorHeight}} />
                <Text style={styles.contentText}>The page divides the files into two or three sections depending on the connection type of the device. For beacon devices, there are options for Local and Trek. For direct connect devices, there is an additional option for remote files. Local files are files created by the phone that contains all of the received data from the device. The Remote files section contains files that are present on the connected device. The Trek files section contains the kml files created when generating a Trek.</Text>
                <View style={{height: seperatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/AllFilesPage/SelectDevice.png')} />
                </View>

                <View style={{height: seperatorHeight}} />
                <Text style={styles.contentText}>Each file is represented by a Files Widget. The widget displays the file name and has buttons to export, delete, and sometimes download the file. The download option is only available under the Remote files section.</Text>
                <View style={{height: seperatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/AllFilesPage/FilesButton.png')} />
                </View>

                <View style={{height: seperatorHeight}} />
                <Text style={styles.contentText}>After pressing the export button, the share menu will be opened. The share menu will give you a variety of options to export the file. Select the one best suited to your needs.</Text>
                <View style={{height: seperatorHeight / 2}} />

                <View style={{flex: 1, width: '100%', alignItems: 'center',}}>
                    <Image width={picWidth * (4/3)} source={require('../../../../screenShots/AllFilesPage/ShareMenu.png')} />
                </View>

                <View style={{height: seperatorHeight}} />
                <Text style={styles.contentText}>To delete a file, press the garbage can icon on the file widget. The file will then be deleted and the files list will update.</Text>
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
});

export default Info_LocalFilesPage;