import React from 'react';
import { View, TextInput as RNTextInput } from 'react-native';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

type TextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export function TextInput({ value, onChangeText, placeholder }: TextInputProps) {
  return (
    <View style={styles.inputContainer}>
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoFocus
      />
    </View>
  );
}