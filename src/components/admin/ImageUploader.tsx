
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, deleteImage } from '@/lib/supabase';

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
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

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

      // Upload the file
      const { url } = await uploadImage(file, folder);
      
      // Update the preview with the actual URL
      setPreviewImage(url);
      onImageSelected(url);
      
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
        {previewImage ? (
          <div className="relative w-full">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-80 rounded-md mx-auto object-contain"
            />
            <div className="flex justify-center mt-4 gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => document.getElementById('file-input')?.click()}
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
          </div>
        ) : (
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="file-input" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="mt-2"
                >
                  {uploading ? 'Uploading...' : label}
                </Button>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={uploading}
      />
    </div>
  );
};

export default ImageUploader;
