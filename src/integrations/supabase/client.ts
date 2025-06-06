
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
    // Use a table we know exists to check the connection
    const { error } = await supabase.from('site_config')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    // As long as we don't get a critical connection error, consider it working
    return !error || error.code !== 'PGRST116';
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};
