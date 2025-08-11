import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivityDescription = ({ value, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name="pencil"
        size={24}
        color="#00897B"
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Açıklama girin"
        style={styles.input}
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    minHeight: 100,
    borderColor: '#00897B',
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingTop: 10,
  },
});

export default ActivityDescription;
