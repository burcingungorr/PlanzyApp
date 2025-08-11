import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ilList from '../../data/il.json';

const Filter = ({ onSelectCity }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const cities = useMemo(() => {
    return ilList[0].data.map(il => ({
      label: il.name,
      value: il.id,
    }));
  }, []);

  useEffect(() => {
    onSelectCity(value);
  }, [value]);

  const renderItem = item => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );

  const renderRightIcon = () => {
    if (!value) return null;
    return (
      <TouchableOpacity onPress={() => setValue(null)}>
        <MaterialCommunityIcons name="close-circle" size={20} color="#00897B" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Dropdown
        data={cities}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Bir şehir seç' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderItem={renderItem}
        renderRightIcon={renderRightIcon}
        style={[styles.dropdown, isFocus && { borderColor: '#00897B' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
    position: 'relative',
  },
  dropdown: {
    height: 50,
    borderColor: '#00897B',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
});

export default Filter;
