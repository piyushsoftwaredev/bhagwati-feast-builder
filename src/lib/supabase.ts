
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

// File storage helper functions
export const uploadImage = async (file: File, folder = 'uploads') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl.publicUrl };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Types for content management
export type Post = {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
};

export type SiteConfig = {
  id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
};

export type ImageAsset = {
  id: string;
  path: string;
  url: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  uploaded_by: string;
};
