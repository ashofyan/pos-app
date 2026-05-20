import React from 'react';

import {FlatList, TouchableOpacity, Text, StyleSheet} from 'react-native';

import {AccountingCategory} from '../types/category.types';

interface Props {
  categories: AccountingCategory[];

  activeCategory: number | null;

  onSelect: (categoryId: number | null) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: Props) {
  return (
    <FlatList
      horizontal
      data={[
        {
          id: null,
          category_name: 'All',
        },
        ...categories,
      ]}
      keyExtractor={(item: any) => String(item.id)}
      showsHorizontalScrollIndicator={false}
      renderItem={({item}: any) => {
        const active = activeCategory === item.id;

        return (
          <TouchableOpacity
            style={[styles.button, active && styles.activeButton]}
            onPress={() => onSelect(item.id)}>
            <Text style={[styles.text, active && styles.activeText]}>
              {item.category_name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D9D9D9',

    paddingHorizontal: 20,
    paddingVertical: 8,

    borderRadius: 999,

    marginRight: 12,
  },

  activeButton: {
    backgroundColor: '#1677F2',
  },

  text: {
    color: '#000000',
    fontWeight: '500',
  },

  activeText: {
    color: '#FFFFFF',
  },
});
