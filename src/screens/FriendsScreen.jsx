import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserFriends from '../components/FriendsScreenComponents/UserFriends';
import FollowRequest from '../components/FriendsScreenComponents/FollowRequest';
import SearchUser from '../components/FriendsScreenComponents/SearchUser';

const FriendsScreen = () => {
  const [selectedTab, setSelectedTab] = useState('userfriend');

  const renderContent = () => {
    switch (selectedTab) {
      case 'userfriend':
        return <UserFriends />;
      case 'followrequest':
        return <FollowRequest />;
      case 'searchuser':
        return <SearchUser />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'userfriend' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('userfriend')}
        >
          <Icon
            name="account-supervisor"
            size={28}
            color={selectedTab === 'userfriend' ? 'white' : 'white'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'userfriend' && styles.tabTextActive,
            ]}
          >
            Arkadaşlar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'followrequest' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('followrequest')}
        >
          <Icon
            name="account-plus"
            size={28}
            color={selectedTab === 'followrequest' ? 'white' : 'white'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'followrequest' && styles.tabTextActive,
            ]}
          >
            İstekler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'searchuser' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('searchuser')}
        >
          <Icon
            name="account-search-outline"
            size={28}
            color={selectedTab === 'searchuser' ? 'white' : 'white'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'searchuser' && styles.tabTextActive,
            ]}
          >
            Ara
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    width: 94,
    borderColor: 'white',
  },
  tabText: {
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
  },
  tabTextActive: {
    color: 'white',
  },
  contentContainer: {
    flex: 1,
  },
});
