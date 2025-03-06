import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';

type WeekCircleProps = {
  week: number;
  isSelected: boolean;
  onPress: () => void;
  t: (key: string) => string;
};

const WeekCircle = ({ week, isSelected, onPress, t }: WeekCircleProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.weekCircle,
      isSelected && styles.selectedWeek
    ]}
  >
    <Text style={[styles.weekNumber, isSelected && styles.selectedText]}>
      {week}
    </Text>

    <Text style={[styles.weekText, isSelected && styles.selectedText]}>
      {t('calendar.weekShort')}
    </Text>
  </TouchableOpacity>
);

type Props = {
  currentWeek: number;
  onWeekChange?: (week: number) => void;
};

export function HorizontalCalendar({ currentWeek, onWeekChange }: Props) {
  const [selectedWeek, setSelectedWeek] = React.useState(currentWeek || 1);
  const { t } = useLanguage();
  const [contentWidth, setContentWidth] = React.useState(0);
  
  // Update selected week when currentWeek prop changes
  React.useEffect(() => {
    if (currentWeek && currentWeek !== selectedWeek) {
      setSelectedWeek(currentWeek);
    }
  }, [currentWeek]);

  // Generate array of weeks (1-41)
  const weeks = Array.from({ length: 41 }, (_, i) => i + 1);

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week);
    onWeekChange?.(week);
  };

  // Scroll to the current week when it changes
  const scrollViewRef = React.useRef<ScrollView>(null);
  
  React.useEffect(() => {
    if (selectedWeek && scrollViewRef.current) {
      const itemWidth = 70; // week circle width
      const gap = 10; // gap between circles
      const screenWidth = contentWidth;
      
      // Calculate the center position for the selected week
      const selectedItemCenter = (selectedWeek - 1) * (itemWidth + gap) + itemWidth / 2;
      const scrollOffset = selectedItemCenter - screenWidth / 2;
      
      // Ensure we don't scroll past the bounds
      const maxScroll = (weeks.length * (itemWidth + gap)) - screenWidth;
      const finalOffset = Math.max(0, Math.min(scrollOffset, maxScroll));
      
      scrollViewRef.current.scrollTo({ 
        x: finalOffset,
        animated: true 
      });
    }
  }, [selectedWeek, contentWidth, weeks.length]);

  return (
    <View 
      style={styles.container}
      onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weeks.map((week) => (
          <WeekCircle
            key={week}
            week={week}
            isSelected={week === selectedWeek}
            onPress={() => handleWeekSelect(week)}
            t={t}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContent: { 
    gap: 10,
  },
  weekCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedWeek: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.secondary,
  },
  weekNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: -2,
  },
  weekLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: -2,
  },
  weekText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  selectedText: {
    color: 'white',
  },
});