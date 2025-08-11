import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ilList from '../../data/il.json';
import ilceList from '../../data/ilce.json';

const ActivityCity = ({ city, onCityChange, district, onDistrictChange }) => {
  const [focusCity, setFocusCity] = useState(false);
  const [focusDistrict, setFocusDistrict] = useState(false);

  const capitalizeFirstLetter = str => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const cityOptions = useMemo(() => {
    if (!ilList || ilList.length === 0 || !ilList[0].data) return [];
    return ilList[0].data.map(il => ({
      label: il.name,
      value: il.id,
    }));
  }, [ilList]);

  const selectedCityId = useMemo(() => {
    if (!city) return null;
    const foundCity = cityOptions.find(item => item.label === city);
    return foundCity ? foundCity.value : null;
  }, [city, cityOptions]);

  const districtOptions = useMemo(() => {
    if (
      !selectedCityId ||
      !ilceList ||
      ilceList.length === 0 ||
      !ilceList[0].data
    )
      return [];
    return ilceList[0].data
      .filter(ilce => ilce.il_id === selectedCityId)
      .map(ilce => ({
        label: capitalizeFirstLetter(ilce.name),
        value: ilce.id,
      }));
  }, [selectedCityId, ilceList]);

  const selectedDistrictId = useMemo(() => {
    if (!district) return null;
    const foundDistrict = districtOptions.find(item => item.label === district);
    return foundDistrict ? foundDistrict.value : null;
  }, [district, districtOptions]);

  return (
    <View style={styles.container}>
      <View style={styles.dropdownWrapper}>
        <Dropdown
          style={[styles.dropdown, focusCity && styles.focused]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={cityOptions}
          labelField="label"
          valueField="value"
          placeholder={!focusCity ? 'Şehir Seç' : '...'}
          value={selectedCityId}
          onFocus={() => setFocusCity(true)}
          onBlur={() => setFocusCity(false)}
          onChange={item => {
            onCityChange(item.label);
            onDistrictChange(null);
            setFocusCity(false);
          }}
          renderLeftIcon={() => (
            <MaterialCommunityIcons
              name="city-variant-outline"
              size={22}
              color="#00897B"
              style={{ marginRight: 10 }}
            />
          )}
        />
      </View>
      <View style={styles.dropdownWrapper}>
        <Dropdown
          style={[styles.dropdown, focusDistrict && styles.focused]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={districtOptions}
          labelField="label"
          valueField="value"
          placeholder={!focusDistrict ? 'İlçe Seç' : '...'}
          value={selectedDistrictId}
          onFocus={() => setFocusDistrict(true)}
          onBlur={() => setFocusDistrict(false)}
          onChange={item => {
            onDistrictChange(item.label);
            setFocusDistrict(false);
          }}
          renderLeftIcon={() => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={22}
              color="#00897B"
              style={{ marginRight: 10 }}
            />
          )}
          disabled={!city}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dropdownWrapper: {
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#00897B',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  focused: {
    borderColor: '#00897B',
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

export default ActivityCity;
