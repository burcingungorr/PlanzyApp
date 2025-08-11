import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActivityTime = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(value ? new Date(value) : new Date());
  const [isTimeSelected, setIsTimeSelected] = useState(!!value);

  useEffect(() => {
    if (value) {
      setTime(new Date(value));
      setIsTimeSelected(true);
    }
  }, [value]);

  const formatTime = date => {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const onChangeInternal = (event, selectedTime) => {
    setShow(false);
    if (event.type === 'set' && selectedTime) {
      setTime(selectedTime);
      setIsTimeSelected(true);
      if (onChange) {
        onChange(selectedTime.toISOString());
      }
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Icon
          name="clock-outline"
          size={20}
          color="#00897B"
          style={styles.icon}
        />
        <Text
          style={[
            styles.buttonText,
            { color: isTimeSelected ? '#000' : '#999' },
          ]}
        >
          {isTimeSelected ? formatTime(time) : 'Saat Seç'}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          display="clock"
          onChange={onChangeInternal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    height: 50,
    borderColor: '#00897B',
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default ActivityTime;
