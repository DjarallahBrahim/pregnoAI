import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

type WeekCircleProps = {
  week: number;
  isSelected: boolean;
  isSpecialWeek: boolean;
  onPress: () => void;
  t: (key: string) => string;
};

const WeekCircle = ({ week, isSelected, isSpecialWeek, onPress, t }: WeekCircleProps) => (
  <LinearGradient
        colors={['#FF8FB1', '#FFA07A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.linearGradient}
      >
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.weekCircle,
      isSelected && styles.selectedWeek,
      isSpecialWeek && styles.specialWeek
    ]}
  >
    <Text 
      style={[
        styles.weekNumber, 
        isSelected && styles.selectedText,
        isSpecialWeek && styles.specialText
      ]}
    >
      {week}
    </Text>

    <Text 
      style={[
        styles.weekText, 
        isSelected && styles.selectedText,
        isSpecialWeek && styles.specialText
      ]}
    >
      {t('calendar.weekShort')}
    </Text>
  </TouchableOpacity>
  </LinearGradient>
);

type Props = {
  currentWeek: number;
  onWeekChange?: (week: number) => void;
};

export function HorizontalCalendar({ currentWeek, onWeekChange }: Props) {
  // Store the initial value of currentWeek in specialWeek
  
  
  const [selectedWeek, setSelectedWeek] = React.useState(currentWeek || 1);
  const { t } = useLanguage();
  const [contentWidth, setContentWidth] = React.useState(0);
  const [specialWeek, setSpecialWeek] = React.useState(currentWeek);
  
  // Update selected week when currentWeek prop changes
  React.useEffect(() => {
    if (currentWeek && currentWeek !== selectedWeek) {
      setSelectedWeek(currentWeek);
      setSpecialWeek(currentWeek);
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
      const itemWidth = 76; // week circle width
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
            isSpecialWeek={week === specialWeek}
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
  linearGradient: {
    height: 76,
    width: 76,
    borderRadius: 40, // <-- Outer Border Radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  selectedWeek: {
   
  },
  specialWeek: {
    backgroundColor: 'rgba(255, 143, 177, 0.0)', // Light yellow background
    borderWidth:2,
    borderColor: '#FB4D3D',
  },
  specialText: {
    color: '#FFF', // Orange text for special week
  },
  weekNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: -2,
  },
  weekText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  selectedText: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },
 
});