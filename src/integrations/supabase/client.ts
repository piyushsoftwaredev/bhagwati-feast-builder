
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ojxgfumctgvueozmwayc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGdmdW1jdGd2dWVvem13YXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTk0ODYsImV4cCI6MjA2MTkzNTQ4Nn0.cFH4t59RKa7WXa1TQ9YyNGkkMFiFy3sGlnhvPV52jjk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper function to check connection status
export const checkSupabaseConnection = async () => {
  try {
    // Use a more generic query that doesn't require a specific table
    const { error } = await supabase.from('profiles').select('count');
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist but connection is working
      console.log('Supabase connection working but profiles table not found');
      return true;
    }
    return !error;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};
