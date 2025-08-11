import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const data = [
  { label: 'Yemek', value: 'Yemek' },
  { label: 'Moda', value: 'Moda' },
  { label: 'Sosyal', value: 'Sosyal' },
  { label: 'Spor', value: 'Spor' },
  { label: 'Kariyer', value: 'Kariyer' },
  { label: 'Günlük Yaşam', value: 'Günlük yaşam' },
];

const ActivityCategory = ({ value, onChange }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#00897B' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Bir kategori seç' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <MaterialCommunityIcons
            name="shape-outline"
            size={22}
            color={isFocus ? '#00897B' : '#00897B'}
            style={{ marginRight: 10 }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    marginTop: 20,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#00897B',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default ActivityCategory;
