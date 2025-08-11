import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const UserFriends = () => {
  const currentUid = useSelector(state => state.user.userInfo.id);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUid)
      .collection('friends')
      .onSnapshot(async snapshot => {
        const friendPromises = snapshot.docs.map(async doc => {
          const friendData = doc.data();

          if (!friendData.avatar || !friendData.fullName) {
            const userDoc = await firestore()
              .collection('users')
              .doc(doc.id)
              .get();

            if (userDoc.exists) {
              const userData = userDoc.data();
              return {
                id: doc.id,
                ...friendData,
                avatar: userData.avatar || friendData.avatar,
                fullName:
                  userData.fullName || friendData.name || friendData.fullName,
              };
            }
          }

          return {
            id: doc.id,
            ...friendData,
            fullName: friendData.fullName || friendData.name,
          };
        });

        const friendsList = await Promise.all(friendPromises);
        setFriends(friendsList);
      });

    return unsubscribe;
  }, [currentUid]);

  const handleDelete = friendId => {
    Alert.alert('Arkadaşı Sil', 'Emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await firestore()
            .collection('users')
            .doc(currentUid)
            .collection('friends')
            .doc(friendId)
            .delete();

          await firestore()
            .collection('users')
            .doc(friendId)
            .collection('friends')
            .doc(currentUid)
            .delete();

          setFriends(prev => prev.filter(f => f.id !== friendId));
        },
      },
    ]);
  };

  const render = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.leftSection}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
          ) : (
            <Icon
              name="account-circle"
              size={45}
              color="white"
              style={styles.avatarIcon}
            />
          )}
          <Text style={styles.name}>
            {item.fullName || item.name || 'İsimsiz Kullanıcı'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="trash-can-outline" size={24} color="#00897B" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={friends}
      keyExtractor={item => item.id}
      renderItem={render}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Henüz arkadaşınız yok.</Text>
      }
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#aaa',
    padding: 10,
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
    flexShrink: 1,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 50,
    textAlign: 'center',
  },
});

export default UserFriends;
