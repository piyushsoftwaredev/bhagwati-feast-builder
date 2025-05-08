
// Type definitions for Supabase related functionality

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

// Helper function to delete an image
export const deleteImage = async (path: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
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
