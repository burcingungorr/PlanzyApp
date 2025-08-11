import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import { IMGUR_CLIENT_ID } from '../../config';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ImageUploader = ({ activityId }) => {
  const [uploading, setUploading] = useState(false);
  const [storedImages, setStoredImages] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const saveImageToFirestore = async url => {
    await firestore()
      .collection('activities')
      .doc(activityId)
      .collection('images')
      .add({
        url,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  };

  const uploadToImgur = async imageUri => {
    setUploading(true);

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.data?.link) {
      const imageUrl = data.data.link;
      await saveImageToFirestore(imageUrl);
    } else {
    }
    setUploading(false);
  };

  const handleImagePicker = () => {
    if (uploading) return;

    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets?.length > 0 &&
        response.assets[0].uri
      ) {
        uploadToImgur(response.assets[0].uri).catch(err =>
          console.error('hata'),
        );
      }
    });
  };

  const deleteImage = async urlToDelete => {
    const imageDocs = await firestore()
      .collection('activities')
      .doc(activityId)
      .collection('images')
      .where('url', '==', urlToDelete)
      .get();

    const batch = firestore().batch();
    imageDocs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('activities')
      .doc(activityId)
      .collection('images')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const urls = snapshot.docs.map(doc => doc.data().url);
        setStoredImages(urls);
      });

    return () => unsubscribe();
  }, [activityId]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.label}>Etkinlikten Görsel Yükle</Text>
        <TouchableOpacity onPress={handleImagePicker} disabled={uploading}>
          <MaterialCommunityIcons
            name="image-plus"
            size={30}
            color={uploading ? '#aaa' : '#00897B'}
          />
        </TouchableOpacity>
      </View>

      {uploading && (
        <ActivityIndicator
          size="small"
          color="#00897B"
          style={{ marginBottom: 10 }}
        />
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 10 }}
      >
        {storedImages.map((url, i) => (
          <View key={i} style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={() => setFullScreenImage(url)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: url }} style={styles.sampleImage} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => deleteImage(url)}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="#F44336"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!fullScreenImage} transparent>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalCloseArea}
            onPress={() => setFullScreenImage(null)}
          />
          <Image
            source={{ uri: fullScreenImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setFullScreenImage(null)}
          >
            <MaterialCommunityIcons name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: { fontSize: 18, fontWeight: '500', color: 'white' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  sampleImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 30,
  },
  modalCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ImageUploader;
