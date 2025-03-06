import React from 'react';
import { View } from 'react-native';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

type ProgressDotsProps = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.progress}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index === current && styles.progressDotActive,
            index < current && styles.progressDotCompleted,
          ]}
        />
      ))}
    </View>
  );
}