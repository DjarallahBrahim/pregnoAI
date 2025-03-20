import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { triggerVibration } from '@/utils/haptics'; // Import your vibration utility

const HospitalAlert = () => {
  const [isVisible, setIsVisible] = useState(true);
  const slideAnim = React.useRef(new Animated.Value(-300)).current; // Slide-in animation from left

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
      triggerVibration(2500);
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <Ionicons name="medkit" size={32} color="#d9534f" style={styles.icon} />
      <Text style={styles.text}>
        Il est le temps pour vous d'aller à l'hôpital. Prenez vos documents, votre sac et appelez un moyen de transport.
      </Text>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close-circle" size={24} color="gray" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    position: 'relative',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
});

export default HospitalAlert;
