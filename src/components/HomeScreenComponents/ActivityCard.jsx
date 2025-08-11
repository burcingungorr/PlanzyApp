import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LikesNumber from './LikesNumber';
import CommentsNumber from './CommentsNumber';

const ActivityCard = ({ id, image, title, category, city, date, time }) => {
  const navigation = useNavigation();
  const imageSource = image
    ? { uri: image }
    : require('../../assets/default-image.png');

  const handlePress = () => {
    navigation.navigate('ActivityDetail', { activityId: id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.title}>{title}</Text>
          <LikesNumber activityId={id} />
        </View>
        <Text style={styles.text}>{category}</Text>
        <Text style={styles.text}>{city}</Text>
        <View style={styles.row}>
          <Text style={styles.text}>
            {date instanceof Date
              ? date.toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : date}{' '}
            -{' '}
            {new Date(time).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <CommentsNumber activityId={id} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 95,
    height: 95,
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
  },
  text: {
    color: '#555',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
});

export default ActivityCard;
