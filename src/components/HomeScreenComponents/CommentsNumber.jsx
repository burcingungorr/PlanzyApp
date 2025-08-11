import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddComment from './AddComment';
import firestore from '@react-native-firebase/firestore';

const CommentsNumber = ({ activityId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(data);
      });

    return () => unsubscribe();
  }, [activityId]);

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      {item.userAvatar ? (
        <Image source={{ uri: item.userAvatar }} style={styles.avatarImage} />
      ) : (
        <MaterialCommunityIcons
          name="account-circle"
          size={30}
          color="#555"
          style={styles.userIcon}
        />
      )}
      <View style={styles.commentContent}>
        <Text style={styles.userName}>
          {item.user || item.userName || 'Anonim'}
        </Text>
        <Text style={styles.commentText}>{item.text}</Text>
        {item.createdAt && (
          <Text style={styles.timeText}>
            {item.createdAt.toDate
              ? item.createdAt.toDate().toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Şimdi'}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Yorum sayısını göster */}
      {comments.length > 0 && (
        <Text style={styles.commentCount}>{comments.length}</Text>
      )}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="comment-outline" size={24} color="#555" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.headerContainer}>
                  <Text style={styles.header}>
                    Yorumlar {comments.length > 0 && `(${comments.length})`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeIconButton}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>

                {comments.length === 0 ? (
                  <View style={styles.noCommentsContainer}>
                    <MaterialCommunityIcons
                      name="comment-outline"
                      size={48}
                      color="#ccc"
                    />
                    <Text style={styles.noCommentsText}>Henüz yorum yok</Text>
                    <Text style={styles.noCommentsSubText}>
                      İlk yorumu sen yap!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={comments}
                    keyExtractor={item => item.id}
                    renderItem={renderCommentItem}
                    showsVerticalScrollIndicator={false}
                    style={styles.commentsList}
                  />
                )}

                <AddComment activityId={activityId} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginRight: 8,
    color: '#555',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    height: '85%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIconButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  userIcon: {
    marginRight: 12,
    width: 32,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#00897B',
    borderRadius: 16,
    padding: 12,
    position: 'relative',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 15,
    color: 'white',
  },
  commentText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  noCommentsSubText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default CommentsNumber;
