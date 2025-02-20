import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '@/styles/main';
import { useLanguage } from '@/contexts/LanguageContext';

export function AuthButtons() {
  const { t } = useLanguage();

  return (
      <View style={styles.actions}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.buttonContainer}>
            <LinearGradient
              colors={['#FF8FB1', '#FF758C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startJourneyButton}
            >
              <Text style={styles.startJourneyButtonText}>{t('auth.startJourney')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </View>
  );
}