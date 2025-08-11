import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Title = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    margin: 15,
  },
});
