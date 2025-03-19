import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';
import { usePlanning, PlanningTask } from '@/hooks/usePlanning';

interface ActionTimelineProps {
  week: number;
}

export function ActionTimeline({ week, direction = 'forward' }: ActionTimelineProps) {
  const { t } = useLanguage();
  const { fetchTasksForWeek, loading, error } = usePlanning();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);

  // Fetch tasks when week changes
  // Update tasks when week changes
  useEffect(() => {
    const weekTasks = fetchTasksForWeek(week);
    setTasks(weekTasks);
  }, [week, fetchTasksForWeek]);
  
  // Format day number to day name
  const getDayName = (day: number): string => {
    return t('timeline.day') || 'Day';
  };

  // Format day number to date string
  const getDateString = (day: number): string => {
    return day.toString();
  };
  
  
  // Get color based on category
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'health': // English
      case 'santé': // French
        return '#A1E9C4'; // Light green
      case 'nutrition': // Both English and French
        return '#B4E3E1'; // Light teal
      case 'démarches': // French
        return '#F9C0C0'; // Light pink/salmon
      case 'prévention': // French
      case 'prevention': // English
        return '#C7CEEA'; // Light blue
      case 'couple et parentalité': // French
      case 'couple and parenting': // English
        return '#FFC2E2'; // Light pink
      case 'développement enfant': // French
      case 'child development': // English
        return '#B5EAD7'; // Mint green
      case 'beauté': // French
      case 'beauty': // English
        return '#FFB7B2'; // Light coral
      default:
        return '#E5E7EB'; // Light gray
    }
  };
  
  // Get category label based on category
  const getCategoryLabel = (category: string): string => {
    // Capitalize first letter of each word
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{t('timeline.title')}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{t('timeline.title')}</Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, styles.errorText]}>{error}</Text>
        </View>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{t('timeline.title') || 'Weekly Timeline'}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t('timeline.noActions') || 'No actions for this week.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Animated.View 
        style={styles.timelineContainer}
        entering={direction === 'forward' ? SlideInRight.duration(500) : SlideInLeft.duration(500)}

        key={week}
      >
        <Text style={styles.headerTitle}>{t('timeline.title') || 'Weekly Timeline'}</Text>
        {tasks.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.dateContainer}>
              <Text style={styles.day}>{`${getDayName(item.day)}`}</Text>
              <Text style={styles.date}>{getDateString(item.day)}</Text>
            </View>
            
            <View style={[styles.contentContainer, { borderLeftColor: getCategoryColor(item.category) }]}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{item.description}</Text>
                <TouchableOpacity style={styles.detailsButton}>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    margin: 10,
  },
  timelineContainer: {
    borderRadius: 20,
    
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  timelineItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    //backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginRight: 8,
  },
  day: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  detailsButton: {
    padding: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 100,
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.error,
  },
}); 