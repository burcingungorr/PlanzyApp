import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DateFilter = ({ onDateChange }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(null);

  const onChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
    setShow(false);
  };

  const clearDate = () => {
    setDate(null);
    onDateChange(null);
  };

  const formattedDate = date
    ? date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Tarih Seç';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.buttonText}>{formattedDate}</Text>
        {date && (
          <TouchableOpacity onPress={clearDate} style={styles.clearIcon}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    width: 140,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00897B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 3,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearIcon: {
    marginLeft: 10,
  },
});

export default DateFilter;
