import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FollowRequest = () => {
  const [requests, setRequests] = useState([]);
  const user = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('friendsrequest')
      .where('status', '==', 'pending')
      .onSnapshot(async snapshot => {
        const data = await Promise.all(
          snapshot.docs.map(async doc => {
            const friendRequestData = doc.data();
            const senderId = friendRequestData.senderId;

            const senderDoc = await firestore()
              .collection('users')
              .doc(senderId)
              .get();
            const senderData = senderDoc.exists ? senderDoc.data() : {};

            return {
              id: doc.id,
              senderName:
                senderData.name || friendRequestData.senderName || 'Bilinmeyen',
              senderAvatar:
                senderData.avatar || friendRequestData.senderAvatar || null,
              senderId: senderId,
              status: friendRequestData.status,
            };
          }),
        );
        setRequests(data);
      });

    return () => unsubscribe();
  }, []);

  const accept = async item => {
    const batch = firestore().batch();

    const requestRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('friendsrequest')
      .doc(item.id);
    batch.update(requestRef, { status: 'accepted' });

    const myFriendRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('friends')
      .doc(item.senderId);
    batch.set(myFriendRef, {
      name: item.senderName,
      avatar: item.senderAvatar,
      id: item.senderId,
    });

    const senderFriendRef = firestore()
      .collection('users')
      .doc(item.senderId)
      .collection('friends')
      .doc(user.uid);

    const currentUserDoc = await firestore()
      .collection('users')
      .doc(user.uid)
      .get();
    const currentUserData = currentUserDoc.exists ? currentUserDoc.data() : {};

    batch.set(senderFriendRef, {
      name: currentUserData.name || 'Bilinmeyen',
      avatar: currentUserData.avatar || null,
      id: user.uid,
    });

    await batch.commit();
  };

  const reject = async itemId => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('friendsrequest')
      .doc(itemId)
      .delete();

    console.log('İstek reddedildi');
  };

  const render = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {item.senderAvatar ? (
          <Image
            source={{ uri: item.senderAvatar }}
            style={styles.avatarImage}
          />
        ) : (
          <Icon name="account-circle" size={45} color="white" />
        )}
        <Text style={styles.text}>
          {item.senderName} size arkadaşlık isteği gönderdi.
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => accept(item)} style={styles.button}>
          <Text style={styles.buttonText}>Kabul Et</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reject(item.id)} style={styles.button}>
          <Text style={styles.buttonText}>Reddet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={requests}
      renderItem={render}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#444',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#888',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
  },
});

export default FollowRequest;
