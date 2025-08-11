import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import ActivityTitle from '../components/AddScreenComponents/ActivityTitle';
import ActivityCategory from '../components/AddScreenComponents/ActivityCategory';
import ActivityDate from '../components/AddScreenComponents/ActivityDate';
import ActivityTime from '../components/AddScreenComponents/ActivityTime';
import ActivityCity from '../components/AddScreenComponents/ActivityCity';
import ActivityLocation from '../components/AddScreenComponents/ActivityLocation';
import Limited from '../components/AddScreenComponents/Limited';
import AddImage from '../components/AddScreenComponents/AddImage';
import ActivityDescription from '../components/AddScreenComponents/ActivityDescription';
import SendButton from '../components/AddScreenComponents/SendButton';

const AddScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [limited, setLimited] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const sendNotification = async (notifTitle, notifBody) => {
    try {
      const response = await fetch(
        'http://192.168.1.103:3000/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: notifTitle,
            body: notifBody,
            topic: 'highScores',
          }),
        },
      );
      const data = await response.json();
      console.log('Notification API Response:', data);
      if (!data.success) {
        Alert.alert('Bildirim Hatası', 'Bildirim gönderilemedi.');
      }
    } catch (error) {
      console.error('Notification gönderme hatası:', error);
    }
  };

  const handleSaveActivity = async () => {
    if (
      !title.trim() ||
      !category.trim() ||
      !date ||
      !time ||
      !city ||
      !district ||
      !location.trim() ||
      !limited.trim() ||
      !description.trim()
    ) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const userId = auth().currentUser?.uid;
      await firestore().collection('activities').add({
        title,
        category,
        date,
        time,
        city,
        district,
        location,
        limited,
        image,
        description,
        userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await sendNotification(
        'Yeni Etkinlik!',
        `${title} etkinliği eklendi. Göz atmayı unutma!`,
      );

      navigation.goBack();
      setTitle('');
      setCategory('');
      setDate('');
      setTime('');
      setCity('');
      setDistrict('');
      setLocation('');
      setLimited('');
      setImage(null);
      setDescription('');
    } catch (error) {
      Alert.alert(
        'Hata',
        'Etkinlik kaydedilirken hata oluştu: ' + error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>ETKİNLİK EKLE</Text>
        </View>

        <ActivityTitle value={title} onChange={setTitle} />
        <ActivityCategory value={category} onChange={setCategory} />

        <View style={styles.row}>
          <View style={[styles.half, { marginRight: 10 }]}>
            <ActivityDate value={date} onChange={setDate} />
          </View>
          <View style={styles.half}>
            <ActivityTime value={time} onChange={setTime} />
          </View>
        </View>

        <ActivityCity
          city={city}
          onCityChange={setCity}
          district={district}
          onDistrictChange={setDistrict}
        />
        <ActivityLocation value={location} onChange={setLocation} />
        <Limited value={limited} onChange={setLimited} />
        <AddImage value={image} onChange={setImage} />
        <ActivityDescription value={description} onChange={setDescription} />

        <SendButton onPress={handleSaveActivity} disabled={loading} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    padding: 20,
  },
  backButton: {
    position: 'relative',
    width: 40,
    top: 28,
    left: -5,
    zIndex: 1000,
  },
  titleContainer: {
    marginLeft: 25,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
  },
});

export default AddScreen;
