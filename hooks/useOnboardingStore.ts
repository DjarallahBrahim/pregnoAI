import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  answers: Record<number, any>;
  setAnswers: (answers: Record<number, any>) => void;
  clearAnswers: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: {},
      setAnswers: (answers) => set({ answers }),
      clearAnswers: () => set({ answers: {} }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);