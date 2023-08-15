import React, { FC } from 'react';
import { View, Text, StyleSheet, } from 'react-native';

interface BulletPointProps {
    onPress: (() => void);
    text: string;
}

const BulletPoint: FC<BulletPointProps> = React.memo(({onPress, text}) => {
    return (
        <View style={ styles.row }>
            <View style={ styles.bullet }>
                <Text style={styles.bulletPoint}>{'\u2022' + " "}</Text>
            </View>
            <View style={ styles.bulletText }>
                <Text style={styles.bulletText} onPress={onPress}>{text}</Text>
            </View>
        </View>
    );
})

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flex: 1,
        marginVertical: 4,
    },
    bullet: {
        width: 10,
        color: 'black',
    },
    bulletText: {
        flex: 1,
        color: 'blue',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
    bulletPoint: {
        fontSize: 18,
        color: 'black',
    },
});

export default BulletPoint;