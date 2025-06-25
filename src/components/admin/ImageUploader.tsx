
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
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
  const { session } = useAuth();
  
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
      // Create preview URL for static site
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      onImageSelected(url);
      
      toast({
        title: 'Upload Complete',
        description: 'Image has been uploaded successfully (Demo Mode)',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      setPreviewImage(currentImage);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }

    setPreviewImage(undefined);
    onImageSelected('');
    
    toast({
      title: 'Image Removed',
      description: 'The image has been removed',
    });
  };

  const isLoggedIn = !!session?.user;

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
              ) : (
                <p className="text-sm text-gray-500">Login required to upload images</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Upload any type of image file (Demo Mode)
              </p>
            </div>
          </div>
        )}
      </div>

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
