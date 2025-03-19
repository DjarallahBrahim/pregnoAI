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

const { width } = Dimensions.get('window');

interface KickCounterModalProps {
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

export function KickCounterModal({ isVisible, onClose }: KickCounterModalProps) {
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

  const handleSave = async () => {
    if (kicks > 0 && startTime && session?.user && currentMonth) {
      try {
        setSaving(true);
        const endTime = new Date();
        const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        
        const { error } = await supabase
          .from('kick_counters')
          .insert({
            user_id: session.user.id,
            kicks_count: kicks,
            duration_minutes: durationMinutes,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            pregnancy_month: currentMonth
          });

        if (error) throw error;
        
        // Reset counter after successful save
        setKicks(0);
        setStartTime(null);
        setShowMessage(false);
      } catch (err) {
        console.error('Error saving kick counter:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  // Variables
  const snapPoints = useMemo(() => ['90%'], []);

  // Animation for the progress circle
  const progressStage = Math.floor(kicks / 10); // Determine which stage we're in (0-4)
  const progressInStage = kicks % 10; // Progress within the current stage (0-9)
  const progressPercentage = (progressInStage / 10) * 100; // Percentage progress in current stage
  
  const strokeDashoffset = SIZING.circumference * (1 - progressPercentage / 100);
  
  // Get the current color based on the stage
  const currentStageColor = COLOR_STAGES[progressStage] || COLOR_STAGES[COLOR_STAGES.length - 1];

  // Calculate milestone messages
  useEffect(() => {
    // Show message at each multiple of 10 kicks
    if (kicks > 0 && kicks % 10 === 0) {
      setShowMessage(true);
    } else if (kicks % 10 !== 0) {
      setShowMessage(true);
    }
  }, [kicks]);

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

  const handleKick = () => {
    if (kicks < MAX_KICKS) {
      if (!startTime) {
        setStartTime(new Date());
      }
      setKicks(prev => prev + 1);
    }
  };

  const handleReset = async () => {
    setKicks(0);
    setStartTime(null);
    setShowMessage(false);
  };

  // Modal visibility handler
  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

  // Generate message based on current stage
  const getMessage = () => {
    const stageMessages = [
      t('momFeatures.kickCounter.activeMessage'),
      'Great progress! Keep counting those kicks!',
      'You are doing great! Baby is quite active!',
      'Excellent tracking! Keep it up!',
      'Amazing! Your baby is very active today!'
    ];
    return stageMessages[progressStage] || stageMessages[0];
  };

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
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleReset}
              disabled={saving}
            >
              <Text style={styles.buttonText}>
                {t('momFeatures.kickCounter.reset')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.buttonDisabled]} 
            onPress={handleSave}
            disabled={saving || kicks === 0}
          >
            <Text style={styles.buttonSaving}>
              {saving ? t('momFeatures.kickCounter.saving') : t('momFeatures.kickCounter.save')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.counterContainer}>
          {/* Circular progress with image background - Dynamically sized */}
          <View style={[styles.progressCircleContainer, { width: SIZING.circleSize, height: SIZING.circleSize }]}>
            {/* Image Background Container - Dynamically sized */}
            <View 
              style={[
                styles.imageBackgroundContainer, 
                {
                  width: SIZING.imageSize,
                  height: SIZING.imageSize,
                  borderRadius: SIZING.imageBorderRadius,
                  top: SIZING.imagePosition,
                  left: SIZING.imagePosition
                }
              ]}
            >
              {imageLoading && (
                <Animated.View 
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={styles.loadingContainer}
                >
                  <ActivityIndicator size="large" color={currentStageColor} />
                  <Animated.View 
                    style={[
                      styles.pulseCircle,
                      { backgroundColor: `${currentStageColor}15` }
                    ]}
                  />
                </Animated.View>
              )}
              <Image
                source={require('../../../assets/images/mom-features/babyfoot.gif')}
                style={styles.babyImage}
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
              />
            </View>
            
            {/* SVG Progress Circle - Dynamically sized */}
            <Svg 
              width={SIZING.circleSize} 
              height={SIZING.circleSize} 
              style={StyleSheet.absoluteFill}
            >
              {/* Background circle */}
              <Circle
                cx={SIZING.circleSize / 2}
                cy={SIZING.circleSize / 2}
                r={SIZING.radius}
                stroke="#FFDADA" // Light red background
                strokeWidth={SIZING.strokeWidth}
                fill="transparent"
              />
              {/* Progress circle */}
              <Circle
                cx={SIZING.circleSize / 2}
                cy={SIZING.circleSize / 2}
                r={SIZING.radius}
                stroke={currentStageColor}
                strokeWidth={SIZING.strokeWidth}
                fill="transparent"
                strokeDasharray={SIZING.circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${SIZING.circleSize / 2} ${SIZING.circleSize / 2})`}
              />
            </Svg>
          </View>

          <View style={styles.counterDisplay}>
            <Text style={[styles.kickCount, { color: currentStageColor }]}>{kicks}</Text>
            <Text style={styles.kickLabel}>{t('momFeatures.kickCounter.kicks')}</Text>
          </View>

          <TouchableOpacity
            style={[styles.kickButton, { backgroundColor: currentStageColor }]}
            onPress={handleKick}
            disabled={kicks >= MAX_KICKS}
          >
            <Text style={styles.kickButtonText}>
              {t('momFeatures.kickCounter.babyKicked')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              router.push('/kick-stats');
            }}
          >
            <View style={styles.statsButtonContainer}>
              <Text style={styles.StatsButtonText}>
                {t('momFeatures.kickCounter.statics')}
              </Text>
              <Ionicons 
                name="stats-chart" 
                size={24} 
                color={theme.colors.primary} 
                style={{ marginLeft: 8 }} // Add margin to separate text and icon
              />
            </View>
          </TouchableOpacity>

          {/* Active message container - shown at each milestone */}
          {showMessage && (
            <Animated.View 
              entering={FadeIn}
              style={styles.messageContainer}
            >
              <Text style={[styles.message, { color: currentStageColor }]}>
                {getMessage()}
              </Text>
            </Animated.View>
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 153, 255, 0.5)', 
    marginLeft: 12,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSaving: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  counterContainer: {
    alignItems: 'center',
    gap: 32,
  },
  progressCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageBackgroundContainer: {
    position: 'absolute',
    zIndex: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  babyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  counterDisplay: {
    alignItems: 'center',
    marginTop: 0,
  },
  kickCount: {
    fontSize: 48,
    fontWeight: '700',
  },
  kickLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  kickButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 18,
    width: '60%',
    alignItems: 'center',
    marginTop: 'auto',
    ...Platform.select({
      ios: {
        shadowColor: '#FF3333',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  kickButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  StatsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  statsButtonContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  }
});