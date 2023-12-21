import React, { FC } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export interface PageNavProps {
    currentIndex: number;
    numberOfPages: number;
    onLeftClicked: (() => void) | undefined;
    onRightClicked: (() => void) | undefined;
}

const PageNav: FC<PageNavProps> = React.memo(({currentIndex, numberOfPages, onLeftClicked, onRightClicked}) => {
    return (
        <View style={styles.pageNavContainer}>
            <TouchableOpacity style={styles.pageNavIcon} onPress={() => {
                if (onLeftClicked) {
                    onLeftClicked();
                }
            }}>
                <FontAwesomeIcon icon={faAngleLeft} size={25} />
            </TouchableOpacity>

            <View>
                <View style={{ height: '33%' }} />
                <Text style={styles.pageNavText}>{currentIndex} / {numberOfPages}</Text>
            </View>
            <TouchableOpacity style={styles.pageNavIcon} onPress={() => {
                if (onRightClicked) {
                    onRightClicked();
                }
            }}>
                <FontAwesomeIcon icon={faAngleRight} size={25} />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    pageNavContainer: {
        // flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        borderTopWidth: 1,

        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    pageNavText: {
        fontSize: 20,
        textAlign: 'center',
        // textAlignVertical: 'center',
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