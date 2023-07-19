import React, { FC, useState } from "react";
import { DeviceId } from "../../redux/slices/deviceSlice";
import { ScrollView, StyleSheet, View } from "react-native";
import PageNav from "./Components/PageNav";
import ParameterOverviewPage from "./ParameterOverviewPage/ParameterOverviewPage";
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import ParameterView from "./ParameterView";

interface HomePageProps {
    deviceKey: DeviceId;
    pageHeight: number;
}

const HomePage: FC<HomePageProps> = ({deviceKey, pageHeight}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const parameterNames = useSelector((state: RootState) => (state.deviceDataSlice.deviceData[deviceKey] || {}).parameterNames) || [];

    // Move onto the next page
    const incrementPageIndex = () => {
        setPageIndex(pageIndex + 1 <= parameterNames.length ? pageIndex + 1 : 0);
    }
    // Move to the previous page
    const decrementPageIndex = () => {
        setPageIndex(pageIndex - 1 >= 0 ? pageIndex - 1 : parameterNames.length);
    }
    // Jump to the page for the selected parameter
    const onPressParameter = (parameterName: string) => {
        let i = 0;
        for (; i < parameterNames.length; i++) {
            if (parameterName == parameterNames[i]) {
                setPageIndex(i + 1);
                return;
            }
        }
    }

    const renderSelectedPage = () => {
        if (pageIndex == 0) {
            return (
                <View style={styles.pageContainer}>
                    <ParameterOverviewPage deviceKey={deviceKey} parameterNames={parameterNames} onPressParameter={onPressParameter} pageHeight={pageHeight} />
                </View>
            );
        } else {
            return (
                <ScrollView style={styles.pageContainer}>
                    <ParameterView parameterName={parameterNames[pageIndex - 1]} deviceKey={deviceKey} />
                </ScrollView>
            );
        }
    }

    return (
        <View style={styles.container}>
            {
                renderSelectedPage()
            }
            <PageNav currentIndex={pageIndex} numberOfPages={parameterNames.length + 1} onLeftClicked={decrementPageIndex} onRightClicked={incrementPageIndex} />
        </View>
    );
}

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