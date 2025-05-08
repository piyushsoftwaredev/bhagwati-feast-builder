
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
    // Use a more generic query that doesn't depend on specific tables
    const { data, error } = await supabase.rpc('get_service_status');
    if (error) {
      // Try a different approach if RPC function is not available
      const { error: tableError } = await supabase.from('dummy_check').select('count', { count: 'exact', head: true });
      // If error code is 'PGRST116', it means that the connection works but the table doesn't exist
      if (tableError && tableError.code === 'PGRST116') {
        console.log('Supabase connection working but table not found');
        return true;
      }
      console.error('Supabase connection check failed:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};
