import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { clearUserInfo } from '../../redux/slices/usernameSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await auth().signOut();
    dispatch(clearUserInfo());
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logout}>
      <MaterialCommunityIcons name="logout" size={28} color="white" />
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  logout: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});
