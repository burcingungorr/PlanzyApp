import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const snapshot = await firestore()
      .collection('notifications')
      .orderBy('sentAt', 'desc')
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNotifications(data);

    const unread = data.filter(n => !n.isRead).length;
    setUnreadCount(unread);
    setLoading(false);
  };

  const markAsRead = async notificationId => {
    await firestore()
      .collection('notifications')
      .doc(notificationId)
      .update({ isRead: true });

    fetchNotifications();
  };

  const deleteNotification = async notificationId => {
    await firestore().collection('notifications').doc(notificationId).delete();

    fetchNotifications();
  };

  const confirmDeleteNotification = notificationId => {
    Alert.alert(
      'Bildirim Sil',
      'Bu bildirimi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteNotification(notificationId),
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unread]}
      onPress={() => markAsRead(item.id)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      {!item.isRead && <Text style={styles.badge}>Yeni</Text>}

      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="black"
          onPress={() => confirmDeleteNotification(item.id)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <Text style={styles.unreadText}>{unreadCount} Yeni Bildirim!</Text>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Hiç bildirimin yok.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  unreadText: {
    fontSize: 16,
    marginBottom: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  unread: {
    backgroundColor: '#fff9c4',
    borderColor: '#fbc02d',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#333',
  },
  badge: {
    marginTop: 6,
    color: 'black',
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export default NotificationScreen;
