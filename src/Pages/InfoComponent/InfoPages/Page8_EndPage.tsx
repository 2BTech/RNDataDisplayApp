import React, { FC, } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, } from 'react-native';

interface EndPageProps {
    onCloseClicked: (() => void)
}

const EndPage: FC<EndPageProps> = React.memo(({onCloseClicked}) => {
    const seperatorHeight = Dimensions.get('window').height / 20;
    const picWidth = (Dimensions.get('window').width / 10) * 5;

    return (
        <View style={{width: '100%'}}>
            <View style={{height: '15%', backgroundColor: 'white', borderBottomWidth: 1}}>
                <View style={{height: seperatorHeight}} />
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.titleText}>2B Connect</Text>
                    </View>
                <View style={{height: seperatorHeight / 4}} />
            </View>

            <View style={{height: '85%'}}>
                <ScrollView style={{width: '100%', height: '100%'}} showsVerticalScrollIndicator={false}>
                    <View style={{height: seperatorHeight}} />
                    <Text style={styles.contentText}>Thank you for completing the tutorial. You can access the tutorial through the About Page.</Text>
                    <View style={{height: seperatorHeight / 2}} />

                    <View style={{width: '100%', alignItems: 'center',}}>
                        <TouchableOpacity style={StyleSheet.compose(styles.defaultButton, styles.button)} onPress={onCloseClicked}>
                            <Text style={StyleSheet.compose(styles.defaultTextStyle, styles.buttonText)}>Finish</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        width: '100%',
        textAlign: 'center',
    },

    sectionTitleText: {
        fontSize: 25,
        color: 'black',
        width: '100%',
        textAlign: 'center',
    },

    defaultTextStyle: {
        color: 'black',
        fontSize: 12,
    },

    defaultButton: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10, 
        marginRight: 10, 
        borderRadius: 10,
    },
    button: {
        borderColor: 'black',
        borderWidth: 1,

        marginTop: 10,
        marginBottom: 10,
        width: '33%',
        marginLeft: '5%',
        marginRight: '5%',

        // backgroundColor: '#d3d3d3',
        backgroundColor: '#055D9C',

        shadowColor: 'black',
        shadowOffset: { width: 2, height: 4},
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 10,

        borderBottomWidth: 2,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
});

export default EndPage;