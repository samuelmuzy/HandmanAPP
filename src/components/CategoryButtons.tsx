import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface CategoryButtonsProps {
  categories: string[]; // Assuming categories are strings for now
  onSelectCategory?: (category: string) => void;
}

export const CategoryButtons = ({ categories, onSelectCategory }: CategoryButtonsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category); 
    if (onSelectCategory) {
      onSelectCategory(category); 
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => {
          const isSelected = category === selectedCategory; 
          return (
            <TouchableOpacity
              key={index}
              style={[styles.button, isSelected && styles.selectedButton]} 
              onPress={() => handleSelectCategory(category)}
            >
              <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>{category}</Text> 
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#fbe6d4', // Default background color
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#a64b00', // Background color when selected
  },
  buttonText: {
    color: '#a64b00', // Default text color
    fontSize: 14,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#fbe6d4', // Text color when selected
  },
}); 