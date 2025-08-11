import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const SendButton = ({ onPress, disabled }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.text}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  button: {
    backgroundColor: '#00897B',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SendButton;
