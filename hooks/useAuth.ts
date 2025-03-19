import { useState, useCallback, } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';
import { generateOpenRouterKey } from '@/lib/openrouter';

export type AuthError = {
  email?: string;
  password?: string;
  username?: string;
  general?: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError>({});
  const { setSession } = useAuthStore();

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      setError({
        general: err.message || 'An error occurred while resetting password',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    setLoading(true);
    setError({});

    try {
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUsers) {
        setError({ username: 'Username already taken' });
        return null;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Generate OpenRouter API key for the new user
        const openRouterKey = await generateOpenRouterKey(data.session.user.id);
        if (!openRouterKey) {
          console.error('Failed to generate OpenRouter API key');
        }

        setSession(data.session);
      }

      return data;
    } catch (err: any) {
      setError({
        general: err.message || 'An error occurred during sign up',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
      }

      return data;
    } catch (err: any) {
      setError({
        general: 'Invalid email or password',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      router.replace('/');
    } catch (err: any) {
      setError({
        general: err.message || 'An error occurred during sign out',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    loading,
    error,
  };
}