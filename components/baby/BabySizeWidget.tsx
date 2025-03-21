import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/styles/theme';

const BabySizeWidget = ({ currentWeek }) => {
  const router = useRouter();
  
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

  const weekRange = getWeekRange(currentWeek);
  const imageSource = getImageSource(weekRange);

  return (
    
    <TouchableOpacity
      style={[
        styles.container
      ]}
      activeOpacity={0.9}
      onPress={() => router.push('/baby-size')}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Bébé à la taille d'un/e mangue !
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.primary }]}>
          Cliquez pour voir !
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  container2: {
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
        shadowColor: theme.colors.primary,
      },
    }),
    marginHorizontal: 20,
    marginVertical: 10,
    height: 160,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
});

export default BabySizeWidget;