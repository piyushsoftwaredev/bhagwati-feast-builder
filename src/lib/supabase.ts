
import { createClient } from '@supabase/supabase-js';

// Use default values for local development if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserSession = {
  user: {
    id: string;
    email: string;
    role?: string;
  } | null;
  isAdmin: boolean;
};

// Add helper function to check if Supabase connection is working
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key';
};
