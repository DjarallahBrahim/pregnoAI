import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from '@/styles/main';

import { useLanguage } from '@/contexts/LanguageContext';

export function WelcomeHeader() {
  const { t } = useLanguage();

  return (
    <View style={styles.welcomeContainer}>
        <View style={styles.mainImageContainer}>
          <Image
            source={require('../../assets/images/img2.png')}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

      <BlurView intensity={60} style={styles.titleWrapper} tint="light">
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.subtitle}>
            {t('welcome.subtitle')}
          </Text>
        </View>
      </BlurView>
    </View>
  );
}