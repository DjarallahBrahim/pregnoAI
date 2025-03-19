import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/hooks/useAuthStore';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type KickData = {
  pregnancy_month: number;
  total_kicks: number;
  avg_kicks: number;
};

export default function KickStatsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kickData, setKickData] = useState<KickData[]>([]);
  const { session } = useAuthStore();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchKickData = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('kick_counters')
          .select('pregnancy_month, kicks_count')
          .eq('user_id', session.user.id)
          .order('pregnancy_month', { ascending: true });

        if (fetchError) throw fetchError;

        // Process data to get monthly totals and averages
        const monthlyData = data.reduce((acc: Record<number, { total: number; count: number }>, curr) => {
          if (!acc[curr.pregnancy_month]) {
            acc[curr.pregnancy_month] = { total: 0, count: 0 };
          }
          acc[curr.pregnancy_month].total += curr.kicks_count;
          acc[curr.pregnancy_month].count++;
          return acc;
        }, {});

        // Convert to array format needed for chart
        const processedData = Object.entries(monthlyData).map(([month, data]) => ({
          pregnancy_month: parseInt(month),
          total_kicks: data.total,
          avg_kicks: Math.round(data.total / data.count),
        }));

        setKickData(processedData);
      } catch (err) {
        console.error('Error fetching kick data:', err);
        setError('Failed to load kick data');
      } finally {
        setLoading(false);
      }
    };

    fetchKickData();
  }, [session?.user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const chartData = {
    labels: kickData.map(d => d.pregnancy_month.toString()),
    datasets: [
      {
        data: kickData.map(d => d.avg_kicks),
        color: () => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Kick Statistics",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#F8F5E9',
          },
          headerShadowVisible: false,
        }}
      />
      <LinearGradient 
        colors={theme.colors.gradients.primary} 
        style={styles.gradient}
        locations={[0, 1]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Monthly Kick Patterns</Text>
            <Text style={styles.subtitle}>Track your baby's activity</Text>
          </View>

          {kickData.length > 0 ? (
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - 72}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 143, 177, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 105, 105, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: theme.colors.primary,
                  },
                }}
                bezier
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=" kicks"
                xAxisLabel="Month "
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No kick data available yet</Text>
              <Text style={styles.emptySubtext}>Start tracking kicks to see your statistics</Text>
            </View>
          )}

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {kickData.length > 0 
                  ? Math.max(...kickData.map(d => d.total_kicks))
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Most Kicks in a Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {kickData.length > 0
                  ? Math.round(kickData.reduce((acc, curr) => acc + curr.avg_kicks, 0) / kickData.length)
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Average Kicks per Session</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5E9',
  },
  gradient: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  backButton: {
    marginLeft: 16,
  },
});