import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Icon } from "@rneui/base";
import React, { FC, ReactElement, useEffect, useRef, useState, } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Modal, Dimensions, } from "react-native";
import { faChevronUp, faChevronDown, } from "@fortawesome/free-solid-svg-icons";

export interface DropdownItem {
    label: string;
    value: (string | number);
}

interface DropdownItemComponentProps {
    // The item to be rendered
    item: DropdownItem;
    // The callback to handle a click
    onSelectItem: () => void;
    // Is the value currently displayed, adds a background color
    isSelected: boolean;
}

export interface DropdownV2Props {
    options: DropdownItem[];
    currentVal: DropdownItem;
    onSelectItem: (undefined | ((item: DropdownItem) => void));
    itemStartHeight: number;
}

const DropdownItemComponent: FC<DropdownItemComponentProps> = ({item, onSelectItem, isSelected}) => {
    return (
        <TouchableOpacity style={isSelected ? StyleSheet.compose(dropdownItemStyles.item, {backgroundColor: '#c0e6f0'}) : dropdownItemStyles.item} onPress={onSelectItem}>
            <Text style={dropdownItemStyles.dropDownText}>{item.label}</Text>
        </TouchableOpacity>
    );
}

const Dropdown: FC<DropdownV2Props> = ({options, currentVal, onSelectItem, itemStartHeight}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [objectY, setObjY] = useState<number>(0);

    const ref = useRef<TouchableOpacity>(null);

    useEffect(() => {
        if (ref != undefined) {
            ref.current?.measure((x, y, width, height, pageX, pageY) => {
                let bottom = height + pageY;
                if (objectY != bottom) {
                    setObjY(bottom);
                }
            });
        }
    }, [ref, objectY]);
    
    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    const renderDropdown = (): ReactElement<any, any> => {
        return (
            <Modal visible={isExpanded} transparent animationType="none">
                <TouchableOpacity
                    style={dropdownStyles.overlayContainer}
                    onPress={() => setIsExpanded(false)}>
                        <View style={[dropdownItemStyles.container, {top: objectY}]}>
                            <FlatList 
                                data={options}
                                renderItem={item => <DropdownItemComponent item={item.item} onSelectItem={() => {
                                    toggleIsExpanded();
                                    if (onSelectItem) {
                                        onSelectItem(item.item);
                                    }
                                }} isSelected={currentVal.value == item.item.value} />}
                                keyExtractor={(item, index) => index.toString() + ',' + item.label + ',' + item.value}
                                />
                        </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    console.log('Selected item: ', currentVal.label);

    return (
        <TouchableOpacity style={dropdownStyles.container} onPress={toggleIsExpanded} ref={ref} onLayout={result => {
            const { x, y, width, height, } = result.nativeEvent.layout;
            if ((y + height) != objectY) {
                setObjY(height + y);
            }
            // console.log('ObjY: ', height, ' Y: ', y, ' Height: ', height);
        }}>
            {renderDropdown()}
            <Text adjustsFontSizeToFit={true} style={dropdownStyles.dropdownText}>{currentVal.label}</Text>
            <FontAwesomeIcon style={dropdownStyles.icon} icon={isExpanded ? faChevronUp : faChevronDown} />
        </TouchableOpacity>
    );
}

const dropdownStyles = StyleSheet.create({
    container: {
        width: '94%',
        height: '80%',

        marginVertical: '2%',
        marginHorizontal: '3%',

        borderWidth: 2,
        borderColor: 'black',

        backgroundColor: '#efefef',

        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 20,

        flex: 1,
    },
    icon: {
        marginRight: 10,
        borderLeftWidth: 1,
        paddingLeft: '5%',
    },

    overlayContainer: {
        width: '100%',
        height: '100%',
    },
});

const dropdownItemStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
    },

    item: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    dropDownText: {
        color: 'black',
    }
});

export default Dropdown;