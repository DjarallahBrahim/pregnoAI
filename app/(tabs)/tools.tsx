import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

const tools = [
  {
    name: 'Contraction Timer',
    icon: 'timer-outline',
    description: 'Track your contractions during labor',
    comingSoon: true,
  },
  {
    name: 'Weight Tracker',
    icon: 'scale-outline',
    description: 'Monitor your weight gain during pregnancy',
    comingSoon: true,
  },
  {
    name: 'Appointment Manager',
    icon: 'calendar-outline',
    description: 'Keep track of your medical appointments',
    comingSoon: true,
  },
];

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={theme.colors.gradients.primary} style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Platform.OS === 'ios' ? 0 : insets.top,
            paddingBottom: insets.bottom,
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pregnancy Tools</Text>
          <Text style={styles.subtitle}>Helpful tools for your pregnancy journey</Text>
        </View>

        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, tool.comingSoon && styles.cardDisabled]}
            disabled={tool.comingSoon}
          >
            <View style={styles.toolHeader}>
              <Ionicons name={tool.icon} size={24} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>{tool.name}</Text>
              {tool.comingSoon && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardDescription}>{tool.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDisabled: {
    opacity: 0.7,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  comingSoonBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: theme.colors.text.light,
    fontSize: 12,
    fontWeight: '500',
  },
});