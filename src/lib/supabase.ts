import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default values that will be used if environment variables are missing
const DEFAULT_SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-supabase-anon-key';

// Get environment variables with fallbacks
const getEnvVar = (name: string, defaultValue: string = ''): string => {
  // In production, use import.meta.env
  if (typeof window !== 'undefined') {
    const value = import.meta.env[name];
    if (value) return value;
  }
  
  // In development, try process.env
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name];
    if (value) return value;
  }
  
  return defaultValue;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', DEFAULT_SUPABASE_URL);
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', DEFAULT_SUPABASE_ANON_KEY);

// Create a mock Supabase client if environment variables are missing
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  
  // Create a mock client with no-op methods
  supabase = {
    auth: {
      signIn: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not initialized') }),
      signOut: async () => ({ error: new Error('Supabase not initialized') }),
      // Add other auth methods as needed
    },
    // Add other Supabase methods used in your app
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not initialized') }),
        }),
        upsert: async () => ({ data: null, error: new Error('Supabase not initialized') }),
      }),
    }),
  } as unknown as SupabaseClient;
}

export { supabase };

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
