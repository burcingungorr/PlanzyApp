import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Title from '../components/Title';
import UserProfil from '../components/ProfileScreenComponents/UserProfil';
import Username from '../components/ProfileScreenComponents/Username';
import FriendsScreen from './FriendsScreen';
import ActivitiesHistoryScreen from './ActivitiesHistoryScreen';
import NotificationScreen from './NotificationScreen';
import LogoutButton from '../components/ProfileScreenComponents/LogOut';

const ProfileScreen = () => {
  const [activeComponent, setActiveComponent] = React.useState('Activities');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Friends':
        return <FriendsScreen />;
      case 'Activities':
        return <ActivitiesHistoryScreen />;
      case 'Notifications':
        return <NotificationScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Title name="Profil" />
      <LogoutButton />
      <UserProfil />
      <Username />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            activeComponent === 'Friends' && styles.buttonActive,
          ]}
          onPress={() => setActiveComponent('Friends')}
        >
          <Text
            style={[
              styles.buttonText,
              activeComponent === 'Friends' && styles.buttonTextActive,
            ]}
          >
            Arkadaşlar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeComponent === 'Activities' && styles.buttonActive,
          ]}
          onPress={() => setActiveComponent('Activities')}
        >
          <Text
            style={[
              styles.buttonText,
              activeComponent === 'Activities' && styles.buttonTextActive,
            ]}
          >
            Etkinlikler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeComponent === 'Notifications' && styles.buttonActive,
          ]}
          onPress={() => setActiveComponent('Notifications')}
        >
          <Text
            style={[
              styles.buttonText,
              activeComponent === 'Notifications' && styles.buttonTextActive,
            ]}
          >
            Bildirimler
          </Text>
        </TouchableOpacity>
      </View>

      {renderComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 5,
  },
  button: {
    backgroundColor: '#00897B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonActive: {
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextActive: {
    color: 'white',
  },
});

export default ProfileScreen;
