import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivityDate = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  const formatDate = date => {
    if (!date) return 'Tarih Seç';
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShow(false);
    if (event.type === 'set' && selectedDate && onChange) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color="#00897B"
          style={styles.icon}
        />
        <Text style={[styles.buttonText, { color: value ? '#000' : '#999' }]}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="calendar"
          onChange={onDateChange}
          maximumDate={new Date(2100, 11, 31)}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#00897B',
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default ActivityDate;
