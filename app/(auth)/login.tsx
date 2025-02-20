import React, { useState,useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { AuthForm } from '@/components/auth/AuthForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';
import { loginStyles as styles } from '@/styles/login.styles';
import { useKeyboardOffsetHeight } from '@/hooks/useKeyboardOffsetHeight';


export default function LoginScreen() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const keyboardOffsetHeight = useKeyboardOffsetHeight();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: keyboardOffsetHeight ? -keyboardOffsetHeight * 0.5 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardOffsetHeight]);

  return (
    <LinearGradient
      colors={theme.colors.gradients.primary}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/img1.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </Link>

      <Animated.ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        scrollEnabled={false}
        style={[styles.content, { transform: [{ translateY: animatedValue }] }]}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
          </Text>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'login' && styles.activeToggle]}
            onPress={() => setMode('login')}
          >
            <Text
              style={[
                styles.toggleText,
                mode === 'login' && styles.activeToggleText,
              ]}
            >
              {t('auth.login')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'signup' && styles.activeToggle]}
            onPress={() => setMode('signup')}>
            <Text
              style={[
                styles.toggleText,
                mode === 'signup' && styles.activeToggleText,
              ]}
            >
              {t('auth.signup')}
            </Text>
          </TouchableOpacity>
        </View>

        <AuthForm mode={mode} />
      </Animated.ScrollView>
    </LinearGradient>
  );
}