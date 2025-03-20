import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

/**
 * Utility function to trigger a simple vibration with customizable duration
 * 
 * @param {number} duration - The vibration duration in milliseconds (default: 100)
 * 
 * Note: This uses React Native's Vibration API instead of Expo Haptics
 * because Haptics doesn't support duration-based vibration
 */
export const triggerVibration = (duration = 100) => {
  // Vibrate for the specified duration
  Vibration.vibrate(duration);
};

/**
 * Alternative function using Expo Haptics for more precise feedback types
 * This doesn't support duration but provides different impact types
 */
export const triggerHapticFeedback = (
  type = Haptics.ImpactFeedbackStyle.Medium
) => {
  Haptics.impactAsync(type);
};
export const triggerSelectionAsyncVibration = ( ) => {
    Haptics.selectionAsync()

  };
// Usage examples:
// 
// For simple vibration with default duration (100ms):
// triggerVibration();
// 
// For vibration with custom duration:
// triggerVibration(200); // 200ms vibration
// triggerVibration(500); // 500ms vibration
// 
// For haptic feedback with different intensities:
// triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Light);
// triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
// triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Heavy);