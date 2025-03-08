import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';

interface ActionItem {
  id: string;
  day: string;
  date: string;
  description: string;
  category: 'health' | 'finance' | 'paperwork' | 'family';
}

interface ActionTimelineProps {
  week: number;
}

export function ActionTimeline({ week }: ActionTimelineProps) {
  const { t } = useLanguage();
  
  // Generate fake data based on week number
  const getActionsForWeek = (weekNum: number): ActionItem[] => {
    // This would eventually come from your i18n files or API
    const weekData: Record<number, ActionItem[]> = {
      10: [
        {
          id: '1',
          day: 'sam.',
          date: '8',
          description: 'Echographie de datation : vérification du bon déroulement.',
          category: 'health'
        },
        {
          id: '2',
          day: 'dim.',
          date: '9',
          description: 'Prévois le budget pour la grossesse et les soins.',
          category: 'finance'
        },
        {
          id: '3',
          day: 'lun.',
          date: '10',
          description: 'Mets à jour ton dossier social.',
          category: 'paperwork'
        },
        {
          id: '4',
          day: 'mar.',
          date: '11',
          description: 'Achète des vêtements adaptés à la grossesse.',
          category: 'family'
        }
      ],
      41: [
        {
          id: '1',
          day: 'jeu.',
          date: '14',
          description: 'Rendez-vous avec sage-femme.',
          category: 'health'
        },
        {
          id: '2',
          day: 'ven.',
          date: '15',
          description: 'Recherche des allocations familiales disponibles.',
          category: 'finance'
        }
      ],
      // Add more weeks as needed
    };
    
    // Return data for the selected week or empty array if no data
    return weekData[weekNum] || [];
  };
  
  const actions = getActionsForWeek(week);
  
  // Get color based on category
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'health':
        return '#A1E9C4'; // Light green
      case 'finance':
        return '#FAD78C'; // Light yellow
      case 'paperwork':
        return '#F9C0C0'; // Light pink/salmon
      case 'family':
        return '#FFC2E2'; // Light pink
      default:
        return '#E5E7EB'; // Light gray
    }
  };
  
  // Get category label based on category
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'health':
        return t('timeline.categories.health') || 'Health';
      case 'finance':
        return t('timeline.categories.finance') || 'Finances';
      case 'paperwork':
        return t('timeline.categories.paperwork') || 'Démarches';
      case 'family':
        return t('timeline.categories.family') || 'Organisation familiale';
      default:
        return '';
    }
  };
  
  if (actions.length === 0) {
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
      <Text style={styles.headerTitle}>{t('timeline.title') || 'Weekly Timeline'}</Text>
      <View style={styles.timelineContainer}>
        {actions.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.dateContainer}>
              <Text style={styles.day}>{item.day}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            
            <View style={[styles.contentContainer, { borderLeftColor: getCategoryColor(item.category) }]}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
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
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 15,
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
    borderRadius: 20,
    borderBottomColor: '#F3F4F6',
  },
  dateContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    
  },
  day: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
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
  }
}); 