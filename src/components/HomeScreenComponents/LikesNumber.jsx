import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LikesNumber = ({ activityId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const likeRef = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('likes');

    const unsubscribe = likeRef.onSnapshot(snapshot => {
      setLikesCount(snapshot.size);
      setLiked(snapshot.docs.some(doc => doc.id === userId));
    });

    return () => unsubscribe();
  }, [activityId]);

  const toggleLike = async () => {
    const likeRef = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('likes')
      .doc(userId);

    if (liked) {
      await likeRef.delete();
    } else {
      await likeRef.set({ liked: true });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.likesText}>{likesCount}</Text>
      <TouchableOpacity onPress={toggleLike}>
        <MaterialCommunityIcons
          name={liked ? 'heart' : 'heart-outline'}
          size={24}
          color="#00897B"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  likesText: { marginRight: 8 },
});

export default LikesNumber;
