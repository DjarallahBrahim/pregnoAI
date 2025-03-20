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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import Animated, { FadeIn, SlideInLeft  } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import HospitalAlert from '@/components/mom-features/contractionTracker/HospitalAlert';
import { triggerSelectionAsyncVibration } from '@/utils/haptics'; // Import your vibration utility
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

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

export default function ContractionTrackerScreen() {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeContraction, setActiveContraction] = useState<Contraction | null>(null);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastEndedContractionRef = useRef<Contraction | null>(null);

  // Calculate statistics
  const contractionStats = useMemo(() => {
    // Total number of contractions (including active)
    const totalCount = contractions.length + (activeContraction ? 1 : 0);
    
    // Average contraction duration
    let avgDuration = 0;
    if (contractions.length > 0) {
      const totalDuration = contractions.reduce((sum, contraction) => sum + contraction.duration, 0);
      avgDuration = Math.round(totalDuration / contractions.length);
    }
    
    // Average rest time
    let avgRestTime = 0;
    const contractionsWithRestTime = contractions.filter(c => c.restTime !== undefined);
    if (contractionsWithRestTime.length > 0) {
      const totalRestTime = contractionsWithRestTime.reduce(
        (sum, contraction) => sum + (contraction.restTime || 0), 
        0
      );
      avgRestTime = Math.round(totalRestTime / contractionsWithRestTime.length);
    }
    
    return {
      totalCount,
      avgDuration,
      avgRestTime
    };
  }, [contractions, activeContraction]);
  //  logic to determine when to display the alert hospital
  const shouldShowHospitalAlert = useMemo(() => {
    // Check if there are enough contractions to make a meaningful calculation
    if (contractions.length < 3) return false;
    
    // Check if average rest time is 2 minutes (120 seconds) or less
    const isContractionCloseEnough = contractionStats.avgRestTime <= 200;
    
    // Check if average duration is 1 minute (60 seconds) or more
    const isContractionLongEnough = contractionStats.avgDuration >= 55;
    
    // Show alert if both conditions are met
    return isContractionCloseEnough && isContractionLongEnough;
  }, [contractionStats.avgRestTime, contractionStats.avgDuration, contractions.length]);

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
    triggerSelectionAsyncVibration();
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
        </View>
      </View>
    );
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>{t('momFeatures.contractionTracker.modalTitle')}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{contractionStats.totalCount}</Text>
            <Text style={styles.statLabel}>{t('momFeatures.contractionTracker.totalContractionCount')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {contractionStats.avgDuration > 0 ? formatTimeMMSS(contractionStats.avgDuration) : '0'}
            </Text>
            <Text style={styles.statLabel}>{t('momFeatures.contractionTracker.avgDuration')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {contractionStats.avgRestTime > 0 ? formatTimeMMSS(contractionStats.avgRestTime) : '0'}
            </Text>
            <Text style={styles.statLabel}>{t('momFeatures.contractionTracker.avgRestTime')}</Text>
          </View>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.text}>{t('momFeatures.contractionTracker.contrcTimerTitle')}</Text>
          <Text style={styles.text}>{t('momFeatures.contractionTracker.resteTimerTitle')}</Text>
        </View>
     
        {/* Empty state message */}
        {contractions.length === 0 && !activeContraction && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              {t('momFeatures.contractionTracker.emptyStateMessage')}
            </Text>
          </View>
        )}

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
        {shouldShowHospitalAlert && (
          <Animated.View
          entering={SlideInLeft.duration(600).springify()}
          style={styles.alertContainer}
          >
            <HospitalAlert />
          </Animated.View>
        )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: 40, // Same width as back button for balanced layout
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B98',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  titleContainer:{
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Add space between the texts
    alignItems: 'center', // Align items vertically in the center
    paddingHorizontal: 32, // Add horizontal padding
    paddingBottom: 12, // Add vertical padding
  },
  text: {
    fontSize: 14, // Optional: Adjust font size
    fontWeight: '500', // Optional: Make text bold
    color: theme.colors.text.secondary,
  },
  alertContainer: {
    marginBottom: 16,
  },
});