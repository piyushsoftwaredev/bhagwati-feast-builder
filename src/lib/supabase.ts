
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and anon key
const supabaseUrl = 'https://ojxgfumctgvueozmwayc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGdmdW1jdGd2dWVvem13YXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTk0ODYsImV4cCI6MjA2MTkzNTQ4Nn0.cFH4t59RKa7WXa1TQ9YyNGkkMFiFy3sGlnhvPV52jjk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserSession = {
  user: {
    id: string;
    email: string;
    role?: string;
  } | null;
  isAdmin: boolean;
};

// Helper function to check if Supabase connection is working
export const isSupabaseConfigured = () => {
  // Now we always return true since we have hardcoded the credentials
  return true;
};
