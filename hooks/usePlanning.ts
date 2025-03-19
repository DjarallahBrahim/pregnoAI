import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PlanningAction {
  category: string;
  action: string;
}

export interface PlanningTask {
  id: string;
  category: string;
  description: string;
  day: number;
}

export function usePlanning() {
  const { t } = useLanguage();

  const fetchTasksForWeek = useCallback((weekNum: number): PlanningTask[] => {
    try {
      const weekKey = `week-${weekNum}`;
      // Get the full pregnancy plan object
      const pregnancyPlan = t('development.pregnancy_plan');
      
      if (!pregnancyPlan || !pregnancyPlan[weekKey] || !pregnancyPlan[weekKey].actions) {
        console.log(`No plan found for week ${weekNum}`);
        return [];
      }

      return pregnancyPlan[weekKey].actions.map((action: PlanningAction, index: number) => ({
        id: `${weekNum}-${index}`,
        category: action.category.toLowerCase(),
        description: action.action,
        day: index + 1 // Use the action index + 1 as the day number
      }));
    } catch (err) {
      console.error('Error fetching planning tasks:', err);
      return [];
    }
  }, [t]);

  return {
    fetchTasksForWeek,
    loading: false,
    error: null,
  };
}