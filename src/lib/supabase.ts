import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Types
export type UserProfile = {
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
};

export const TABLES = {
  PROFILES: 'profiles',
} as const;
