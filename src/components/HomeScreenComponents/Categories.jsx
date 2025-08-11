import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

const categories = [
  'Hepsi',
  'Yemek',
  'Moda',
  'Sosyal',
  'Spor',
  'Kariyer',
  'Günlük Yaşam',
];

const Categories = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelectCategory(cat === 'Hepsi' ? null : cat)}
            style={[
              styles.button,
              selectedCategory === cat || (cat === 'Hepsi' && !selectedCategory)
                ? styles.selected
                : null,
            ]}
          >
            <Text
              style={[
                styles.text,
                selectedCategory === cat ||
                (cat === 'Hepsi' && !selectedCategory)
                  ? styles.selectedText
                  : null,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    marginBottom: 15,
  },
  container: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    gap: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 8,
  },
  selected: {
    backgroundColor: '#00897B',
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
  },
});

export default Categories;
