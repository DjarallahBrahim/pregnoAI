import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n/i18n';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, params?: object) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(Localization.locale);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    loadSavedLocale();
  }, []);

  const loadSavedLocale = async () => {
    try {
      const savedLocale = await AsyncStorage.getItem('userLocale');
      if (savedLocale) {
        await changeLanguage(savedLocale);
      }
    } catch (error) {
      console.error('Error loading saved locale:', error);
    }
  };

  const changeLanguage = async (newLocale: string) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  };

  const setLocale = async (newLocale: string) => {
    try {
      await AsyncStorage.setItem('userLocale', newLocale);
      await changeLanguage(newLocale);
    } catch (error) {
      console.error('Error setting locale:', error);
    }
  };

  // Wrapper for i18n.t to ensure context updates trigger re-renders
  const t = (key: string, params?: object) => {
    return i18n.t(key, params);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}