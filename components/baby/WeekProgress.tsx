import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface WeekProgressProps {
  week: number;
  direction?: 'forward' | 'backward';
  onPress?: () => void;
}

export function WeekProgress({ week, direction = 'forward', onPress }: WeekProgressProps) {
  const { t } = useLanguage();
  

  return (
    <View style={styles.container}>
      <Animated.View
        entering={direction === 'forward' ? SlideInRight.duration(500) : SlideInLeft.duration(500)}
       
        key={week}
        style={styles.animatedContainer}
      >
        <ImageBackground
        source={require('../../assets/images/progress_bg.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <View style={styles.weekContainer}>
            <Text style={styles.weekNumber}>{week}</Text>
            <Text style={styles.weekLabel}>{t('calendar.weekShort')}</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.updateText}>{t('calendar.weeklyUpdate')}</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Ouvrir</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 160,
  },
  animatedContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
        shadowColor: theme.colors.primary,
      },
    }),
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backgroundImage: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover', 
    top: -10, // Adjust to show more of the top decoration
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 143, 177, 0.15)',
  },
  weekContainer: {
    alignItems: 'center',
  },
  weekNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.primary,

    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    opacity: 0.9,
    marginTop: -5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  updateText: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.primary,
    opacity: 0.9,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '900',
    marginRight: 4,
  },
});