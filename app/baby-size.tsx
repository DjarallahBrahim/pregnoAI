import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/styles/theme';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH;
const CAROUSEL_HEIGHT = 450; // Increased height for larger images

const weekRanges = [
  '1-3', '4-6', '7-9', '10-12', '13-15', '16-18', '19-21', '22-24', '25-27', '28-30', '31-33', '34-36', '37-41'
];

// Function to load local images with require()
const getImageSource = (week) => {
  const images = {
    '1-3': require('../assets/images/weeks/week-1-3.png'),
    '4-6': require('../assets/images/weeks/week-4-6.png'),
    '7-9': require('../assets/images/weeks/week-7-9.png'),
    '10-12': require('../assets/images/weeks/week-10-12.png'),
    '13-15': require('../assets/images/weeks/week-13-15.png'),
    '16-18': require('../assets/images/weeks/week-16-18.png'),
    '19-21': require('../assets/images/weeks/week-19-21.png'),
    '22-24': require('../assets/images/weeks/week-22-24.png'),
    '25-27': require('../assets/images/weeks/week-25-27.png'),
    '28-30': require('../assets/images/weeks/week-28-30.png'),
    '31-33': require('../assets/images/weeks/week-31-33.png'),
    '34-36': require('../assets/images/weeks/week-34-36.png'),
    '37-41': require('../assets/images/weeks/week-37-41.png'),
  };
  return images[week] || images['1-3']; // Default
};

const BabySizeScreen = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(weekRanges[0]);
  const carouselRef = useRef(null);
  const flatListRef = useRef(null);
  const ITEM_WIDTH = 60; // Approximate width of each week item
  
  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  // Calculate the correct centering offset
  const getItemLayout = (data, index) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });
  
  // Center the selected item in the FlatList
  const centerSelectedItem = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // This positions the item in the center
        viewOffset: 0,
      });
    }
  };
  
  // Handle selection from FlatList
  const handleWeekSelection = (index) => {
    setSelectedIndex(index);
    setSelectedWeek(weekRanges[index]);
    carouselRef.current?.scrollTo({ index });
    centerSelectedItem(index);
  };

  // Use useEffect to center the first element when the component mounts
  useEffect(() => {
    // Give time for the FlatList to render properly first
    const timer = setTimeout(() => {
      centerSelectedItem(selectedIndex);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount
  
  const renderCarouselItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.85, 1, 0.85]
      );
      
      const translateY = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [-20, 0, -20]
      );
      
      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.7, 1, 0.7]
      );
      
      return {
        transform: [{ scale }, { translateY }],
        opacity,
      };
    });

    return (
      <View style={styles.carouselItem}>
        <Animated.View style={[styles.carouselImageContainer, animatedStyle]}>
          <Image 
            source={getImageSource(item)} 
            style={styles.image} 
          />
         
        </Animated.View>
      </View>
    );
  };

  // Function to get current fruit info from i18n
  const getFruitInfo = () => {
    const weekKey = `week-${selectedWeek}`;
    return {
      name: t(`development.gallery.${weekKey}.fruits`),
      size: t(`development.gallery.${weekKey}.taille`),
      adjectif: t(`development.gallery.${weekKey}.adjectif_ou_autre_nom`),
      weight: t(`development.gallery.${weekKey}.weight`),
      changement: t(`development.gallery.${weekKey}.changement`),
    };
  };

  // Get fruit info for the selected week
  const fruitInfo = getFruitInfo();

  // Calculate appropriate horizontal padding for centering
  const horizontalPadding = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

  return (
    <LinearGradient colors={theme.colors.gradients.secondary} style={styles.gradient}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>{t('momFeatures.babySize.title')}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
      {/* FlatList of weeks with improved centering */}
      <View style={styles.weekSelectorContainer}>
        <FlatList
          ref={flatListRef}
          data={weekRanges}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          scrollToOverflowEnabled={true}
          keyExtractor={(item) => item}
          contentContainerStyle={[
            styles.flatListContainer,
            //{ paddingHorizontal: horizontalPadding }
          ]}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              onPress={() => handleWeekSelection(index)}
              style={styles.weekItem}
            >
              <Text
                style={[
                  styles.weekText,
                  index === selectedIndex && styles.selectedWeekText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          initialScrollIndex={0}
          getItemLayout={getItemLayout}
          onLayout={() => {
            // Center the initial selected item when component mounts
            setTimeout(() => centerSelectedItem(selectedIndex), 100);
          }}
        />
       <View style={styles.labelContainer}>
            <Text style={styles.weekLabel}>weeks</Text>
      </View>
      </View>
      
      {/* Carousel with Parallax effect */}
      <Carousel
        ref={carouselRef}
        data={weekRanges}
        loop={false}
        width={CAROUSEL_WIDTH}
        height={CAROUSEL_HEIGHT}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 90,
        }}
        pagingEnabled
        snapEnabled
        autoPlay={false}
        defaultIndex={selectedIndex}
        onScrollEnd={(index) => {
          setSelectedIndex(index);
          setSelectedWeek(weekRanges[index]);
          centerSelectedItem(index);
        }}
        renderItem={renderCarouselItem}
        scrollAnimationDuration={500}
      />
      
      {/* New View for Fruit Name and Size/Weight */}
      <View style={styles.fruitInfoContainer}>
        {/* Fruit Name in the middle */}
        <Text style={styles.fruitName}>{fruitInfo.name}</Text>
        
        {/* Size and Weight Stats */}
        <View style={styles.statsContainer}>
          {/* Left side - Length */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('development.size')}</Text>
            <Text style={styles.statValue}>{fruitInfo.size}</Text>
            <Text style={styles.statNote}>{fruitInfo.adjectif}</Text>
          </View>
          
          {/* Right side - Weight */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('development.weight')}</Text>
            <Text style={styles.statValue}>{fruitInfo.weight}</Text>
            <Text style={styles.statNote}>{fruitInfo.changement}</Text>

          </View>
        </View>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    marginBottom: 24
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    flex: 1,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 40, // Same width as back button for balanced layout
  },
  weekSelectorContainer: {
    height: 60, // Fixed height for the week selector
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  flatListContainer: {
    paddingVertical: 8,
    height: 60,
    // Properly disable vertical scrolling
    flexGrow: 0,
    overflow: 'hidden', // Prevent vertical scrolling
  },
  weekItem: {
    width: 60, // Fixed width for consistent layout
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedWeekText: {
    color: theme.colors.border_colored,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border_colored,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImageContainer: {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Negative margin to reduce space
  },
  image: {
    width: '95%',
    height: '95%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  labelContainer: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#4A90E2',
  },
  
  // New styles for fruit info section
  fruitInfoContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: -20,
  },
  fruitNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  fruitName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  shareButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
    margin: 5,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.secondary
    ,
  },
  statNote: {
    fontSize: 12,
    color: theme.colors.text.primary,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default BabySizeScreen;