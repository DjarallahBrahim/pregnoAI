import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { styles } from '@/styles/main';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/hooks/useAuthStore'
import { supabase } from '@/lib/supabase';

export function AuthButtons() {
  const { t } = useLanguage();
  const { session } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    
    setLoading(true);

    try {
      if (session) {
          // Check if user has already completed onboarding
          const { data: profile, error } = await supabase
            .from('pregnancy_profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') throw error;

          // If profile exists, go to baby screen, otherwise go to onboarding
          if (profile) {
            router.replace('/(tabs)/baby');
          } else {
            router.replace('/(tabs)/mom');
          }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      if (session) {
        router.replace('/onboarding');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.buttonContainer, loading && styles.buttonDisabled]} 
          onPress={handlePress}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FF8FB1', '#FF758C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startJourneyButton}
          >
            <Text style={styles.startJourneyButtonText}>
              {loading ? '...' : t('auth.startJourney')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
  );
}