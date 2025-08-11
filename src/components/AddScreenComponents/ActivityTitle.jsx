import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const capitalizeFirstLetter = text => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const ActivityTitle = ({ value, onChange }) => {
  const handleChange = text => {
    onChange(capitalizeFirstLetter(text));
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="text-box"
        size={24}
        color="#00897B"
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder="Başlık girin"
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginTop: 20,
    borderColor: '#00897B',
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});

export default ActivityTitle;
