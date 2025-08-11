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

const EndActivities = () => {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('activities')
      .where('date', '<', new Date())
      .orderBy('date', 'desc')
      .onSnapshot(
        async snapshot => {
          const activitiesData = await Promise.all(
            snapshot.docs.map(async doc => {
              const data = doc.data();
              let authorName = 'Bilinmiyor';

              if (data.userId) {
                const userDoc = await firestore()
                  .collection('users')
                  .doc(data.userId)
                  .get();
                if (userDoc.exists) {
                  const userData = userDoc.data();
                  authorName = userData.fullName || 'Anonim';
                }
              }

              return {
                id: doc.id,
                ...data,
                authorName,
              };
            }),
          );

          setActivities(activitiesData);
          setLoading(false);
        },
        error => {
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const handlePress = item => {
    navigation.navigate('End', { activity: item });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00897B" />
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Geçmiş etkinlik bulunamadı.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const dateObj = item.date?.toDate
      ? item.date.toDate()
      : new Date(item.date);
    const timeObj = new Date(item.time);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require('../../assets/default-image.png')
          }
          style={styles.image}
        />
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.status}>Etkinlik Bitti</Text>
          </View>
          <Text style={styles.text}>{item.category}</Text>
          <Text style={styles.text}>{item.city}</Text>
          <View style={styles.row}>
            <Text style={styles.text}>
              {dateObj.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
              {' - '}
              {timeObj.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={styles.author}>{item.authorName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
  container: { flex: 1, marginTop: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  info: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 18 },
  text: { color: '#555', fontSize: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  status: {
    fontSize: 15,
    color: '#00897B',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  author: {
    fontWeight: 'bold',
  },
});

export default EndActivities;
