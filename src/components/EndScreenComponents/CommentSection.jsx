import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const CommentSection = ({ activityId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const userName = useSelector(
    state => state.user.userInfo?.fullName || 'Anonim',
  );

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('endcomments')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
      });

    return () => unsubscribe();
  }, [activityId]);

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        await firestore()
          .collection('activities')
          .doc(activityId)
          .collection('endcomments')
          .add({
            text: comment.trim(),
            userName,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

        setComment('');
      } catch (error) {
        console.error('Yorum ekleme hatası:', error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <MaterialCommunityIcons
        name="account-circle"
        size={30}
        color="white"
        style={styles.userIcon}
      />
      <View style={styles.commentContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Yorumlar</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Yorumunuzu yazın..."
          placeholderTextColor="#aaa"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <MaterialCommunityIcons name="send" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 5 },
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    height: 45,
    fontSize: 16,
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#00897B',
    padding: 10,
    borderRadius: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  userIcon: {
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#00897B',
    borderRadius: 12,
    padding: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 17,
    color: 'white',
  },
  commentText: {
    fontSize: 17,
    color: 'white',
  },
});

export default CommentSection;
