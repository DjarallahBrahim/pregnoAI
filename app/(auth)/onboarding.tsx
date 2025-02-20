import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { theme } from '@/styles/theme';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';
import { LinearGradient } from 'expo-linear-gradient';

import { useLanguage } from '@/contexts/LanguageContext';

type Step = {
  id: number;
  question: string;
  type: 'date' | 'text' | 'mood';
  placeholder?: string;
};

const steps: Step[] = [
  {
    id: 1,
    question: 'When is your date of birth?',
    type: 'date',
  },
  {
    id: 2,
    question: 'What should we call you?',
    type: 'text',
    placeholder: 'Enter your name or nickname',
  },
  {
    id: 3,
    question: 'How are you feeling this weekend?',
    type: 'mood',
  },
];

const moods = ['😊 Great', '😌 Good', '😐 Okay', '😔 Not so good', '😢 Bad'];

export default function OnboardingScreen() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_: any, date?: Date) => {
    if (date) {
      setAnswers(prev => ({ ...prev, [currentStep + 1]: date }));
      if (Platform.OS === 'android' && showDatePicker) {
        setShowDatePicker(false);
      }
    }
  };

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save answers and navigate to main app
      router.replace('/(tabs)');
    }
  };

  const isStepValid = () => {
    const answer = answers[currentStep + 1];
    return answer !== undefined && answer !== '';
  };

  const renderInput = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'date':
        return (
          <View style={[styles.inputContainer, { minHeight: Platform.OS === 'ios' ? 200 : 56 }]}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {answers[step.id]
                  ? answers[step.id].toLocaleDateString()
                  : 'Select date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={answers[step.id] || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.datePicker}
                 textColor="black" // Set text color for iOS
  themeVariant="light" // Ensure it's in light mode
              />
            )}
          </View>
        );
      case 'text':
        return (
          <TextInput
            style={styles.input}
            placeholder={step.placeholder}
            value={answers[step.id] || ''}
            onChangeText={text => setAnswers(prev => ({ ...prev, [step.id]: text }))}
            autoFocus
          />
        );
      case 'mood':
        return (
          <View style={styles.moodContainer}>
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  answers[step.id] === index && styles.moodButtonSelected,
                ]}
                onPress={() => setAnswers(prev => ({ ...prev, [step.id]: index }))}
              >
                <Text style={styles.moodButtonText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradients.primary}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <View style={styles.progress}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.progressDotActive,
              index < currentStep && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>

      <Animated.View
        key={currentStep}
        entering={SlideInRight}
        exiting={SlideOutLeft}
        style={styles.content}
      >
        <Text style={styles.question}>{steps[currentStep].question}</Text>
        {renderInput()}
      </Animated.View>

      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={[styles.button, !isStepValid() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isStepValid()}
        >
          <Text style={styles.buttonText}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}