import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { useLanguage } from '@/contexts/LanguageContext';

type MoodSelectorProps = {
  value: number;
  onChange: (mood: number) => void;
};

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { t } = useLanguage();

  const moods = [
    t('onboarding.moods.great'),
    t('onboarding.moods.good'),
    t('onboarding.moods.okay'),
    t('onboarding.moods.notSoGood'),
    t('onboarding.moods.bad')
  ];

  return (
    <View style={styles.moodContainer}>
      {moods.map((mood, index) => (
        <TouchableOpacity
          key={mood}
          style={[
            styles.moodButton,
            value === index && styles.moodButtonSelected,
          ]}
          onPress={() => onChange(index)}
        >
          <Text style={styles.moodButtonText}>{mood}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}