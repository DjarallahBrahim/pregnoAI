import React, {useRef, useEffect} from 'react';
import {Animated, Dimensions, Easing, StyleSheet, View} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const {width} = Dimensions.get('window');

const initialDiameter = 100; // Small circle (4cm approx)
const expandedDiameter = 150; // Large circle (6cm approx)
const NUM_CIRCLES = 6;
const maxRadius = expandedDiameter * 0.5;

const flowersAnimationScreen = () => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 6000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 3000,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const animatedDiameter = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [initialDiameter, expandedDiameter],
  });

  const animatedBorderRadius = animatedDiameter.interpolate({
    inputRange: [initialDiameter, expandedDiameter],
    outputRange: [initialDiameter / 2, expandedDiameter / 2],
  });

  const translateOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxRadius],
  });

  const glowOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <LinearGradient colors={['#FF8FB1', '#080808']} style={styles.container}>
      {Array.from({length: NUM_CIRCLES}).map((_, i) => {
        const angle = (i * (360 / NUM_CIRCLES)) * (Math.PI / 180);

        return (
          <Animated.View
            key={i}
            style={[
              styles.circle,
              {
                width: animatedDiameter,
                height: animatedDiameter,
                borderRadius: animatedBorderRadius,
                opacity: glowOpacity,
                transform: [
                  {translateX: Animated.multiply(translateOffset, Math.cos(angle))},
                  {translateY: Animated.multiply(translateOffset, Math.sin(angle))},
                ],
              },
            ]}
          >
            {/* Gradient Effect */}
            <LinearGradient
              colors={['rgba(0, 255, 200, 0.4)', 'rgba(0, 100, 200, 0.5)']}
              start={{x: 0.5, y: 0.1}}
              end={{x: 0.5, y: 1}}
              style={styles.gradient}
            />
          </Animated.View>
        );
      })}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ffc8',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 100,
    
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100, // Ensure it maintains circular shape
  },
});

export default flowersAnimationScreen;