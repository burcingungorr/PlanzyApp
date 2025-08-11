import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Limited = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const handleChange = text => {
    const numericText = text.replace(/[^0-9]/g, '');
    setInternalValue(numericText);
    if (onChange) {
      onChange(numericText);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons
          name="account-group"
          size={24}
          color="#00897B"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={internalValue}
          onChangeText={handleChange}
          placeholder="Katılım sayısı girin"
          maxLength={5}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00897B',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});

export default Limited;
