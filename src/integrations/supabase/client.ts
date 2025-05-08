
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
    // Use a generic query that doesn't depend on specific tables
    // Attempt to fetch health status
    const { data, error } = await supabase.from('dummy_check').select('count', { 
      count: 'exact', 
      head: true 
    }).catch(() => ({ data: null, error: null }));
    
    // If no error or the error is that the table doesn't exist (which is fine)
    // then the connection is working
    if (!error || error.code === 'PGRST116') {
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};
