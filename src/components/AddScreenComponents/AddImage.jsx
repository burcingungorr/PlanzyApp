import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { IMGUR_CLIENT_ID } from '../../config';

const AddImage = ({ value, onChange }) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [localImageUri, setLocalImageUri] = useState(value || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalImageUri(value);
  }, [value]);

  const uploadToImgur = async imageUri => {
    try {
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

      if (data.success && data.data && data.data.link) {
        setLocalImageUri(imageUri);
        if (onChange) onChange(data.data.link);
      } else {
        console.error('Imgur yükleme hatası:', data);
      }
    } catch (error) {
      console.error('Imgur hata:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelected = uri => {
    uploadToImgur(uri).catch(err => console.error('Upload error:', err));
    setImageModalVisible(false);
  };

  const handleImagePicker = () => {
    if (uploading) return;
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].uri
      ) {
        handleImageSelected(response.assets[0].uri);
      }
    });
  };

  const handleCameraLaunch = () => {
    if (uploading) return;
    launchCamera({ mediaType: 'photo' }, response => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].uri
      ) {
        handleImageSelected(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setImageModalVisible(true)}
        disabled={uploading}
      >
        <MaterialCommunityIcons name="camera-plus" size={30} color="#00897B" />
        <Text style={styles.buttonText}>
          {uploading ? 'Yükleniyor...' : 'Fotoğraf Ekle'}
        </Text>
      </TouchableOpacity>

      {localImageUri && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: localImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              setLocalImageUri(null);
              if (onChange) onChange(null);
            }}
            disabled={uploading}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>

          {uploading && (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              size="small"
              color="#66914c"
            />
          )}
        </View>
      )}

      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!uploading) setImageModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fotoğraf Çek / Yükle</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleImagePicker}
              disabled={uploading}
            >
              <Text style={styles.modalButtonText}>Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCameraLaunch}
              disabled={uploading}
            >
              <Text style={styles.modalButtonText}>Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => !uploading && setImageModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: 'white' }]}
              disabled={uploading}
            >
              <Text style={[styles.modalButtonText, { color: '#000' }]}>
                Kapat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderRadius: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    backgroundColor: 'white',
  },
  buttonText: {
    marginLeft: 22,
    color: '#999',
    fontSize: 16,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#00897B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 280,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  modalButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#00897B',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddImage;
