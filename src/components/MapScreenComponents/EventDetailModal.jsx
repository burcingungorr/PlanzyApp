import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const EventDetailModal = ({ visible, onClose, event }) => {
  if (!event) return null;

  const date = event.date?.toDate?.() ?? null;
  const time = event.time ? new Date(event.time) : null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{event.title}</Text>

          <Image
            source={
              event.image
                ? { uri: event.image }
                : require('../../assets/default-image.png')
            }
            style={styles.image}
          />

          <Text style={styles.text}>{event.category}</Text>
          <Text style={styles.text}>{event.location}</Text>

          <Text style={styles.text}>
            {date
              ? date.toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : 'Tarih yok'}{' '}
            |{' '}
            {time
              ? time.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : 'Saat yok'}
          </Text>

          <Text style={styles.text}>Kişi Sınırı: {event.limited}</Text>
          <Text style={styles.text}>
            Açıklama: {event.description || 'Yok'}
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EventDetailModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
    width: '100%',
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#00897B',
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
