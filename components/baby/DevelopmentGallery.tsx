import React, { useMemo, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, Text, Platform, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 20; // 20px padding on each side
const IMAGE_HEIGHT = IMAGE_WIDTH;

// Static mapping of week ranges to image requires
const weekImages = {
  '1-3': require('../../assets/images/weeks/week-1-3.png'),
  '4-6': require('../../assets/images/weeks/week-4-6.png'),
  '7-9': require('../../assets/images/weeks/week-7-9.png'),
  '10-12': require('../../assets/images/weeks/week-10-12.png'),
  '13-15': require('../../assets/images/weeks/week-13-15.png'),
  '16-18': require('../../assets/images/weeks/week-16-18.png'),
  '19-21': require('../../assets/images/weeks/week-19-21.png'),
  '22-24': require('../../assets/images/weeks/week-22-24.png'),
  '25-27': require('../../assets/images/weeks/week-25-27.png'),
  '28-30': require('../../assets/images/weeks/week-28-30.png'),
  '31-33': require('../../assets/images/weeks/week-31-33.png'),
  '34-36': require('../../assets/images/weeks/week-34-36.png'),
  '37-41': require('../../assets/images/weeks/week-37-41.png'),
};

interface DevelopmentGalleryProps {
  week: number;
}

export function DevelopmentGallery({ week }: DevelopmentGalleryProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const { t } = useLanguage();

  // Calculate which image to show based on the current week
  const imageData = useMemo(() => {
    const weekRange = Math.floor((week - 1) / 3) * 3 + 1;
    let endWeek = weekRange + 2;
    
    // Special handling for the final weeks
    if (week >= 37) {
      return {
        source: weekImages['37-41'],
        weekRange: 'Weeks 37-41',
        alt: 'Baby development visualization for weeks 37 to 41'
      };
    }
    
    const rangeKey = `${weekRange}-${endWeek}` as keyof typeof weekImages;
    
    return {
      source: weekImages[rangeKey],
      weekRange: `Weeks ${weekRange}-${endWeek}`,
      alt: `Baby development visualization for weeks ${weekRange} to ${endWeek}`
    };
  }, [week]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadSuccess = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    setLoading(false);
    setError('Failed to load development image');
  };

  const weekRangeKey = useMemo(() => {
    // Handle edge cases
    if (week <= 0) return "week-1-3";
    if (week >= 37) return "week-37-41";
    
    // Calculate the week range
    const weekRange = Math.floor((week - 1) / 3) * 3 + 1;
    const endWeek = weekRange + 2;
    
    // Format the key to match the data structure
    return `week-${weekRange}-${endWeek}`;
  }, [week]);

  // Update weekData to use translations
  const weekData = useMemo(() => {
    try {
      return {
        fruits: t(`development.gallery.${weekRangeKey}.fruits`),
        taille: t(`development.gallery.${weekRangeKey}.taille`),
        adjectif_ou_autre_nom: t(`development.gallery.${weekRangeKey}.adjectif_ou_autre_nom`),
        changement: t(`development.gallery.${weekRangeKey}.changement`)
      };
    } catch (e) {
      // Fallback to first week if translation is missing
      return {
        fruits: t('development.gallery.week-1-3.fruits'),
        taille: t('development.gallery.week-1-3.taille'),
        adjectif_ou_autre_nom: t('development.gallery.week-1-3.adjectif_ou_autre_nom'),
        changement: t('development.gallery.week-1-3.changement')
      };
    }
  }, [weekRangeKey, t]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.aiTitle}>{t('development.aiImageTitle')}</Text>
      
      <Animated.View 
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.imageContainer}
      >
        <Image
          source={imageData.source}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={handleLoadStart}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
          accessible={true}
          accessibilityLabel={imageData.alt}
        />

        
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {!loading && !error && (
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={toggleInfo}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={showInfo ? "close-circle" : "information-circle"} 
              size={22} 
              color="white" 
            />
          </TouchableOpacity>
        )}
             
        {!loading && !error && showInfo && (
          <>
            <LinearGradient
              colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)']}
              style={styles.gradient}
            />
            <View style={styles.infoOverlay}>
              <Animated.View 
                entering={FadeIn.duration(300)}
                style={styles.infoContent}
              >
                <View style={styles.infoRow}>
                  <View>
                    <Text style={styles.infoLabel}>{t('development.fruitComparison')}</Text>
                    <Text style={styles.infoValue}>{weekData.fruits}</Text>
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>{t('development.size')}</Text>
                    <Text style={styles.infoValue}>{weekData.taille}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.infoLabel}>{t('development.keyChanges')}</Text>
                  <Text style={styles.infoValue}>{weekData.changement}</Text>
                </View>
              </Animated.View>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT-20,
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: 14,
  },

  infoButton: {
    position: 'absolute',
    bottom: 5,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 5,
  },
  infoContent: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'left',
    marginBottom: 10,
  },
});