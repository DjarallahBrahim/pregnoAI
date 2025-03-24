import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2;

// Generate particles in a spherical pattern
const generateParticles = (count, baseDistance) => {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    // Create spherical distribution
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
      // Add a slight randomization to the initial positions
      distanceFactor: 0.9 + Math.random() * 0.2, // 0.9-1.1 variation
    });
  }
  return particles;
};

export default function breathingScreen() {
  // Base distance will be animated for breathing effect
  const baseDistance = useRef(new Animated.Value(50)).current;
  const [particles, setParticles] = useState(() => generateParticles(200, 50));
  const [isBreathing, setIsBreathing] = useState(true);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const animationRef = useRef(null);
  const breathingRef = useRef(null);
  const timerRef = useRef(null);
  
  // Setup breathing animation
  const startBreathingAnimation = () => {
    // Clear any existing animations
    if (breathingRef.current) {
      breathingRef.current.stop();
    }
    
    const breathingSequence = () => {
      // Inhale animation (expand)
      setBreathPhase('inhale');
      setSecondsRemaining(4);
      Animated.timing(baseDistance, {
        toValue: 150, // Expand to larger size
        duration: 4000, // 4 seconds inhale
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && isBreathing) {
          // Hold breath animation
          setBreathPhase('hold');
          setSecondsRemaining(2);
          Animated.timing(baseDistance, {
            toValue: 150, // Keep at expanded size
            duration: 2000, // 2 seconds hold
            useNativeDriver: false,
          }).start(({ finished }) => {
            if (finished && isBreathing) {
              // Exhale animation (contract)
              setBreathPhase('exhale');
              setSecondsRemaining(6);
              Animated.timing(baseDistance, {
                toValue: 50, // Contract to original size
                duration: 6000, // 6 seconds exhale
                useNativeDriver: false,
              }).start(({ finished }) => {
                if (finished && isBreathing) {
                  // Repeat the sequence
                  breathingSequence();
                }
              });
            }
          });
        }
      });
    };
    
    breathingSequence();
  };
  
  // Update timer
  useEffect(() => {
    if (isBreathing) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBreathing, breathPhase]);
  
  // Start/stop breathing
  useEffect(() => {
    if (isBreathing) {
      startBreathingAnimation();
    } else {
      if (breathingRef.current) {
        breathingRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (breathingRef.current) {
        breathingRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBreathing]);
  
  // Update particles position based on animated base distance
  useEffect(() => {
    const distanceListener = baseDistance.addListener(({ value }) => {
      setParticles(prevParticles => {
        return prevParticles.map(p => {
          const distance = value * p.distanceFactor;
          const theta = Math.acos(p.initialZ / Math.sqrt(p.initialX * p.initialX + p.initialY * p.initialY + p.initialZ * p.initialZ));
          const phi = Math.atan2(p.initialY, p.initialX);
          
          const newX = distance * Math.sin(theta) * Math.cos(phi);
          const newY = distance * Math.sin(theta) * Math.sin(phi);
          const newZ = distance * Math.cos(theta);
          
          return {
            ...p,
            x: newX,
            y: newY,
            z: newZ,
          };
        });
      });
    });
    
    // Add gentle rotation to the particles
    const rotateParticles = () => {
      const angle = Date.now() * 0.0001;
      
      setParticles(prevParticles => {
        return prevParticles.map(p => {
          // Apply slow rotation around Y axis
          const cosAngle = Math.cos(angle);
          const sinAngle = Math.sin(angle);
          
          // Matrix rotation around Y axis
          const newX = p.x * cosAngle + p.z * sinAngle;
          const newZ = -p.x * sinAngle + p.z * cosAngle;
          
          return {
            ...p,
            x: newX,
            z: newZ,
          };
        });
      });
      
      animationRef.current = requestAnimationFrame(rotateParticles);
    };
    
    animationRef.current = requestAnimationFrame(rotateParticles);
    
    return () => {
      baseDistance.removeListener(distanceListener);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Start breathing animation on component mount
  useEffect(() => {
    startBreathingAnimation();
    
    return () => {
      if (breathingRef.current) {
        breathingRef.current.stop();
      }
    };
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.particleContainer}>
        <Svg height="100%" width="100%">
          {particles.map((particle) => {
            // Calculate 2D position from 3D coordinates
            const PERSPECTIVE = 800;
            const scale = PERSPECTIVE / (PERSPECTIVE + particle.z);
            const x = particle.x * scale + CENTER_X;
            const y = particle.y * scale + CENTER_Y;
            
            // Only render particles in view
            if (x >= 0 && x <= SCREEN_WIDTH && y >= 0 && y <= SCREEN_HEIGHT) {
              const particleSize = particle.size * scale;
              const opacity = Math.min(0.8, Math.max(0.3, 1 - Math.abs(particle.z) / 300));
              
              // Change colors based on breath phase
              let color;
              if (breathPhase === 'inhale') {
                color = `rgba(100, 180, 255, ${opacity})`;  // Cool blue for inhale
              } else if (breathPhase === 'hold') {
                color = `rgba(255, 255, 255, ${opacity})`;  // White for hold
              } else {
                color = `rgba(255, 140, 100, ${opacity})`;  // Warm orange for exhale
              }
              
              return (
                <Circle
                  key={particle.id}
                  cx={x}
                  cy={y}
                  r={particleSize}
                  fill={color}
                />
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
          onPress={() => setIsBreathing(!isBreathing)}
        >
          <Text style={styles.buttonText}>
            {isBreathing ? 'Pause' : 'Start'} Breathing
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '300',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});