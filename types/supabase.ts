export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      kick_counters: {
        Row: {
          id: string
          user_id: string
          kicks_count: number
          duration_minutes: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kicks_count: number
          duration_minutes: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kicks_count?: number
          duration_minutes?: number
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          openrouter_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          openrouter_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          openrouter_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}