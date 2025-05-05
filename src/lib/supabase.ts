
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and anon key
const supabaseUrl = 'https://ojxgfumctgvueozmwayc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGdmdW1jdGd2dWVvem13YXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTk0ODYsImV4cCI6MjA2MTkzNTQ4Nn0.cFH4t59RKa7WXa1TQ9YyNGkkMFiFy3sGlnhvPV52jjk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export type UserSession = {
  user: {
    id: string;
    email: string;
    role?: string;
  } | null;
  isAdmin: boolean;
};

// Helper function to check if Supabase connection is working
export const isSupabaseConfigured = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    return !error;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};

// Mock/fallback data for demo mode
export const demoData = {
  posts: [
    {
      id: "1",
      title: "Special Wedding Menu",
      content: "Our premium wedding menu features a blend of traditional and modern cuisine options.",
      featured_image: "/lovable-uploads/0396753c-dfda-477f-b50d-9bb340fe980a.png",
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: "demo-user"
    },
    {
      id: "2",
      title: "Corporate Event Catering",
      content: "Professional catering services for your next corporate event or office gathering.",
      featured_image: "/lovable-uploads/5adc614d-01a0-4509-b84e-4d7ec509df13.png",
      published: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      author_id: "demo-user"
    }
  ]
};

// File storage helper functions with fallbacks
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
    // In demo mode, return a placeholder URL
    console.warn('Error uploading image (using fallback):', error);
    const demoUrl = `/lovable-uploads/${Math.floor(Math.random() * 10)}.png`;
    return { path: `demo/${file.name}`, url: demoUrl };
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
