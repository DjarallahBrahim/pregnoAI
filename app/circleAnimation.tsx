import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '@/styles/theme';

export default function circleAnimationScreen() {
  // Animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateValue = useRef(new Animated.Value(0)).current;
  const radiusValue = useRef(new Animated.Value(0)).current;
  // Removed rotateValue since we're removing rotation animation

  // Animation state
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);
  const hapticTimersRef = useRef([]);
  
  // Animation phase tracker
  const [isBreathingIn, setIsBreathingIn] = useState(false);

  // Monitor animation phase changes
  useEffect(() => {
    // Only set up haptic feedback when breathing in
    if (isBreathingIn && !isPaused) {
      setupBreathInHaptics();
    } else {
      // Clear any existing haptic timers when not breathing in
      clearAllHapticTimers();
    }
  }, [isBreathingIn, isPaused]);

  // Function to trigger a gentle haptic feedback
  const triggerHaptic = (intensity = Haptics.ImpactFeedbackStyle.Light) => {
    // Only trigger if we're not paused and in breath-in phase
    if (!isPaused && isBreathingIn) {
      Haptics.impactAsync(intensity);
    }
  };

  // Clear all haptic timers for cleanup
  const clearAllHapticTimers = () => {
    hapticTimersRef.current.forEach(timer => clearTimeout(timer));
    hapticTimersRef.current = [];
  };

  // Set up haptic pattern specifically for the breath-in phase
  const setupBreathInHaptics = () => {
    clearAllHapticTimers();
    
    // Create a rapid vibration pattern that gets slower toward the end
    // First 4 seconds: fast vibrations (zzzzz,zzzzz,zzzzz,zzzzz)
    // Last 1 second: decreasing vibrations (zzz,zz,z)
    
    // Fast vibrations (first 4 seconds)
    const fastVibrationIntervals = 100; // 100ms between vibrations
    const fastVibrationDuration = 4000; // 4 seconds of fast vibrations
    const numFastVibrations = Math.floor(fastVibrationDuration / fastVibrationIntervals);
    
    for (let i = 0; i < numFastVibrations; i++) {
      const timerId = setTimeout(() => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      }, i * fastVibrationIntervals);
      hapticTimersRef.current.push(timerId);
    }
    
    // Decreasing vibrations (last 1 second)
    // "zzz" - three medium-spaced vibrations
    const zzzStart = fastVibrationDuration;
    for (let i = 0; i < 3; i++) {
      const timerId = setTimeout(() => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      }, zzzStart + (i * 60));
      hapticTimersRef.current.push(timerId);
    }
    
    // "zz" - two widely-spaced vibrations
    const zzStart = zzzStart + 250;
    for (let i = 0; i < 2; i++) {
      const timerId = setTimeout(() => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      }, zzStart + (i * 100));
      hapticTimersRef.current.push(timerId);
    }
    
    // "z" - final single vibration
    const zStart = zzStart + 300;
    const finalTimerId = setTimeout(() => {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
    }, zStart);
    hapticTimersRef.current.push(finalTimerId);
  };

  // Create the pulse animation
  const createPulseAnimation = () => {
    // Create the animation sequence
    const sequence = Animated.loop(
      Animated.sequence([
        // Breathing in phase
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 3,
            duration: 5000, // 5 seconds for breathing in
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(translateValue, {
            toValue: 5,
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(radiusValue, {
            toValue: 1.5,
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          // Removed rotation animation
        ]),
        // Breathing out phase
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 3000, // 3 seconds for breathing out
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(translateValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(radiusValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          // Removed rotation animation
        ]),
      ]),
      { iterations: -1 }
    );

    // Set up phase change detection
    sequence.start(({ finished }) => {
      if (finished) return;
    });

    // Set up a timer to toggle the breathing phase
    const setupPhaseToggle = () => {
      // Clear previous timers
      clearTimeout(breathInPhaseTimerId);
      clearTimeout(breathOutPhaseTimerId);
      
      // Switch to breathing in
      setIsBreathingIn(true);
      
      // Set timer to switch to breathing out after 5 seconds
      breathInPhaseTimerId = setTimeout(() => {
        if (!isPaused) {
          setIsBreathingIn(false);
          
          // Set timer to switch back to breathing in after 3 seconds
          breathOutPhaseTimerId = setTimeout(() => {
            if (!isPaused) {
              setupPhaseToggle();
            }
          }, 3000);
        }
      }, 5000);
    };

    let breathInPhaseTimerId;
    let breathOutPhaseTimerId;
    
    // Start the phase toggle
    setupPhaseToggle();
    
    return sequence;
  };

  // Start animation on component mount
  useEffect(() => {
    startAnimation();
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      clearAllHapticTimers();
    };
  }, []);

  // Animation control functions
  const startAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    setIsPaused(false);
    setIsBreathingIn(true);
    animationRef.current = createPulseAnimation();
  };

  const pauseAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    setIsPaused(true);
    clearAllHapticTimers();
  };

  const resetAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    clearAllHapticTimers();
    scaleValue.setValue(1);
    translateValue.setValue(0);
    radiusValue.setValue(0);
    // Removed rotateValue.setValue(0)
    
    setTimeout(() => {
      startAnimation();
    }, 10);
  };

  // Get transform styles based on animation values
  // Simplified to use perfect circles instead of complex border radius
  const getTransformStyle = (scale, translateDirection = 'x') => {
    return {
      transform: [
        { scale: scaleValue.interpolate({
          inputRange: [1, 3],
          outputRange: [1, scale],
        })},
        translateDirection === 'x'
          ? { translateX: translateValue }
          : { translateY: translateValue },
        // Removed rotation, skewX and skewY transformations
      ],
      // Using fixed 50% border radius for perfect circles
      borderRadius: 50,
    };
  };

  return (
    <LinearGradient colors={[theme.colors.background.darklight, theme.colors.background.dark]} style={styles.container}>
      <Text style={styles.phaseText}>
        {isBreathingIn ? "Breathing In" : "Breathing Out"}
      </Text>
      
      <View style={styles.circleContainer}>
        {/* Using LinearGradient from expo-linear-gradient for the circles */}
        <Animated.View style={[styles.circle, styles.outerCircle, getTransformStyle(12, 'y')]}>
          <LinearGradient
            colors={['rgba(255,160,180,1)', 'rgba(255,190,150,1)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View style={[styles.circle, styles.middleCircle, getTransformStyle(9, 'y')]}>
          <LinearGradient
            colors={['rgba(255,175,190,1)', 'rgba(255,205,170,1)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View style={[styles.circle, styles.innerCircle, getTransformStyle(7, 'y')]}>
          <LinearGradient
            colors={['rgba(255,210,220,1)', 'rgba(255,225,200,1)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View style={[styles.circle, styles.highlight, getTransformStyle(5, 'x')]}>
          <LinearGradient
            colors={['rgba(255,240,245,0.85)', 'rgba(255,245,230,0.85)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.button, isPaused && styles.disabledButton]}
          onPress={pauseAnimation}
          disabled={isPaused}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </Pressable>

        <Pressable
          style={[styles.button, !isPaused && styles.disabledButton]}
          onPress={startAnimation}
          disabled={!isPaused}
        >
          <Text style={styles.buttonText}>Play</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={resetAnimation}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.dark,
  },
  phaseText: {
    color: theme.colors.text.primary,
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '500',
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    overflow: 'hidden',
  },
  outerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  middleCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  highlight: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    backgroundColor: theme.colors.background.tertiary,
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: 16,
  },
});