import React, { FC, useEffect, useState } from "react";
import { DeviceId } from "../../redux/slices/deviceSlice";
import { ScrollView, StyleSheet, View } from "react-native";
import PageNav from "./Components/PageNav";
import ParameterOverviewPage from "./ParameterOverviewPage/ParameterOverviewPage";
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import ParameterView from "./ParameterView";
import AddDevicesView from "./AddDevicesView";
import ParameterDescriptions from "../../Constants/Parameters/ParameterDefs";

interface HomePageProps {
    deviceKey: DeviceId;
    pageHeight: number;
}

const HomePage: FC<HomePageProps> = React.memo(({deviceKey, pageHeight}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const parameterNames = useSelector((state: RootState) => (state.deviceDataSlice.deviceData[deviceKey] || {}).parameterNames) || [];
    
    useEffect(() => {
        return () => {
            setPageIndex(0);
        }
    }, [deviceKey]);

    // const parametersWithDescriptions = parameterNames.filter((paramName: string) => ParameterDescriptions[paramName] != undefined);
    const parametersWithDescriptions = parameterNames;

    // Move onto the next page
    const incrementPageIndex = () => {
        setPageIndex(pageIndex + 1 <= parametersWithDescriptions.length ? pageIndex + 1 : 0);
    }
    // Move to the previous page
    const decrementPageIndex = () => {
        setPageIndex(pageIndex - 1 >= 0 ? pageIndex - 1 : parametersWithDescriptions.length);
    }
    // Jump to the page for the selected parameter
    const onPressParameter = (parameterName: string) => {
        let i = 0;
        for (; i < parametersWithDescriptions.length; i++) {
            if (parameterName == parametersWithDescriptions[i]) {
                setPageIndex(i + 1);
                return;
            }
        }
    }

    const renderSelectedPage = () => {
        // If the selected device is the default device, show the add devices view
        if (deviceKey == 'Default') {
            return (
                <View style={styles.pageContainer}>
                    <AddDevicesView />
                </View>
            );
        } else {
            // console.log('Rendering selected page: ', pageIndex);
            if (pageIndex == 0) {
                return (
                    <View style={styles.pageContainer}>
                        <ParameterOverviewPage deviceKey={deviceKey} parameterNames={parameterNames} onPressParameter={onPressParameter} pageHeight={pageHeight} />
                    </View>
                );
            } else {
                // console.log('Selected parameter: ', parametersWithDescriptions[pageIndex - 1]);
                return (
                    <ScrollView style={styles.pageContainer}>
                        <ParameterView parameterName={parametersWithDescriptions[pageIndex - 1]} deviceKey={deviceKey} />
                    </ScrollView>
                );
            }
        }
    }

    return (
        <View style={styles.container}>
            {
                renderSelectedPage()
            }
            <View style={{height: '10%'}}>
                <PageNav currentIndex={pageIndex + 1} numberOfPages={parametersWithDescriptions.length + 1} onLeftClicked={decrementPageIndex} onRightClicked={incrementPageIndex} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
    },

    pageContainer: {
        width: '100%',
        height: '90%',
    },
})

export default HomePage;