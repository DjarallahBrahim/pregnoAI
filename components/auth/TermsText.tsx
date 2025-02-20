import React from 'react';
import { Text } from 'react-native';
import { styles } from '@/styles/main';
import { useLanguage } from '@/contexts/LanguageContext';

export function TermsText() {
    const { t } = useLanguage();

  return (
    <Text style={styles.terms}>
      {t('auth.terms')}{'\n'}
      <Text style={styles.link}>{t('auth.termsLink')}</Text> {t('auth.and')}{' '}
      <Text style={styles.link}>{t('auth.privacyLink')}</Text>
    </Text>
  );
}