import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Title from '../components/Title';
import EndActivities from '../components/EndScreenComponents/EndActivities';

const EndScreen = () => {
  return (
    <View style={styles.container}>
      <Title name="Geçmiş Etkinlikler" />
      <EndActivities />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#2E2E2E',
    padding: 20,
  },
});

export default EndScreen;
