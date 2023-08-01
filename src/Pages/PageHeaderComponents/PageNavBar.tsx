import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, Icon } from "@rneui/base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface NavButtonDef {
    title: string;
    icon: IconDefinition;
}

interface PageNavBarProps {
    buttons: NavButtonDef[];
    selectedPage: string;
    onSelectNewPage: ((name: string) => void);
};

const PageNavBar: FC<PageNavBarProps> = ({buttons, onSelectNewPage, selectedPage}) => {
    const buttonWidth: `${number}%` = `${((1.0 / buttons.length) * 100)}%`;
    // console.log('Rendering nav bar v2: ', Object.keys(props.buttons), ' Button width: ', buttonWidth);

    const onPressButton = (pageName: string) => {
        onSelectNewPage(pageName);
    }

    // console.log('Rendering nav bar 2')

    return (
        <View style={styles.container}>
            {
                buttons.map((val, i) => {
                    return (
                        <Button key={'NavBarButton' + i} type="outline" buttonStyle={val.title == selectedPage ? styles.selectedButton : styles.button} containerStyle={StyleSheet.compose(styles.buttonContainer, {width: buttonWidth})} onPress={() => onPressButton(val.title)}>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.sectionText}>{val.title}</Text>
                            <FontAwesomeIcon icon={val.icon} size={25} />
                        </Button>
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
    },
    buttonContainer: {
        height: '100%',
        borderRadius: 0,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    button: {
        height: '100%', 
        borderRadius: 0,
        flexDirection: 'column',
        borderColor: 'black',
        backgroundColor: '#efefef'
    },
    selectedButton: {
        height: '100%', 
        borderRadius: 0,
        flexDirection: 'column',
        borderColor: 'black',
        backgroundColor: 'lightblue',
    },
    sectionText: {
        color: 'black',
        flexShrink: 1,
        fontSize: 15,
    }
});

export default PageNavBar;