import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const AddComment = ({ activityId }) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector(state => state.user.userInfo);

  const handleSend = async () => {
    if (!comment.trim()) return;

    setIsLoading(true);

    try {
      await firestore()
        .collection('activities')
        .doc(activityId)
        .collection('comments')
        .add({
          user: userInfo?.fullName || 'Anonim',
          userAvatar: userInfo?.avatar || null,
          userId: userInfo?.id || null,
          text: comment,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setComment('');
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
      Alert.alert('Hata', 'Yorum eklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Yorum ekle..."
        value={comment}
        onChangeText={setComment}
        multiline={true}
        maxLength={500}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSend}
        disabled={isLoading || !comment.trim()}
      >
        <MaterialCommunityIcons
          name={isLoading ? 'loading' : 'send'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#00897B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default AddComment;
