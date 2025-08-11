import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivityLocation = ({ value, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name="map-marker-check"
        size={24}
        color="#00897B"
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Açık adres girin"
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    height: 50,
    borderColor: '#00897B',
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

export default ActivityLocation;
