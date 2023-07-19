import { Icon } from '@rneui/base';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface PageNavProps {
    currentIndex: number;
    numberOfPages: number;
    onLeftClicked: (() => void) | undefined;
    onRightClicked: (() => void) | undefined;
}

const PageNav: FC<PageNavProps> = ({currentIndex, numberOfPages, onLeftClicked, onRightClicked}) => {
    return (
        <View style={styles.pageNavContainer}>
            <Icon style={styles.pageNavIcon} type="font-awesome" name="angle-left" onPress={() => {
                if (onLeftClicked) {
                    onLeftClicked();
                }
            }} />
            <Text style={styles.pageNavText}>{currentIndex} / {numberOfPages}</Text>
            <Icon style={styles.pageNavIcon} type="font-awesome" name="angle-right" onPress={() => {
                if (onRightClicked) {
                    onRightClicked();
                }
            }} />
        </View>
    );
}

const styles = StyleSheet.create({
    pageNavContainer: {
        // flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '10%',
        borderTopWidth: 1,

        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    pageNavText: {
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '100%',
        color: 'black',
    },
    pageNavIcon: {
        height: '100%',
        // width: '30%',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
});

export default PageNav;