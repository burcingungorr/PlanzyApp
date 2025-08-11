import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const ActivitiesHistoryScreen = () => {
  const navigation = useNavigation();
  const currentUserId = useSelector(state => state.user.userInfo.id);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('activities')
      .where('userId', '==', currentUserId)
      .onSnapshot(
        snapshot => {
          const fetched = snapshot.docs.map(doc => {
            const data = doc.data();

            const date = data.date?.toDate
              ? data.date.toDate()
              : new Date(data.date);
            const time = data.time?.toDate
              ? data.time.toDate()
              : new Date(data.time);

            return {
              id: doc.id,
              ...data,
              date,
              time,
            };
          });
          setActivities(fetched);
          setLoading(false);
        },
        error => {
          console.error('Firestore aktivite çekme hatası:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [currentUserId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ActivityDetail', { activityId: item.id })
      }
    >
      <Image
        source={
          item.image
            ? { uri: item.image }
            : require('../assets/default-image.png')
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.text}>{item.category}</Text>
        <Text style={styles.text}>{item.city}</Text>
        <View style={styles.row}>
          <Text style={styles.text}>
            {item.date instanceof Date
              ? item.date.toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : ''}
            {' - '}
            {item.time instanceof Date
              ? item.time.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00897B" />
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: 'white' }}>
          Kendi oluşturduğun etkinlik bulunmamaktadır.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  text: {
    color: '#555',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#00897B',
    marginLeft: 10,
  },
  author: {
    fontSize: 13,
    color: '#777',
  },
});

export default ActivitiesHistoryScreen;
