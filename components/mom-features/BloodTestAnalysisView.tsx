import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface BloodTestAnalysisViewProps {
  analysis: string | null;
  error: string | null;
  onNewAnalysis: () => void;
}

export function BloodTestAnalysisView({ analysis, error, onNewAnalysis }: BloodTestAnalysisViewProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          
          <Text style={styles.headerTitle}>{t('momFeatures.bloodTest.analysis.title')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.newAnalysisButton}
          onPress={onNewAnalysis}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.newAnalysisText}>{t('momFeatures.bloodTest.analysis.newAnalysis')}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        
        <View style={styles.analysisCard}>
          <Text style={styles.analysisResult}>
            {analysis || error || t('momFeatures.bloodTest.analysis.noIssues')}
          </Text>
        </View>
        
        <View style={styles.disclaimerCard}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={styles.disclaimerText}>
            {t('momFeatures.bloodTest.analysis.disclaimer')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  aiText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  newAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 143, 177, 0.1)',
  },
  newAnalysisText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  analysisResult: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
    textAlign: 'left',
    whiteSpace: 'pre-line',
  },
  disclaimerCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 143, 177, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    flex: 1,
    color: theme.colors.primary,
    lineHeight: 20,
  },
});

export { BloodTestAnalysisView }