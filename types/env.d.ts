/// <reference types="expo" />

declare module '@env' {
  export const EXPO_PUBLIC_PROVISIONG_API_KEY_OPENROUTER: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_PROVISIONG_API_KEY_OPENROUTER: string;
    }
  }
}

// Ensure this file is treated as a module
export {};