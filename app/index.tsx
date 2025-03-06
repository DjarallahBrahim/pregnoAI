import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { WelcomeHeader } from '@/components/auth/WelcomeHeader';
import { FeaturesList } from '@/components/auth/FeaturesList';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { TermsText } from '@/components/auth/TermsText';
import { LanguageSelector } from '@/components/LanguageSelector';
import { mainStyles } from '@/styles/main';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#F8F5E9', '#F8F5E9']}
      style={mainStyles.gradient}
    >
      <StatusBar style="dark" />
      <LanguageSelector />
      <WelcomeHeader />
      <FeaturesList />
      <AuthButtons />
      <TermsText />
    </LinearGradient>
  );
}