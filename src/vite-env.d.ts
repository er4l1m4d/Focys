/// <reference types="vite/client" />

// Add this to help TypeScript understand the @/ path alias
declare module '@/lib/supabase' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export const supabase: SupabaseClient;
  export const TABLES: {
    PROFILES: string;
  };
  
  export interface UserProfile {
    id: string;
    wallet_address: string;
    username: string;
    profile_picture_url?: string;
    level: number;
    xp: number;
    total_focus_time: number;
    total_sessions: number;
    streak: number;
    last_session_date: string | null;
    unlocked_crystals: string[];
    active_crystal: string | null;
    achievements: Record<string, boolean>;
    created_at: string;
    updated_at: string;
  }
}
