import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const SearchUser = () => {
  const navigation = useNavigation();

  const currentUserId = useSelector(state => state.user.userInfo.id);
  const currentName = useSelector(state => state.user.userInfo.fullName);
  const currentAvatar = useSelector(state => state.user.userInfo.avatar);

  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [friendStatus, setFriendStatus] = useState({});

  useEffect(() => {
    const unsubscribeUsers = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const fetchedUsers = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.id !== currentUserId);
        setUsers(fetchedUsers);
      });

    const unsubscribeFriends = firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('friends')
      .onSnapshot(snapshot => {
        const friendMap = {};
        snapshot.forEach(doc => {
          friendMap[doc.id] = 'friend';
        });
        setFriendStatus(prev => ({ ...prev, ...friendMap }));
      });

    return () => {
      unsubscribeUsers();
      unsubscribeFriends();
    };
  }, []);

  const sendFriendRequest = async targetUser => {
    const requestData = {
      senderId: currentUserId,
      senderName: currentName,
      senderAvatar: currentAvatar || '',
      status: 'pending',
      sentAt: firestore.FieldValue.serverTimestamp(),
    };

    await firestore()
      .collection('users')
      .doc(targetUser.id)
      .collection('friendsrequest')
      .doc(currentUserId)
      .set(requestData);
    setFriendStatus(prev => ({ ...prev, [targetUser.id]: 'pending' }));
    Alert.alert('İstek Gönderildi', 'Arkadaşlık isteği gönderildi.');
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Kullanıcı ara..."
        placeholderTextColor="#aaa"
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const status = friendStatus[item.id] || 'none';

          return (
            <TouchableOpacity style={styles.userCard}>
              <View style={styles.leftSection}>
                <TouchableOpacity
                  onPress={() => sendFriendRequest(item)}
                  disabled={status !== 'none'}
                  style={{ padding: 6 }}
                >
                  <Icon
                    name={
                      status === 'friend' || status === 'pending'
                        ? 'account-check'
                        : 'account-plus'
                    }
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>

                {item.avatar ? (
                  <Image
                    source={{ uri: item.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Icon
                    name="account-circle"
                    size={45}
                    color="white"
                    style={styles.avatarIcon}
                  />
                )}

                <Text style={styles.name}>{item.fullName}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: 'white',
    margin: 10,
    borderWidth: 2,
    borderColor: 'white',
    height: 50,
  },
  listContainer: {
    paddingBottom: 16,
    paddingHorizontal: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginLeft: 12,
    marginRight: 12,
  },
  avatarIcon: {
    marginLeft: 12,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SearchUser;
