import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { useLanguage } from '@/contexts/LanguageContext';
import { DateInput } from './DateInput';

type DueDateInputProps = {
  value: Date | null;
  onChange: (_: any, date?: Date) => void;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  calculatedDueDate: Date | null;
  isAdjustingDate: boolean;
  setIsAdjustingDate: (adjusting: boolean) => void;
  manualDueDate: string;
  handleManualDateChange: (text: string) => void;
  dateError: string | null;
  handleAcceptDueDate: () => void;
  handleAdjustDate: () => void;
};

export function DueDateInput({
  value,
  onChange,
  showPicker,
  setShowPicker,
  calculatedDueDate,
  isAdjustingDate,
  setIsAdjustingDate,
  manualDueDate,
  handleManualDateChange,
  dateError,
  handleAcceptDueDate,
  handleAdjustDate,
}: DueDateInputProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.dueDateContainer}>
      {!isAdjustingDate && (
        <DateInput
          value={value || new Date()}
          onChange={onChange}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      )}
      
      {calculatedDueDate && (
        <View style={styles.dueDateResult}>
          <Text style={styles.dueDateLabel}>{t('onboarding.estimatedDueDate')}</Text>
          <Text style={styles.dueDateText}>
            {calculatedDueDate.toLocaleDateString()}
          </Text>
          
          {!isAdjustingDate ? (
            <View style={styles.dueDateActions}>
              <TouchableOpacity
                style={[styles.dueDateButton, styles.acceptButton]}
                onPress={handleAcceptDueDate}
              >
                <Text style={styles.dueDateButtonText}>{t('onboarding.acceptDate')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dueDateButton, styles.adjustButton]}
                onPress={handleAdjustDate}
              >
                <Text style={styles.dueDateButtonText}>{t('onboarding.adjustDate')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.adjustDateContainer}>
              <TextInput
                style={styles.manualDateInput}
                value={manualDueDate}
                onChangeText={handleManualDateChange}
                placeholder="DD/MM/YYYY"
                keyboardType="numeric"
                maxLength={10}
                autoFocus
              />
              {dateError && (
                <Text style={[styles.manualDateHint, { color: 'red' }]}>
                  {dateError}
                </Text>
              )}
              <Text style={styles.manualDateHint}>
                {t('onboarding.enterDateFormat')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}