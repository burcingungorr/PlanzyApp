import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Button = ({ activityId }) => {
  const [joined, setJoined] = useState(false);
  const [limited, setLimited] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [isFull, setIsFull] = useState(false);

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    if (!activityId || !userId) return;

    const docRef = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('peoples')
      .doc(userId);

    const unsubscribe = docRef.onSnapshot(docSnapshot => {
      setJoined(docSnapshot.exists);
    });

    return () => unsubscribe();
  }, [activityId, userId]);

  useEffect(() => {
    if (!activityId) return;
    const activityRef = firestore().collection('activities').doc(activityId);

    const unsubscribe = activityRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (data?.limited !== undefined) {
        setLimited(data.limited);
      }

      const peoplesSnapshot = await activityRef.collection('peoples').get();
      const count = peoplesSnapshot.size;
      setParticipantCount(count);
      setIsFull(data?.limited !== undefined && count >= data.limited);
    });

    return () => unsubscribe();
  }, [activityId]);

  const handlePress = async () => {
    const docRef = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('peoples')
      .doc(userId);

    try {
      if (joined) {
        await docRef.delete();
        setJoined(false);
      } else {
        if (isFull) {
          Alert.alert('Uyarı', 'Kontenjan dolmuştur.');
          return;
        }

        await docRef.set({
          joinedAt: firestore.FieldValue.serverTimestamp(),
        });
        setJoined(true);
      }
    } catch (error) {
      Alert.alert('Hata', 'İşlem sırasında hata oluştu: ');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, isFull && !joined && styles.disabledButton]}
      disabled={isFull && !joined}
    >
      <View style={styles.row}>
        <Text style={styles.text}>
          {isFull && !joined ? 'Kontenjan Doldu' : 'Katılacağım'}
        </Text>
        {joined && !isFull && (
          <MaterialCommunityIcons
            name="check"
            size={18}
            color="#fff"
            style={styles.check}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#00897B',
    borderRadius: 10,
    width: '80%',
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  check: {
    marginLeft: 8,
  },
});

export default Button;
