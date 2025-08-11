import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Title from '../components/Title';
import GeoLocationMap from '../components/MapScreenComponents/GeoLocation';

const Map = () => {
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Title name="Harita" />
      </View>

      <GeoLocationMap />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#2E2E2E',
    paddingTop: 20,
  },
});

export default Map;
