import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Add');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    top: 32,
    right: 25,
  },
  button: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#00897B',
  },
});

export default AddButton;
