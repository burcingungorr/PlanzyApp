import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ActivityCard from './ActivityCard';

const ActivityList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Şuan etkinlik yok.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ActivityCard {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ActivityList;
