import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import ImageUploader from '../components/EndScreenComponents/ImageUploader';
import CommentSection from '../components/EndScreenComponents/CommentSection';
import Title from '../components/Title';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const EndDetail = ({ route }) => {
  const { activity } = route.params;
  const navigation = useNavigation();

  const imageSource =
    typeof activity.image === 'string'
      ? { uri: activity.image }
      : activity.image
      ? activity.image
      : require('../assets/default-image.png');

  const formattedDate = activity.date?.toDate
    ? activity.date.toDate().toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : typeof activity.date === 'string'
    ? new Date(activity.date).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : activity.date;

  const formattedTime = activity.time
    ? new Date(activity.time).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={28} color="white" />
      </TouchableOpacity>

      <View style={{ marginLeft: 18 }}>
        <Title name="Etkinlik Sonu" />
      </View>

      <View style={styles.card}>
        <Image source={imageSource} style={styles.mainImage} />
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.info}>{activity.category}</Text>
        <Text style={styles.info}>{activity.city}</Text>

        <Text style={styles.info}>
          {formattedDate} | {formattedTime}
        </Text>

        <Text style={styles.status}>Etkinlik Bitti</Text>
      </View>

      <ImageUploader activityId={activity.id} />
      <CommentSection activityId={activity.id} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E2E',
    flexGrow: 1,
    padding: 20,
  },
  card: {
    marginTop: 10,
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  info: {
    fontSize: 17,
    color: 'white',
    marginBottom: 4,
  },

  status: {
    marginTop: 10,
    color: '#00897B',
    fontWeight: 'bold',
    fontSize: 17,
  },
  backButton: {
    position: 'absolute',
    top: 38,
    left: 20,
    zIndex: 1,
  },
});

export default EndDetail;
