import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { supabase } from '@/lib/supabase';
import Svg, { Circle } from 'react-native-svg';
import { ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence, 
  FadeIn, 
  FadeOut,
} from 'react-native-reanimated';
import { BreathingScreen } from '@/app/breathing';

const { width } = Dimensions.get('window');

interface BreathingFeatureModalProps {
  isVisible: boolean;
  onClose: () => void;
}

// Maximum kicks to count
const MAX_KICKS = 50;
// Color stages - every 10 kicks, all from red family
const COLOR_STAGES = [
  '#F7A8C4',  // Light red - 0-10 kicks
  '#F37199',  // Soft red - 11-20 kicks
  '#E53888',  // Medium red - 21-30 kicks
  '#AC1754',  // Pure red - 31-40 kicks
  '#D84040',  // Deep red - 41-50 kicks
];

// Size constants - centralized for easy adjustment
const SIZING = {
  circleSize: 350,       // Overall size of the SVG container
  strokeWidth: 8,        // Width of the progress ring
  get radius() {         // Calculate radius dynamically
    return (this.circleSize / 2) - (this.strokeWidth / 2);
  },
  get imageSize() {      // Calculate image size dynamically
    return this.circleSize - (this.strokeWidth * 2);
  },
  get imageBorderRadius() { // Calculate image border radius dynamically
    return this.imageSize / 2;
  },
  get imagePosition() {  // Calculate image position dynamically
    return this.strokeWidth;
  },
  get circumference() {  // Calculate circumference dynamically
    return 2 * Math.PI * this.radius;
  }
};

export function BreathingFeatureModal({ isVisible, onClose }: BreathingFeatureModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [kicks, setKicks] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [saving, setSaving] = useState(false);
  const { session } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const { t } = useLanguage();

  // Calculate current pregnancy month when component mounts
  useEffect(() => {
    const fetchPregnancyMonth = async () => {
      if (!session?.user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('pregnancy_profiles')
          .select('last_menstrual_period')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        if (!profile?.last_menstrual_period) return;

        const lmpDate = new Date(profile.last_menstrual_period);
        const today = new Date();
        const timeDiff = today.getTime() - lmpDate.getTime();
        const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30.44)) + 1;
        
        // Ensure month is between 1 and 10
        const pregnancyMonth = Math.max(1, Math.min(10, monthsDiff));
        setCurrentMonth(pregnancyMonth);
      } catch (err) {
        console.error('Error calculating pregnancy month:', err);
      }
    };

    fetchPregnancyMonth();
  }, [session?.user]);


  const snapPoints = useMemo(() => ['70%'], []);



  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Modal visibility handler
  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

  

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.modalBackground}
    >
      <View style={styles.container}>
      <BreathingScreen enableVibration = {true}/>
      
      </View>
    </BottomSheetModal>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#E0E0E0',
    width: 40,
    height: 4,
    borderRadius: 2,
  },

});