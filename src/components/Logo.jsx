import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Logo = () => {
  const logo = require('../assets/logo.png');

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>PLANZY</Text>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 45,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#00897B',
  },
});
