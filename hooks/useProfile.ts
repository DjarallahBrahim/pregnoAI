import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';
import type { PregnancyProfile, ProfileError, UseProfileReturn } from '@/types/profile';

export function useProfile(): UseProfileReturn {
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProfileError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setError({ message: 'No authenticated user' });
      return;
    }

    setLoading(true);
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from('pregnancy_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError({
        message: 'Failed to fetch profile data',
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user, clearError]);

  const updateProfile = useCallback(async (data: Partial<PregnancyProfile>) => {
    if (!session?.user) {
      setError({ message: 'No authenticated user' });
      return;
    }

    setLoading(true);
    clearError();

    try {
      const { data: updatedData, error: updateError } = await supabase
        .from('pregnancy_profiles')
        .update(data)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(updatedData);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError({
        message: 'Failed to update profile data',
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user, clearError]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearError,
  };
}