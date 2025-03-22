import React, { useEffect, useState, useMemo } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing,
  SlideInRight,
  SlideInLeft
} from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';



const BabySizeWidget = ({ currentWeek, direction = 'forward' }) => {
  const router = useRouter();
  const { t } = useLanguage();
  // Animation setup
  const rotation = useSharedValue(0);
  
  // Determine which week range the current week falls into
  const getWeekRange = (week) => {
    const weekNum = parseInt(week, 10);
    if (weekNum >= 1 && weekNum <= 3) return '1-3';
    if (weekNum >= 4 && weekNum <= 6) return '4-6';
    if (weekNum >= 7 && weekNum <= 9) return '7-9';
    if (weekNum >= 10 && weekNum <= 12) return '10-12';
    if (weekNum >= 13 && weekNum <= 15) return '13-15';
    if (weekNum >= 16 && weekNum <= 18) return '16-18';
    if (weekNum >= 19 && weekNum <= 21) return '19-21';
    if (weekNum >= 22 && weekNum <= 24) return '22-24';
    if (weekNum >= 25 && weekNum <= 27) return '25-27';
    if (weekNum >= 28 && weekNum <= 30) return '28-30';
    if (weekNum >= 31 && weekNum <= 33) return '31-33';
    if (weekNum >= 34 && weekNum <= 36) return '34-36';
    if (weekNum >= 37 && weekNum <= 41) return '37-41';
    return '1-3'; // Default if week is invalid
  };

  // Function to load local images with require()
  const getImageSource = (week) => {
    const images = {
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
    return images[week] || images['1-3']; // Default
  };

  const weekRangeKey = useMemo(() => {
    // Handle edge cases
    if (currentWeek <= 0) return "week-1-3";
    if (currentWeek >= 37) return "week-37-41";
    
    // Calculate the week range
    const weekRange = Math.floor((currentWeek - 1) / 3) * 3 + 1;
    const endWeek = weekRange + 2;
    
    // Format the key to match the data structure
    return `week-${weekRange}-${endWeek}`;
  }, [currentWeek]);
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
  // Use useMemo to recalculate when currentWeek changes
  const weekRange = useMemo(() => getWeekRange(currentWeek), [currentWeek]);
  const imageSource = useMemo(() => getImageSource(weekRange), [weekRange]);
  
  // Set up the rotation animation
  useEffect(() => {
    // Very gentle rotation
    rotation.value = withRepeat(
      withSequence(
        withTiming(-0.025, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.025, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite repetitions
      true // reverse
    );
  }, []);

  // Create animated style for the widget with rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}rad` }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        entering={direction === 'forward' ? SlideInRight.duration(500) : SlideInLeft.duration(500)}
        key={currentWeek}
        style={[styles.animatedContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={styles.touchable}
          activeOpacity={0.9}
          onPress={() => {
            router.push({ pathname: '/baby-size', params: { weekrange: weekRange, } });
          }}
          
        >
          <LinearGradient
            colors={theme.colors.gradients.tertiary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
          <View style={styles.textContainer}>
            <Text style={styles.title}>
            {t('development.fruitComparison')} {weekData.fruits} !
            </Text>
            <Text style={styles.subtitle}>
              {t('development.clickToSee')}
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 5,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  animatedContainer: {
    width: '100%',
  },
  touchable: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    
  },
  gradient: {
    width: '100%',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingVertical: 10,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#674A6F',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#674A6F',
    opacity: 0.85,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 0,
    
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});

export default BabySizeWidget;