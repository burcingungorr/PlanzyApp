import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { IMGUR_CLIENT_ID } from '../../config';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserProfil = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);

  const currentUser = auth().currentUser;

  useEffect(() => {
    if (currentUser?.uid) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot(documentSnapshot => {
          const data = documentSnapshot.data();
          if (data?.avatar) {
            setAvatarUri(data.avatar);
          }
        });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const saveAvatarToFirestore = async imageUrl => {
    if (currentUser?.uid) {
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({ avatar: imageUrl });
    }
  };

  const handleImageUpload = async uri => {
    try {
      const base64Image = await RNFS.readFile(uri, 'base64');

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image, type: 'base64' }),
      });

      const data = await response.json();
      if (data.success && data.data?.link) {
        const imageUrl = data.data.link;
        await saveAvatarToFirestore(imageUrl);
      } else {
        console.error('Imgur yükleme hatası:', data);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const openGallery = async () => {
    setModalVisible(false);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      await handleImageUpload(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setModalVisible(false);
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      await handleImageUpload(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.avatarButton}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={100}
            color="white"
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profil Fotoğrafı Seç / Yükle</Text>

            <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
              <Text style={styles.optionText}>Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
              <Text style={styles.optionText}>Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  avatarButton: { borderRadius: 50, overflow: 'hidden' },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#00897B',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: { color: 'white', fontSize: 16 },
  closeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: { color: 'black', fontSize: 16 },
});

export default UserProfil;
