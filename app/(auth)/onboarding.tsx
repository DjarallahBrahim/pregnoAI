import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { DateInput } from '@/components/onboarding/DateInput';
import { TextInput } from '@/components/onboarding/TextInput';
import { MoodSelector } from '@/components/onboarding/MoodSelector';
import { DueDateInput } from '@/components/onboarding/DueDateInput';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/hooks/useAuthStore';

// Calculate the due date using Naegele's rule
const calculateDueDate = (lmpDate: Date): Date => {
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 7);
  dueDate.setMonth(dueDate.getMonth() - 3);
  dueDate.setFullYear(dueDate.getFullYear() + 1);
  return dueDate;
};

type Step = {
  id: number;
  question: string | React.ReactNode;
  type: 'date' | 'text' | 'mood' | 'dueDate';
  placeholder?: string;
  tooltip?: string;
};

export default function OnboardingScreen() {
  const { t } = useLanguage();
  const { session } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calculatedDueDate, setCalculatedDueDate] = useState<Date | null>(null);
  const [isAdjustingDate, setIsAdjustingDate] = useState(false);
  const [manualDueDate, setManualDueDate] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const { setAnswers: saveAnswers } = useOnboardingStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = React.useMemo<Step[]>(() => [
    {
      id: 1,
      question: t('onboarding.dateOfBirth'),
      type: 'date',
    },
    {
      id: 2,
      question: t('onboarding.nickname'),
      type: 'text',
      placeholder: t('onboarding.nicknamePlaceholder'),
    },
    {
      id: 3,
      question: t('onboarding.mood'),
      type: 'mood',
    },
    {
      id: 4,
      question: (
        <>
          {t('onboarding.lmpDate')}
          <TouchableOpacity
            style={styles.tooltipButton}
            onPress={() => alert(t('onboarding.naegeleTooltip'))}
          >
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </>
      ),
      type: 'dueDate',
      tooltip: t('onboarding.naegeleTooltip'),
    },
  ], [t]);

  const moods = React.useMemo(() => [
    t('onboarding.moods.great'),
    t('onboarding.moods.good'),
    t('onboarding.moods.okay'),
    t('onboarding.moods.notSoGood'),
    t('onboarding.moods.bad')
  ], [t]);

  // Navigate to tabs and save answers
  const navigateToTabs = useCallback(() => {
    // Create the final data object to be passed to the next screen
    const saveData = async () => {
      if (!session?.user) {
        setError('No authenticated user found');
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const finalData = {
          user_id: session.user.id,
          name: answers[2],
          date_of_birth: answers[1].toISOString(),
          last_menstrual_period: answers[4].toISOString(),
          due_date: (calculatedDueDate || answers[4]).toISOString(),
          initial_mood: answers[3]
        };

        const { error: dbError } = await supabase
          .from('pregnancy_profiles')
          .insert(finalData);

        if (dbError) throw dbError;

        // Save answers to the store for local access
        saveAnswers({
          birthday: answers[1],
          name: answers[2],
          mood: answers[3],
          dueDate: calculatedDueDate || answers[4]
        });

        // Navigate to the baby screen
        router.replace('/(tabs)/baby');
      } catch (err: any) {
        setError(err.message || 'Failed to save profile');
        console.error('Error saving profile:', err);
      } finally {
        setSaving(false);
      }
    };

    saveData();
  }, [answers, calculatedDueDate, saveAnswers, session]);

  // Handle date selection for birthday or LMP date
  const handleDateChange = (_: any, date?: Date) => {
    if (date) {
      const stepId = currentStep + 1;
      setAnswers(prev => ({ ...prev, [stepId]: date }));
      
      // If this is the due date step, calculate the due date
      if (steps[currentStep].type === 'dueDate') {
        const dueDate = calculateDueDate(date);
        setCalculatedDueDate(dueDate);
      }
      
      // Hide the date picker on Android
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  // Format and auto-complete date input with slashes
  const formatDateInput = (text: string): string => {
    // Remove any non-numeric characters first
    const numericOnly = text.replace(/[^0-9]/g, '');
    
    // Format with slashes based on input length
    if (numericOnly.length <= 2) {
      return numericOnly;
    } else if (numericOnly.length <= 4) {
      return `${numericOnly.substring(0, 2)}/${numericOnly.substring(2)}`;
    } else {
      return `${numericOnly.substring(0, 2)}/${numericOnly.substring(2, 4)}/${numericOnly.substring(4, 8)}`;
    }
  };

  // Validate the date format and check if it's a valid date
  const validateDate = (dateString: string): boolean => {
    // Check if format is DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) {
      setDateError(t('onboarding.invalidDateFormat'));
      return false;
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-11
    const year = parseInt(match[3], 10);
    
    // Create a date and verify it's valid
    const date = new Date(year, month, day);
    
    if (
      isNaN(date.getTime()) || 
      date.getDate() !== day || 
      date.getMonth() !== month || 
      date.getFullYear() !== year
    ) {
      setDateError(t('onboarding.invalidDate'));
      return false;
    }
    
    // Date is valid
    setDateError(null);
    return true;
  };

  // Parse a validated date string to a Date object
  const parseValidDate = (dateString: string): Date | null => {
    if (!validateDate(dateString)) return null;
    
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  };

  // Handle manual date input for due date adjustment
  const handleManualDateChange = (text: string) => {
    // Format the input to include slashes automatically
    const formattedText = formatDateInput(text);
    setManualDueDate(formattedText);
    
    // Only attempt to parse the date if it's in the complete format
    if (formattedText.length === 10) {
      const date = parseValidDate(formattedText);
      if (date) {
        setCalculatedDueDate(date);
        setAnswers(prev => ({ ...prev, [currentStep + 1]: date }));
      }
    } else {
      // Clear the error if not complete
      setDateError(null);
    }
  };

  // Move to next step or finish onboarding
  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigateToTabs();
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    const step = steps[currentStep];
    const answer = answers[step.id];
    
    // For the dueDate step, it's valid if there's a calculated due date and no error
    if (step.type === 'dueDate' && isAdjustingDate) {
      return calculatedDueDate !== null && dateError === null;
    }
    
    return answer !== undefined && answer !== '';
  };

  // Handle accepting the calculated due date
  const handleAcceptDueDate = () => {
    if (calculatedDueDate) {
      setAnswers(prev => ({ ...prev, [steps[currentStep].id]: calculatedDueDate }));
      navigateToTabs();
    }
  };

  // Handle switching to manual adjustment mode
  const handleAdjustDate = () => {
    setIsAdjustingDate(true);
    // Hide the date picker when adjusting date
    setShowDatePicker(false);
    
    // Pre-fill the manual date input with the calculated due date if available
    if (calculatedDueDate) {
      const day = String(calculatedDueDate.getDate()).padStart(2, '0');
      const month = String(calculatedDueDate.getMonth() + 1).padStart(2, '0');
      const year = calculatedDueDate.getFullYear();
      setManualDueDate(`${day}/${month}/${year}`);
    }
  };

  // Render the appropriate input for each step
  const renderInput = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'date':
        return <DateInput
          value={answers[step.id] || new Date()}
          onChange={handleDateChange}
          showPicker={showDatePicker}
          setShowPicker={setShowDatePicker}
        />;
      case 'text':
        return <TextInput
          value={answers[step.id] || ''}
          onChangeText={text => setAnswers(prev => ({ ...prev, [step.id]: text }))}
          placeholder={step.placeholder || ''}
        />;
      case 'mood':
        return <MoodSelector
          value={answers[step.id] || -1}
          onChange={(mood) => setAnswers(prev => ({ ...prev, [step.id]: mood }))}
        />;
      case 'dueDate':
        return <DueDateInput
          value={answers[step.id] || null}
          onChange={handleDateChange}
          showPicker={showDatePicker}
          setShowPicker={setShowDatePicker}
          calculatedDueDate={calculatedDueDate}
          isAdjustingDate={isAdjustingDate}
          setIsAdjustingDate={setIsAdjustingDate}
          manualDueDate={manualDueDate}
          handleManualDateChange={handleManualDateChange}
          dateError={dateError}
          handleAcceptDueDate={handleAcceptDueDate}
          handleAdjustDate={handleAdjustDate}
        />;
      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.container}
      >
        <StatusBar style="dark" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProgressDots total={steps.length} current={currentStep} />

          <Animated.View
            key={currentStep}
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.content}
          >
            <Text style={[
              styles.question,
              { color: theme.colors.text.primary }
            ]}>{steps[currentStep].question}</Text>
            {renderInput()}
          </Animated.View>
        </ScrollView>

        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.button,
              (!isStepValid() || saving) && styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={!isStepValid() || saving}
          >
            <Text style={styles.buttonText}>
              {saving 
                ? 'Saving...' 
                : currentStep === steps.length - 1 
                  ? t('onboarding.finish') 
                  : t('onboarding.continue')
              }
            </Text>
          </TouchableOpacity>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}