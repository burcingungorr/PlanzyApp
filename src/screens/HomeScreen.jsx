import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Title from '../components/Title';
import Filter from '../components/HomeScreenComponents/Filter';
import DateFilter from '../components/HomeScreenComponents/DateFilter';
import AddButton from '../components/HomeScreenComponents/AddButton';
import ActivityList from '../components/HomeScreenComponents/ActivityList';
import Categories from '../components/HomeScreenComponents/Categories';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('activities')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const item = doc.data();
          let dateObj = null;
          dateObj = item.date.toDate();
          return {
            id: doc.id,
            ...item,
            date: dateObj,
          };
        });
        setActivities(data);
      });

    return () => unsubscribe();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredData = activities.filter(item => {
    const matchCategory = selectedCategory
      ? item.category === selectedCategory
      : true;

    const matchCity = selectedCity
      ? item.city.toLowerCase() === selectedCity.toLowerCase()
      : true;

    const matchDate = selectedDate
      ? item.date?.toISOString().split('T')[0] ===
        selectedDate.toISOString().split('T')[0]
      : true;

    const validDate = item.date ? item.date >= today : false;

    return matchCategory && matchCity && matchDate && validDate;
  });

  return (
    <View style={styles.container}>
      <Title name="Etkinlikler" />
      <AddButton />
      <View style={styles.bodycontainer}>
        <Filter onSelectCity={setSelectedCity} />
        <DateFilter onDateChange={date => setSelectedDate(date)} />
      </View>
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ActivityList data={filteredData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    padding: 20,
  },
  bodycontainer: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 15,
    marginBottom: 10,
  },
});

export default HomeScreen;
