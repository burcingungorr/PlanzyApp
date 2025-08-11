import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EndScreen from '../screens/EndScreen';
import MapScreen from '../screens/MapScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import EndDetail from '../screens/EndDetail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
    <Stack.Screen name="Add" component={AddScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HistoryMain" component={EndScreen} />
    <Stack.Screen name="End" component={EndDetail} />
  </Stack.Navigator>
);

import { useSelector } from 'react-redux';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const AppNavigator = () => {
  const userInfo = useSelector(state => state.user.userInfo);

  return (
    <NavigationContainer>
      {userInfo ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: '#2E2E2E' },

            tabBarIcon: ({ color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'History':
                  iconName = 'history';
                  break;
                case 'Map':
                  iconName = 'map-marker-radius';
                  break;
                case 'Profile':
                  iconName = 'account-circle';
                  break;
                default:
                  iconName = 'circle';
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  color={color}
                  size={30}
                />
              );
            },
            tabBarActiveTintColor: '#00897B',
            tabBarInactiveTintColor: 'white',
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="History" component={HistoryStack} />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
