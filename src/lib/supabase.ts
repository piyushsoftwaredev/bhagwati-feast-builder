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

export type Page = {
  id: string;
  title: string;
  content: string;
  slug: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Define theme settings type
export type ThemeSettings = {
  id?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  header_style: string;
  footer_style: string;
  custom_css?: string;
  created_at?: string;
  updated_at?: string;
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
  ],
  pages: [
    {
      id: 'demo-1',
      title: 'About Us',
      content: 'This is the about us page content.',
      slug: 'about-us',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Contact Us',
      content: 'This is the contact us page content.',
      slug: 'contact-us',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]
};

// Helper function to upload an image with no size or type restrictions
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
    
    // Upload to storage with no size limit
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`${folder}/${finalFileName}`, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(`${folder}/${finalFileName}`);

    // Log image upload in database for tracking
    await supabase.from('images').insert({
      path: `${folder}/${finalFileName}`,
      url: publicUrlData.publicUrl,
      name: finalFileName,
      size: file.size,
      type: file.type,
      uploaded_by: 'website_user', // This could be the actual user ID if authentication is implemented
    });

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
    // First, find the image in the database
    const { data: imageData } = await supabase
      .from('images')
      .select('*')
      .eq('path', path)
      .single();

    // Remove from storage
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);
    
    if (error) throw error;

    // If we found the image in the database, remove it from there too
    if (imageData) {
      await supabase
        .from('images')
        .delete()
        .eq('id', imageData.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Fetch theme settings from the database
export const getThemeSettings = async (): Promise<ThemeSettings> => {
  try {
    // Try to get from theme_settings table
    const { data, error } = await supabase
      .from('theme_settings')
      .select('*')
      .single();

    if (error || !data) {
      // Fallback to default settings
      return {
        primary_color: '#8B0000',
        secondary_color: '#FFD700',
        font_family: 'Inter, sans-serif',
        header_style: 'standard',
        footer_style: 'standard',
        custom_css: ''
      };
    }

    return data as ThemeSettings;
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    // Return default theme settings on error
    return {
      primary_color: '#8B0000',
      secondary_color: '#FFD700',
      font_family: 'Inter, sans-serif',
      header_style: 'standard',
      footer_style: 'standard',
      custom_css: ''
    };
  }
};

// Save theme settings to the database
export const saveThemeSettings = async (settings: ThemeSettings): Promise<boolean> => {
  try {
    // Check if any settings exist
    const { data, error: fetchError } = await supabase
      .from('theme_settings')
      .select('id')
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching existing theme settings:', fetchError);
      return false;
    }
    
    if (data && data.length > 0) {
      // Update existing settings
      const { error } = await supabase
        .from('theme_settings')
        .update({
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          font_family: settings.font_family,
          header_style: settings.header_style,
          footer_style: settings.footer_style,
          custom_css: settings.custom_css,
          updated_at: new Date().toISOString()
        })
        .eq('id', data[0].id);
      
      if (error) {
        console.error('Error updating theme settings:', error);
        return false;
      }
    } else {
      // Insert new settings
      const { error } = await supabase
        .from('theme_settings')
        .insert({
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          font_family: settings.font_family,
          header_style: settings.header_style,
          footer_style: settings.footer_style,
          custom_css: settings.custom_css
        });
      
      if (error) {
        console.error('Error inserting theme settings:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving theme settings:', error);
    return false;
  }
};

// Re-export supabase client for convenience
export { supabase };
