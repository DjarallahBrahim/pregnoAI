import { Database } from './supabase';

export type PregnancyProfile = Database['public']['Tables']['pregnancy_profiles']['Row'];

export type ProfileError = {
  message: string;
  code?: string;
};

export type ProfileState = {
  profile: PregnancyProfile | null;
  loading: boolean;
  error: ProfileError | null;
};

export type UseProfileReturn = ProfileState & {
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<PregnancyProfile>) => Promise<void>;
  clearError: () => void;
};