import React, { FC, useState, } from "react";
import { SettingObj } from "../../../redux/slices/deviceSettingsSlice";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import OpenSettingComponent from "./OpenSettingComponent";
import ToggleSettingComponent from "./ToggleSettingComponent";
import ValueSettingComponent from "./ValueSettingComponent";
import { ChangedSettingsMap } from "../SettingsPage";

export type ExpandedMap = {
    [key: string]: boolean;
}

interface MenuSettingsProps {
    setting: SettingObj;
    level: number;
    onChangeValue: ((setting: SettingObj) => void);
    expandedMap: ExpandedMap;
    updateExpandedMap: ((updatedMap: ExpandedMap) => void);
    changedSettings: ChangedSettingsMap;
}

const MenuSettingsComponent: FC<MenuSettingsProps> = ({setting, level, onChangeValue, expandedMap, updateExpandedMap, changedSettings}) => {

    const isExpanded: boolean = expandedMap[setting.description];

    // console.log('Expanded map: ', expandedMap);

    return (
        <View>
            <TouchableOpacity style={StyleSheet.compose(styles.container, {marginLeft: level * 10})} onPress={() => updateExpandedMap({
                ...expandedMap,
                [setting.description]: !isExpanded,
            })}>
                <Text style={styles.descriptionText}>{setting.description}</Text>
                <Icon style={styles.icon} type="font-awesome" name={isExpanded ? 'chevron-up' : 'chevron-down'} />
            </TouchableOpacity>
            {
                isExpanded && setting.items?.map(subSetting => {
                    switch (subSetting.type) {
                        case 'value':
                            return <ValueSettingComponent key={subSetting.description} setting={changedSettings[subSetting.description] || subSetting} level={level+1} onChangeValue={onChangeValue} />
            
                        case 'open':
                            return <OpenSettingComponent key={subSetting.description} setting={changedSettings[subSetting.description] || subSetting} level={level+1} onChangeValue={onChangeValue} />
                        
                        case 'toggle':
                            return <ToggleSettingComponent key={subSetting.description} setting={changedSettings[subSetting.description] || subSetting} level={level+1} onChangeValue={onChangeValue} />
            
                        case 'options':
                            return <OpenSettingComponent key={subSetting.description} setting={changedSettings[subSetting.description] || subSetting} level={level+1} onChangeValue={onChangeValue} />
            
                        case 'menu':
                            return <MenuSettingsComponent key={subSetting.description} setting={changedSettings[subSetting.description] || subSetting} level={level+1} onChangeValue={onChangeValue} expandedMap={expandedMap} updateExpandedMap={updateExpandedMap} changedSettings={changedSettings} />
            
                        default:
                            console.log('Unhandled sub setting type: ', subSetting.type);
                            return <View key={subSetting.description} />
                    }
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderBottomWidth:1,
        borderStyle:"solid",
        borderColor: 'gray',
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingTop:15,
        marginRight: 10,
    },

    descriptionText: {
        fontSize: 20,
        color: 'black',
    },

    icon: {
        marginRight: 10,
        borderLeftWidth: 1,
        paddingLeft: '5%',
      },
});

export default MenuSettingsComponent;