import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/styles/theme';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { HorizontalCalendar } from '@/components/baby/HorizontalCalendar';
import { DevelopmentGallery } from '@/components/baby/DevelopmentGallery';
import { ActionTimeline } from '@/components/baby/ActionTimeline';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import dayjs from 'dayjs';

const calculateWeeks = (lmpDate: Date) => {
  const today = new Date();
  const timeDiff = today.getTime() - lmpDate.getTime();
  const currentWeek = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7)) + 1;
  return Math.max(1, Math.min(41, currentWeek)); // Allow up to week 41
};

const formatDueDate = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

const getMoodEmoji = (moodIndex: number) => {
  const moods = ['😊', '😌', '😐', '😔', '😢'];
  return moods[moodIndex] || '😐';
};

export default function BabyScreen() {
  const { t } = useLanguage();
  const { profile, loading, error, fetchProfile } = useProfile();
  const insets = useSafeAreaInsets();
  const [selectedWeek, setSelectedWeek] = React.useState(0);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  React.useEffect(() => {
    if (profile?.last_menstrual_period) {
      const lmpDate = new Date(profile.last_menstrual_period);
      setSelectedWeek(calculateWeeks(lmpDate));
    }
  }, [profile?.last_menstrual_period]);

  // Ensure we're working with a proper Date object
  const dueDate = profile?.due_date ? new Date(profile.due_date) : null;
  const nickname = profile?.name || 'Mom';
  const mood = profile?.initial_mood ?? -1;

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={theme.colors.gradients.primary} style={styles.gradient}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 50 }
            ]}
          >
            <View style={styles.topBar}>
              <View>
                <Text style={styles.greeting}>{t('baby.greeting')}, {nickname}</Text>
                {dueDate && (
                  <Text style={styles.dueDate}>{t('baby.dueDate')} {formatDueDate(dueDate)}</Text>
                )}
              </View>
              <View style={styles.profileContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }}
                  style={styles.profileImage}
                />
              </View>
            </View>

            <View style={styles.calendarSection}>
              <HorizontalCalendar 
                currentWeek={selectedWeek} 
                onWeekChange={handleWeekChange} 
              />
            </View>
              <DevelopmentGallery week={selectedWeek} />
              <ActionTimeline week={selectedWeek} />

            
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function getMoodDescription(moodIndex: number): string {
  const moods = ['great', 'good', 'okay', 'not so good', 'bad'];
  return moods[moodIndex] || 'unknown';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gradients.primary[0],
  },
  gradient: {
    flex: 1,
    marginBottom: 24

  },
  scrollView: {
    flex: 1,
  },
  content: {},
  calendarSection: {
    marginTop: -10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  dueDate: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
 
});