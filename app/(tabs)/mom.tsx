import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/styles/theme';
import { BloodTestFeature } from '@/components/mom-features/BloodTestFeature';
import { KickCounterFeature } from '@/components/mom-features/kickcounter/KickCounterFeature';
import { ContractionTrackerFeature } from '@/components/mom-features/contractionTracker/ContractionTrackerFeature';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MomScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={theme.colors.gradients.primary} style={styles.gradient}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom,
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('momFeatures.screen.title')}</Text>
          <Text style={styles.subtitle}>{t('momFeatures.screen.subtitle')}</Text>
        </View>

        <View style={styles.featuresGrid}>
          <BloodTestFeature />
          <View style={styles.featureSpacing} />
          <KickCounterFeature />
        </View>
        
        <View style={[styles.featuresGrid, styles.rowSpacing]}>
          <ContractionTrackerFeature />
          <View style={styles.featureSpacing} />
          <View style={styles.emptyFeature} />
        </View>
        
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gradients.primary[0],
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  featuresGrid: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  featureSpacing: {
    width: 16,
  },
  rowSpacing: {
    marginTop: 16,
  },
  emptyFeature: {
    flex: 1,
    minHeight: 180,
    margin: 8,
  },
});