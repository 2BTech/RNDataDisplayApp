import { FC } from "react";
import { SettingObj } from "../../../redux/slices/deviceSettingsSlice";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Dropdown from "../../Components/Dropdown/Dropdown";

interface OptionsSettingComponentProps {
    setting: SettingObj;
    level: number;
    onChangeValue: ((setting: SettingObj) => void);
}

const OptionsSettingComponent: FC<OptionsSettingComponentProps> = ({setting, level, onChangeValue}) => {
    return (
        <View style={StyleSheet.compose(styles.container, {marginLeft: level * 10})}>
            <Text style={styles.descriptionText}>{setting.description}</Text>
            <View style={styles.dropdownContainer}>
            <Dropdown 
                    defaultLabel={setting.description}
                    data={[]}
                    onSelect={() => console.log('Selected')}
                />
            </View>
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

    valueText: {
        fontSize: 20,
        color: 'black',
    },

    dropdownContainer: {
        width: 120
    },
});

export default OptionsSettingComponent;