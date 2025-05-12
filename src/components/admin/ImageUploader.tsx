
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, deleteImage } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelected: (imageUrl: string) => void;
  folder?: string;
  label?: string;
}

const ImageUploader = ({
  currentImage,
  onImageSelected,
  folder = 'uploads',
  label = 'Choose Image'
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | undefined>(currentImage);
  const { session } = useAuth(); // Get authentication status
  
  // Effect to update preview when currentImage prop changes
  useEffect(() => {
    if (currentImage !== previewImage) {
      setPreviewImage(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      // Create a temporary preview
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);

      // Upload the file without size or type restrictions
      const result = await uploadImage(file, folder);
      
      // Update preview with the actual URL and notify parent
      setPreviewImage(result.url);
      onImageSelected(result.url);
      
      toast({
        title: 'Upload Complete',
        description: 'Image has been uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      // Reset preview on error
      setPreviewImage(currentImage);
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!previewImage || previewImage === currentImage) {
      setPreviewImage(undefined);
      onImageSelected('');
      return;
    }

    // Extract path from URL if it's a Supabase storage URL
    if (previewImage.includes('storage/v1')) {
      try {
        const url = new URL(previewImage);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/images\/(.*)/);
        if (pathMatch?.[1]) {
          await deleteImage(pathMatch[1]);
        }
      } catch (error) {
        console.error('Error parsing URL:', error);
      }
    }

    setPreviewImage(undefined);
    onImageSelected('');
    
    toast({
      title: 'Image Removed',
      description: 'The image has been removed',
    });
  };

  const isLoggedIn = !!session?.user; // Check if user is logged in

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 transition-all hover:bg-gray-100">
        {previewImage ? (
          <div className="relative w-full">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-80 rounded-md mx-auto object-contain"
            />
            {/* Only show image controls for logged-in users */}
            {isLoggedIn && (
              <div className="flex justify-center mt-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="bg-white hover:bg-gray-100"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Replace
                </Button>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex flex-col items-center">
              {isLoggedIn ? (
                <label htmlFor="file-input" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="bg-white hover:bg-gray-100"
                  >
                    {uploading ? 'Uploading...' : label}
                  </Button>
                </label>
              ) : previewImage ? (
                <p className="text-sm text-gray-500">Login required to modify images</p>
              ) : (
                <p className="text-sm text-gray-500">Login required to upload images</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Upload any type of image file
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Always include the file input but disable it for non-logged-in users */}
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={uploading || !isLoggedIn}
      />
    </div>
  );
};

export default ImageUploader;
