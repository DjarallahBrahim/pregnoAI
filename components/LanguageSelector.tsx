import React, { memo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';

export const LanguageSelector = memo(function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = async (language: string) => {
    if (language !== locale) {
      await setLocale(language);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, locale.startsWith('en') && styles.activeButton]}
        onPress={() => handleLanguageChange('en')}
      >
        <Text style={[styles.text, locale.startsWith('en') && styles.activeText]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, locale.startsWith('fr') && styles.activeButton]}
        onPress={() => handleLanguageChange('fr')}
      >
        <Text style={[styles.text, locale.startsWith('fr') && styles.activeText]}>FR</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    
  },
  activeButton: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  activeText: {
    color: theme.colors.text.light,
  },
});