import React, { FC, LegacyRef, ReactElement, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";

export interface DropdownItem {
    label: string;
    value: any;
}

interface DropdownProps {
    defaultLabel: string;
    data: Array<DropdownItem>;
    onSelect: undefined | ((item: DropdownItem) => void);
}

const Dropdown: FC<DropdownProps> = ({defaultLabel, data, onSelect}) => {
    const DropdownButton = useRef<TouchableOpacity>(null);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<DropdownItem | undefined>(undefined);
    const [dropdownTop, setDropdownTop] = useState(0);

    const toggleDropdown = (): void => {
        visible ? setVisible(false) : openDropdown();
    };

  const openDropdown = (): void => {
    if (DropdownButton.current) {
      DropdownButton.current.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
        // console.log(_fx, _fy, _w, h, _px, py);
        setDropdownTop(h + 15);
      });
    }
    setVisible(true);
  };

  const onItemPress = (item: DropdownItem): void => {
    setSelected(item);
    if (onSelect) {
      onSelect(item);
    }
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={styles.dropDownText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={styles.buttonText}>
        {(!!selected && selected.label) || defaultLabel}
      </Text>
      <Icon style={styles.icon} type="font-awesome" name="chevron-down" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#efefef',
        height: '80%',
        width: '80%',
        zIndex: 1,
        margin: '2%',
        borderWidth: 2,
      },
      buttonText: {
        flex: 1,
        textAlign: 'center',
        color: 'black',
      },
      icon: {
        marginRight: 10,
        borderLeftWidth: 1,
        paddingLeft: '5%',
      },
      dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
      },
      overlay: {
        width: '100%',
        height: '100%',
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