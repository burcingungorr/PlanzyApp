import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Button from '../components/ActivityDetailScreenComponents/Button';

const ActivityDetailScreen = ({ route, navigation }) => {
  const { activityId } = route.params;
  const currentUserId = auth().currentUser?.uid;

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState('');
  const [userLoading, setUserLoading] = useState(true);

  const [friendsIds, setFriendsIds] = useState([]);
  const [participantsIds, setParticipantsIds] = useState([]);
  const [friendParticipants, setFriendParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const doc = await firestore()
          .collection('activities')
          .doc(activityId)
          .get();

        if (doc.exists) {
          const data = doc.data();
          setActivity(data);

          const userId = data.userId;
          if (userId) {
            setUserLoading(true);
            const userDoc = await firestore()
              .collection('users')
              .doc(userId)
              .get();

            if (userDoc.exists) {
              const userData = userDoc.data();
              setUserName(userData.fullName || userData.name || 'İsim yok');
            } else {
              setUserName('Kullanıcı bulunamadı');
            }
            setUserLoading(false);
          } else {
            setUserName('Paylaşan kişi yok');
            setUserLoading(false);
          }
        } else {
          setActivity(null);
          setUserLoading(false);
        }
      } catch {
        setLoading(false);
        setUserLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      const snapshot = await firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('friends')
        .get();

      const friendIds = snapshot.docs.map(doc => doc.id);
      setFriendsIds(friendIds);
    };

    fetchFriends();
  }, [currentUserId]);

  useEffect(() => {
    if (!activityId) return;

    const fetchParticipants = async () => {
      setLoadingParticipants(true);
      const snapshot = await firestore()
        .collection('activities')
        .doc(activityId)
        .collection('peoples')
        .get();

      const participantIds = snapshot.docs.map(doc => doc.id);
      setParticipantsIds(participantIds);

      setLoadingParticipants(false);
    };

    fetchParticipants();
  }, [activityId]);

  useEffect(() => {
    const fetchFriendParticipants = async () => {
      const commonIds = friendsIds.filter(id => participantsIds.includes(id));
      if (commonIds.length === 0) {
        setFriendParticipants([]);
        return;
      }

      const usersSnapshot = await firestore()
        .collection('users')
        .where(firestore.FieldPath.documentId(), 'in', commonIds)
        .get();

      const friends = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return data.fullName || data.name || 'İsim yok';
      });

      setFriendParticipants(friends);
    };

    if (friendsIds.length && participantsIds.length) {
      fetchFriendParticipants();
    }
  }, [friendsIds, participantsIds]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00897B" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text>Etkinlik bulunamadı.</Text>
      </View>
    );
  }

  const dateObj = activity.date?.toDate
    ? activity.date.toDate()
    : new Date(activity.date);
  const timeObj = new Date(activity.time);

  const imageSource = activity.image
    ? { uri: activity.image }
    : require('../assets/default-image.png');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={28} color="#333" />
      </TouchableOpacity>

      <Image source={imageSource} style={styles.image} />

      <Text style={styles.title}>{activity.title}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.category}>{activity.category}</Text>
      </View>

      <View style={styles.timerow}>
        <Icon
          name="calendar-range"
          size={24}
          color="#00897B"
          style={styles.icon}
        />
        <Text style={styles.value}>
          {dateObj.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Text>
        <Text style={styles.value}> | </Text>
        <Text style={styles.value}>
          {timeObj.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.value}>
          {activity.city} / {activity.district} / {activity.location}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.value}>
          {activity.description || 'Açıklama yok.'}
        </Text>
      </View>

      <Text style={styles.value}>Kontenjan: {activity.limited}</Text>

      <View style={styles.infoRow}>
        {userLoading ? (
          <ActivityIndicator size="small" color="#00897B" />
        ) : (
          <Text style={styles.label}>{userName}</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Icon
          name="account-supervisor"
          size={24}
          color="#00897B"
          style={styles.icon}
        />
        <Text style={styles.text}>
          {loadingParticipants
            ? 'Yükleniyor...'
            : friendParticipants.length > 0
            ? friendParticipants.join(', ') + ' katılacak.'
            : 'Arkadaşlarından katılan yok.'}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button activityId={activityId} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E2E',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    borderRadius: 30,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timerow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
    width: '100%',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: 'white',
    flexShrink: 1,
  },
  category: {
    fontSize: 17,
    color: 'white',
    marginBottom: 10,
    backgroundColor: '#00897B',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  buttonWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ActivityDetailScreen;
