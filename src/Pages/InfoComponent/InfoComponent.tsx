import React, { FC, useState, } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text, ScrollView, Image, } from 'react-native';
import PageNav from '../HomePage/Components/PageNav';
import WelcomePage from './InfoPages/Page1_Welcome';
import HomePageDescription from './InfoPages/Page2_HomePage';
import ParameterViewDescription from './InfoPages/Page3_ParameterPage';
import AllFilesPageDescription from './InfoPages/Page4_AllFilesPage';
import AddDevicesDescription from './InfoPages/Page5_AddDevicesPage';
import SettingsDescription from './InfoPages/Page6_Settings';
import TreksDescriptionPage from './InfoPages/Page7_TreksPage';
import EndPage from './InfoPages/Page8_EndPage';
import Info_LocalFilesPage from './InfoPages/Info_LocalFilesPage';

interface InfoComponentProps {
    finishCallback: () => void;
}

const InfoComponent: FC<InfoComponentProps> = React.memo(({finishCallback,}) => {
    const [pageIndex, setPageIndex] = useState<number>(0);
    const numberOfPages = 9;

    const renderPage = () => {
        switch (pageIndex) {
            case 0:
                return (
                    <WelcomePage jumpToPage={setPageIndex} />
                );

            case 1:
                return (
                    <HomePageDescription />
                );

            case 2:
                return (
                    <ParameterViewDescription />
                );

            case 3:
                return (
                    <AllFilesPageDescription />
                );

            case 4:
                return (
                    <Info_LocalFilesPage />
                );

            case 5:
                return (
                    <AddDevicesDescription />
                );

            case 6:
                return (
                    <SettingsDescription />
                );

            case 7:
                return (
                    <TreksDescriptionPage />
                );

            case 8:
                return (
                    <EndPage onCloseClicked={finishCallback} />
                );

            default: 
                return (
                    <></>
                )
        }
    }

    const moveBack = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    }

    const moveToNextPage = () => {
        if (pageIndex + 1 < numberOfPages) {
            setPageIndex(pageIndex + 1);
        }
    }

    return (
        <Modal style={styles.container} visible={true}>
            <View style={styles.container}>
                {/* Content container */}
                <View style={styles.contentContainer}>
                    {
                        renderPage()
                    }
                </View>

                {/* Navigation container */}
                <View style={styles.navContainer}>
                    <PageNav currentIndex={pageIndex + 1} numberOfPages={numberOfPages} onLeftClicked={moveBack} onRightClicked={moveToNextPage} />
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,

        backgroundColor: '#efefef'
    },

    imageContainer: {
        width: '100%',
        height: '100%',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    titleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },
    contentText: {
        fontSize: 18,
        color: 'black',
        width: '100%',
        textAlign: 'center',
        flex: 1,
        backgroundColor: 'white',
        alignSelf: 'stretch',
    },

    contentContainer: {
        height: '90%',
        width: '100%',
    },
    navContainer: {
        height: '10%',
        width: '100%',
        borderTopWidth: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
});

export default InfoComponent;