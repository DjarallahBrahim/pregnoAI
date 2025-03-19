import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ContractionTrackerModalProps {
  isVisible: boolean;
  onClose: () => void;
}

type Contraction = {
  id: number;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  restTime?: number; // rest time after this contraction
};

// Utility functions defined outside component to avoid scope issues
const formatTimeMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const formatTimeHHMM = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function ContractionTrackerModal({ isVisible, onClose }: ContractionTrackerModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { t } = useLanguage();
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeContraction, setActiveContraction] = useState<Contraction | null>(null);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastEndedContractionRef = useRef<Contraction | null>(null);

  // Variables
  const snapPoints = useMemo(() => ['90%'], []);

  // Helper function to reset all state
  const resetState = useCallback(() => {
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset all state values
    setContractions([]);
    setActiveContraction(null);
    setTimer(0);
    setRestTimer(0);
    lastEndedContractionRef.current = null;
  }, []);

  // Start a new contraction
  const startContraction = () => {
    if (activeContraction) return; // Prevent multiple active contractions
    
    // If there was a previous contraction, update its rest time with current restTimer
    if (contractions.length > 0 && lastEndedContractionRef.current) {
      const updatedContractions = [...contractions];
      const firstContraction = updatedContractions.find(
        c => c.id === lastEndedContractionRef.current?.id
      );
      
      if (firstContraction) {
        firstContraction.restTime = restTimer;
        setContractions(updatedContractions);
      }
    }
    
    const newContraction = {
      id: contractions.length + 1,
      startTime: new Date(),
      endTime: null,
      duration: 0
    };
    
    setActiveContraction(newContraction);
    setTimer(0);
    
    // Start the timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  // End the current contraction
  const endContraction = () => {
    if (!activeContraction) return;
    
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeContraction.startTime.getTime()) / 1000);
    
    const updatedContraction = {
      ...activeContraction,
      endTime,
      duration
    };
    
    // Store the contraction
    setContractions(prev => [updatedContraction, ...prev]);
    lastEndedContractionRef.current = updatedContraction;
    setActiveContraction(null);
    
    // Stop the contraction timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Start the rest timer from the contraction duration
    setRestTimer(duration);
    timerRef.current = setInterval(() => {
      setRestTimer(prev => prev + 1);
    }, 1000);
  };

  // Modal presentation handlers
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      // Reset all state when bottom sheet is closed
      resetState();
      // Call the parent component's onClose callback
      onClose();
    }
  }, [onClose, resetState]);

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

  // Update modal visibility
  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Determine intensity based on duration
  const getIntensity = (duration: number) => {
    if (duration < 30) return 1;
    if (duration < 60) return 2;
    return 3;
  };

  // Render timeline item
  const renderTimelineItem = ({ item, index }: { item: Contraction, index: number }) => {
    const intensity = getIntensity(item.duration);
    const isLast = index === contractions.length - 1;
    const isFirst = index === 0;
    
    // Get rest time value
    const restTimeValue = () => {
      if (isFirst && !activeContraction) {
        return formatTimeMMSS(restTimer);
      } else if (item.restTime !== undefined) {
        return formatTimeMMSS(item.restTime);
      } else {
        return '--:--';
      }
    };
    
    return (
      <View style={styles.timelineRow}>
        {/* Left side - Time & Duration */}
        <View style={styles.leftColumn}>
          <Text style={styles.timeText}>{formatTimeHHMM(item.startTime)}</Text>
          <Text style={styles.durationText}>{formatTimeMMSS(item.duration)}</Text>
        </View>

        {/* Timeline connector */}
        <View style={styles.timelineConnector}>
          <LinearGradient
            colors={['#FF92A5', '#FF6B98']}
            style={styles.timelineCircle}
          >
            <Text style={styles.timelineNumber}>{item.id}</Text>
          </LinearGradient>
          {!isLast && <View style={styles.timelineLine} />}
        </View>

        {/* Right side - Rest Time */}
        <View style={styles.rightColumn}>
          <Text style={[
            styles.intervalText, 
            isFirst && !activeContraction ? styles.restTimerText : null
          ]}>
            {restTimeValue()}
          </Text>
          <View style={styles.intensityContainer}>
            {Array.from({ length: intensity }).map((_, i) => (
              <Text key={i} style={styles.intensityDot}>●</Text>
            ))}
          </View>
        </View>
      </View>
    );
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
          <Text style={styles.title}>{t('momFeatures.contractionTracker.modalTitle')}</Text>
        </View>

        <View style={styles.timelineLabels}>
          <Text style={styles.timelineLabel}>{t('momFeatures.contractionTracker.duration')}</Text>
          <View style={{ width: 30 }} />
          <Text style={styles.timelineLabel}>{t('momFeatures.contractionTracker.restTime')}</Text>
        </View>

        {/* Active contraction */}
        {activeContraction && (
          <Animated.View entering={FadeIn} style={styles.timelineRow}>
            <View style={styles.leftColumn}>
              <Text style={styles.timeText}>{formatTimeHHMM(activeContraction.startTime)}</Text>
              <Text style={[styles.durationText, styles.activeDuration]}>
                {formatTimeMMSS(timer)}
              </Text>
            </View>
            <View style={styles.timelineConnector}>
              <LinearGradient
                colors={['#FF92A5', '#FF6B98']}
                style={[styles.timelineCircle, styles.activeCircle]}
              >
                <Text style={styles.timelineNumber}>{activeContraction.id}</Text>
              </LinearGradient>
              {contractions.length > 0 && <View style={styles.timelineLine} />}
            </View>
          </Animated.View>
        )}

        {/* Contractions timeline */}
        <FlatList
          data={contractions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTimelineItem}
          style={styles.timelineList}
          contentContainerStyle={styles.timelineContent}
        />

        {/* Action button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            activeContraction ? styles.stopButton : styles.startButton
          ]}
          onPress={activeContraction ? endContraction : startContraction}
        >
          <Ionicons 
            name={activeContraction ? "stop-circle" : "play"} 
            size={24} 
            color="white" 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>
            {activeContraction
              ? t('momFeatures.contractionTracker.stopContraction')
              : t('momFeatures.contractionTracker.startContraction')}
          </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 60,
  },
  timelineLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  timelineList: {
    flex: 1,
  },
  timelineContent: {
    paddingVertical: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  leftColumn: {
    width: 60,
    alignItems: 'flex-end',
    marginRight: 100,
  },
  rightColumn: {
    width: 60,
    marginLeft: 100,
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B98',
  },
  activeDuration: {
    color: '#FF4172',
    fontWeight: '700',
  },
  timelineConnector: {
    alignItems: 'center',
  },
  timelineCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderColor: '#F7A8C4',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  timelineNumber: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  timelineLine: {
    width: 8,
    height: 40,
    backgroundColor: 'rgba(229,152,155,0.3)',
  },
  intervalText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  restTimerText: {
    color: '#FF6B98',
    fontWeight: '700',
  },
  intensityContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  intensityDot: {
    fontSize: 14,
    color: '#FF6B98',
    marginRight: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  startButton: {
    backgroundColor: '#FF6B98',
  },
  stopButton: {
    backgroundColor: '#FF6B98',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
 