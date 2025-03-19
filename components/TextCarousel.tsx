import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TextCarousel = ({ data, interval = 3000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Use a separate function to handle the index change
  const onIndexChange = (index) => {
    const adjustedIndex = index % data.length;
    setActiveIndex(adjustedIndex);
  };

  return (
    <View style={styles.container}>
      <Carousel
        loop
        autoPlay
        data={data}
        scrollAnimationDuration={1000}
        autoPlayInterval={interval}
        width={SCREEN_WIDTH * 0.8}
        height={80}
        onSnapToItem={onIndexChange}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
      
      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <Dot 
            key={index} 
            active={index === activeIndex} 
          />
        ))}
      </View>
    </View>
  );
};

// Separate component for dots with its own animation
const Dot = ({ active }) => {
  // Animation value for size and opacity
  const animatedOpacity = useSharedValue(active ? 1 : 0.5);
  const animatedSize = useSharedValue(active ? 1 : 0.5);
  
  // Update animation when active state changes
  useEffect(() => {
    animatedOpacity.value = withTiming(active ? 1 : 0.5, { duration: 150 });
    animatedSize.value = withTiming(active ? 8 : 4, { duration: 150 });
  }, [active]);
  
  // Create animated styles
  const dotStyle = useAnimatedStyle(() => {
    return {
      width: animatedSize.value,
      height: animatedSize.value,
      borderRadius: animatedSize.value / 2,
      backgroundColor: active ? 'rgba(51, 51, 51, 0.2)' : '#ccc',
      opacity: animatedOpacity.value,
      marginHorizontal: 4,
    };
  });
  
  return <Animated.View style={dotStyle} />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 3,
  }
});

export default TextCarousel;