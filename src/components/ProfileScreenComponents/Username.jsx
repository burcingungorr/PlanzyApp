import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const Username = () => {
  const username = useSelector(state => state.user.userInfo.fullName);

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Username;
