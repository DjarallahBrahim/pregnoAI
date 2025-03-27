import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

// Generate particles in a spherical pattern
const generateParticles = (count, baseDistance) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(Math.random() * 2 - 1);
    const phi = Math.random() * 2 * Math.PI;
    const x = baseDistance * Math.sin(theta) * Math.cos(phi);
    const y = baseDistance * Math.sin(theta) * Math.sin(phi);
    const z = baseDistance * Math.cos(theta);
    particles.push({
      id: i,
      initialX: x,
      initialY: y,
      initialZ: z,
      x,
      y,
      z,
      size: Math.random() * 1.5 + 1,
      distanceFactor: 0.9 + Math.random() * 0.2,
    });
  }
  return particles;
};
const BreathingScreen = ({ enableVibration = false }) =>  {
  // Animated value controlling the breathing "zoom"
  const baseDistance = useRef(new Animated.Value(50)).current;
  const [particles, setParticles] = useState(() => generateParticles(200, 50));
  const [isBreathing, setIsBreathing] = useState(true);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);

  // Refs for animation, timer, and haptic timeouts
  const breathingRef = useRef(null);
  const timerRef = useRef(null);
  const hapticTimersRef = useRef([]);
  const mounted = useRef(true);

  // Trigger haptic feedback (only if vibration is enabled)
  const triggerHaptic = (style) => {
    if (!enableVibration) return;
    try {
      Haptics.impactAsync(style);
    } catch (error) {
      console.log('Haptic error:', error);
    }
  };

  // Clear any pending haptic timers
  const clearAllHapticTimers = () => {
    hapticTimersRef.current.forEach(timerId => clearTimeout(timerId));
    hapticTimersRef.current = [];
  };

  // Setup inhale haptics for the 4 second zoom in phase
  const setupInhaleHaptics = () => {
    clearAllHapticTimers();
    if (!enableVibration) return;
    const interval = 100; // every 100ms
    const duration = 4000;
    const numVibrations = Math.floor(duration / interval);
    for (let i = 0; i < numVibrations; i++) {
      const timerId = setTimeout(() => {
        if (mounted.current && isBreathing) {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        }
      }, i * interval);
      hapticTimersRef.current.push(timerId);
    }
  };

  // Start the breathing cycle: 4s inhale then 3s exhale with no pause
  const startBreathingAnimation = () => {
    if (!mounted.current || !isBreathing) return;

    // Inhale: Zoom in from 50 to 150 over 4 seconds (with haptics)
    setBreathPhase('inhale');
    setSecondsRemaining(4);
    setupInhaleHaptics();
    breathingRef.current = Animated.timing(baseDistance, {
      toValue: 150,
      duration: 4000,
      useNativeDriver: false,
    });
    breathingRef.current.start(({ finished }) => {
      if (finished && mounted.current && isBreathing) {
        // Exhale: Zoom out from 150 back to 50 over 3 seconds (no haptics)
        setBreathPhase('exhale');
        setSecondsRemaining(3);
        clearAllHapticTimers();
        breathingRef.current = Animated.timing(baseDistance, {
          toValue: 50,
          duration: 3000,
          useNativeDriver: false,
        });
        breathingRef.current.start(({ finished }) => {
          if (finished && mounted.current && isBreathing) {
            startBreathingAnimation(); // loop
          }
        });
      }
    });
  };

  // Update the secondsRemaining counter every second
  useEffect(() => {
    if (isBreathing) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathing, breathPhase]);

  // Start/stop breathing animation when isBreathing changes
  useEffect(() => {
    if (isBreathing) {
      startBreathingAnimation();
    } else {
      // Pause: stop current animation and clear haptics and timers
      if (breathingRef.current) breathingRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      clearAllHapticTimers();
    }
    return () => {
      if (breathingRef.current) breathingRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      clearAllHapticTimers();
    };
  }, [isBreathing]);

  // Update particles' positions when baseDistance changes
  useEffect(() => {
    const distanceListener = baseDistance.addListener(({ value }) => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          const distance = value * p.distanceFactor;
          const totalInitialDistance = Math.sqrt(
            p.initialX ** 2 + p.initialY ** 2 + p.initialZ ** 2
          );
          const theta = Math.acos(p.initialZ / totalInitialDistance);
          const phi = Math.atan2(p.initialY, p.initialX);
          const newX = distance * Math.sin(theta) * Math.cos(phi);
          const newY = distance * Math.sin(theta) * Math.sin(phi);
          const newZ = distance * Math.cos(theta);
          return { ...p, x: newX, y: newY, z: newZ };
        })
      );
    });
    return () => {
      baseDistance.removeListener(distanceListener);
    };
  }, [baseDistance]);

  // Rotate particles only when breathing is active
  useEffect(() => {
    let frame;
    const rotateParticles = () => {
      if (!isBreathing) return; // do not rotate if paused
      const angle = Date.now() * 0.0001;
      setParticles(prevParticles =>
        prevParticles.map(p => {
          const cosAngle = Math.cos(angle);
          const sinAngle = Math.sin(angle);
          const newX = p.x * cosAngle + p.z * sinAngle;
          const newZ = -p.x * sinAngle + p.z * cosAngle;
          return { ...p, x: newX, z: newZ };
        })
      );
      frame = requestAnimationFrame(rotateParticles);
    };
    if (isBreathing) {
      frame = requestAnimationFrame(rotateParticles);
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isBreathing]);

  // Setup mounted flag and start breathing on mount
  useEffect(() => {
    mounted.current = true;
    if (isBreathing) startBreathingAnimation();
    return () => {
      mounted.current = false;
      if (breathingRef.current) breathingRef.current.stop();
      clearAllHapticTimers();
    };
  }, []);

  return (
    <LinearGradient colors={[theme.colors.background.darklight, theme.colors.background.dark]} style={styles.container}>
      <View style={styles.particleContainer}>
        <Svg height="100%" width="100%">
          {particles.map(particle => {
            // Calculate 2D position from 3D coordinates with perspective
            const PERSPECTIVE = 800;
            const scale = PERSPECTIVE / (PERSPECTIVE + particle.z);
            const x = particle.x * scale + CENTER_X;
            const y = particle.y * scale + CENTER_Y;
            if (x >= 0 && x <= SCREEN_WIDTH && y >= 0 && y <= SCREEN_HEIGHT) {
              const particleSize = particle.size * scale;
              const opacity = Math.min(0.8, Math.max(0.3, 1 - Math.abs(particle.z) / 300));
              let color =
                breathPhase === 'inhale'
                  ? `rgba(100, 180, 255, ${opacity})`
                  : `rgba(255, 140, 100, ${opacity})`;
              return (
                <Circle key={particle.id} cx={x} cy={y} r={particleSize} fill={color} />
              );
            }
            return null;
          })}
        </Svg>
      </View>
      <View style={styles.controlsContainer}>
        <Text style={styles.phaseText}>
          {breathPhase.toUpperCase()} {secondsRemaining}s
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsBreathing(prev => !prev)}
        >
          <Text style={styles.buttonText}>
            {isBreathing ? 'Pause' : 'Start'} Breathing
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  phaseText: {
    color: theme.colors.text.primary,
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '300',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.lg,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: 18,
  },
});
export default BreathingScreen;