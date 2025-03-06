import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

export default function MomScreen() {
  const insets = useSafeAreaInsets();
  const { signOut, loading } = useAuth();

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
          <Text style={styles.title}>Mom's Health</Text>
          <Text style={styles.subtitle}>Track your well-being during pregnancy</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Mood</Text>
          <Text style={styles.cardEmoji}>😊</Text>
          <Text style={styles.cardDescription}>You're feeling great today!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardDescription}>
            Track your weight, blood pressure, and other important health metrics.
          </Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
            disabled={loading}
          >
            <Text style={styles.signOutText}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});