
// Type definitions for Supabase related functionality
import { supabase } from '@/integrations/supabase/client';

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

export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  featured_image?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
};

// Demo data for offline/fallback usage
export const demoData = {
  posts: [
    {
      id: 'demo-1',
      title: 'Welcome to Shree Bhagwati Caterers',
      content: 'This is a sample post to demonstrate the post management functionality.',
      published: true,
      featured_image: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
      author_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Our Catering Services',
      content: 'Explore our wide range of vegetarian catering services for all occasions.',
      published: false,
      author_id: 'demo-user',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ]
};

// Helper function to upload an image
export const uploadImage = async (file: File, folder: string = 'uploads') => {
  try {
    // Create a safe filename (replace spaces, remove special chars)
    const safeFileName = file.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-_.]/g, '')
      .replace(/--+/g, '-');
      
    // Add a timestamp to prevent duplicates
    const timestamp = Date.now();
    const fileExt = safeFileName.split('.').pop();
    const baseName = safeFileName.substring(0, safeFileName.lastIndexOf('.'));
    const finalFileName = `${baseName}-${timestamp}.${fileExt}`;
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`${folder}/${finalFileName}`, file);

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(`${folder}/${finalFileName}`);

    return {
      path: `${folder}/${finalFileName}`,
      url: publicUrlData.publicUrl,
      name: finalFileName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to delete an image
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

// Re-export supabase client for convenience
export { supabase };
