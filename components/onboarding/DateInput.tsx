import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { useLanguage } from '@/contexts/LanguageContext';

type DateInputProps = {
  value: Date;
  onChange: (_: any, date?: Date) => void;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
};

export function DateInput({ value, onChange, showPicker, setShowPicker }: DateInputProps) {
  const { t } = useLanguage();

  return (
    <View style={[styles.inputContainer, { minHeight: Platform.OS === 'ios' ? 200 : 56 }]}>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {value ? value.toLocaleDateString() : t('onboarding.selectDate')}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChange}
          maximumDate={new Date()}
          style={styles.datePicker}
          themeVariant="light"
          textColor="#000000"
          accentColor="#FF8FB1"
        />
      )}
    </View>
  );
}