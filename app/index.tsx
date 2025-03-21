import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { WelcomeHeader } from '@/components/auth/WelcomeHeader';
import { FeaturesList } from '@/components/auth/FeaturesList';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { TermsText } from '@/components/auth/TermsText';
import { mainStyles } from '@/styles/main';
import { theme } from '@/styles/theme';


export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={theme.colors.gradients.secondary}
      style={mainStyles.gradient}
    >
      <StatusBar style="dark" />
      
      <WelcomeHeader />
      <FeaturesList />
      <AuthButtons />
      <TermsText />
    </LinearGradient>
  );
}