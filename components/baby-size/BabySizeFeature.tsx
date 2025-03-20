import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export function BabySizeFeature() {
  const { t } = useLanguage();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['rgba(255, 143, 177, 0.1)', 'rgba(255, 143, 177, 0.2)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={require('../../assets/images/mom-features/baby-size.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('momFeatures.babySize.title')}</Text>
            <Text style={styles.subtitle}>{t('momFeatures.babySize.subtitle')}</Text>
          </View>
          
          <View style={styles.badge}>
            <Ionicons name="information-circle-outline" size={12} color="#FFFFFF" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>{t('momFeatures.babySize.badge')}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 180,
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 80 },
        shadowOpacity: 0.8,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
        shadowColor: theme.colors.primary,
      },
    }),
  },
  gradient: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '50%',
    height: '50%',
    opacity: 0.8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginTop: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    opacity: 0.8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeIcon: {
    marginTop: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 