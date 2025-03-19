import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useHeaderHeight } from "@react-navigation/elements"
import { supabase } from '@/lib/supabase';

import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { authFormStyles as styles } from '@/styles/authForm.styles';


const usernameSchema = z.string().min(3).max(20);
const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { t } = useLanguage();
  const { signIn, signUp, resetPassword, loading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isResetMode, setIsResetMode] = useState(false);
  const headerHeight = useHeaderHeight()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (error) {
      newErrors.email = email === '' ? t('auth.emailRequired') : t('auth.emailInvalid');
    }

    try {
      passwordSchema.parse(password);
    } catch (error) {
      if (password === '') {
        newErrors.password = t('auth.passwordRequired');
      } else if (password.length < 8) {
        newErrors.password = t('auth.passwordMinLength');
      } else {
        newErrors.password = t('auth.passwordRequirements');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setErrors({});
    try {
      let result;
      if (mode === 'login') {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, username);
      }

      if (result?.session) {
        // Check if user has already completed onboarding
        const { data: profiles, error } = await supabase
          .from('pregnancy_profiles')
          .select('id')
          .eq('user_id', result.session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (profiles?.id) {
          router.replace('/(tabs)/baby');
        } else {
          router.replace('/onboarding');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  const handleForgotPassword = async () => {
    setIsResetMode(true);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrors({ email: t('auth.emailRequired') });
      return;
    }

    try {
      emailSchema.parse(email);
    } catch (error) {
      setErrors({ email: t('auth.emailInvalid') });
      return;
    }

    const success = await resetPassword(email);
    if (success) {
      alert(t('auth.resetPasswordEmailSent'));
      setIsResetMode(false);
    }
  };

  return (
    <View style={styles.form}>
        
        {mode === 'signup' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.username')}</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              value={username}
              onChangeText={setUsername}
              placeholder={t('auth.usernamePlaceholder')}
              autoCapitalize="none"
              autoComplete="username"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('auth.email')}</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          
          
        </View>

        {!isResetMode && <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('auth.password')}</Text>
          <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color={theme.colors.text.secondary}
              />
            </Pressable>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          
          {mode === 'login' && (
            <>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotPassword, styles.mt2]}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>
              
            </>
          )}
        </View>}
        
        {authError.general && (
          <Text style={styles.errorText}>{authError.general}</Text>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={isResetMode ? handleResetPassword : handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? '...' : isResetMode ? t('auth.resetPassword') : mode === 'login' ? t('auth.login') : t('auth.signup')}
          </Text>
        </TouchableOpacity>
        {isResetMode && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsResetMode(false)}
          >
            <Text style={styles.backButtonText}>{t('auth.backToLogin')}</Text>
          </TouchableOpacity>
        )}
      </View>
  );
}