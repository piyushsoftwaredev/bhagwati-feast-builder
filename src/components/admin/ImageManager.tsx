import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Upload, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cache } from '@/lib/cache-service';
import { ImageAsset } from '@/lib/supabase';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageManager = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState<{total: number, success: number, failed: number} | null>(null);
  const { toast } = useToast();

  const fetchImages = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Check cache first
      const cachedImages = cache.get('media-library-images');
      if (cachedImages) {
        setImages(cachedImages);
        setLoading(false);
        return;
      }
      
      // Ensure uploads folder exists
      try {
        await supabase.storage.from('images').list('uploads');
      } catch (folderError) {
        // Create folder if it doesn't exist
        await supabase.storage.from('images').upload('uploads/.gitkeep', new Blob(['']));
      }
      
      // Get all files from storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .list('uploads', { sortBy: { column: 'created_at', order: 'desc' } });

      if (storageError) throw storageError;

      // Get image metadata from the database
      const { data: dbImages, error: dbError } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError && dbError.code !== 'PGRST116') throw dbError;
      
      // Map storage files to our format, using DB data where available
      const processedImages: ImageAsset[] = [];
      
      if (storageData && storageData.length > 0) {
        for (const file of storageData) {
          if (file.name === '.gitkeep') continue; // Skip placeholder file
          
          const dbImage = dbImages?.find(dbImg => dbImg.path === `uploads/${file.name}`);
          const fileUrl = supabase.storage.from('images').getPublicUrl(`uploads/${file.name}`).data.publicUrl;
          
          processedImages.push(dbImage || {
            id: file.id || crypto.randomUUID(),
            path: `uploads/${file.name}`,
            url: fileUrl,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'image/*',
            created_at: file.created_at || new Date().toISOString(),
            uploaded_by: 'unknown',
          });
        }
      }

      // Cache the results
      cache.set('media-library-images', processedImages, 10); // Cache for 10 minutes
      setImages(processedImages);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      setErrorMessage('Failed to load images. Please try again.');
      toast({
        title: 'Error loading images',
        description: error.message || 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: `The file "${file.name}" exceeds the 10MB size limit`,
        variant: 'destructive',
      });
      return false;
    }
    
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: `The file "${file.name}" must be a JPEG, PNG, GIF or WebP image`,
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setErrorMessage(null);
    
    let successCount = 0;
    let errorCount = 0;
    const totalCount = files.length;
    
    // Update counts during upload
    setUploadCount({ total: totalCount, success: 0, failed: 0 });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        if (!validateFile(file)) {
          errorCount++;
          setUploadCount(prev => ({ 
            total: prev?.total || totalCount, 
            success: prev?.success || 0, 
            failed: (prev?.failed || 0) + 1 
          }));
          continue;
        }
        
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
            .upload(`uploads/${finalFileName}`, file);

          if (error) throw error;

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(`uploads/${finalFileName}`);

          // Save metadata to database
          await supabase.from('images').insert([{
            path: `uploads/${finalFileName}`,
            url: publicUrlData.publicUrl,
            name: finalFileName,
            size: file.size,
            type: file.type,
          }]);

          successCount++;
          setUploadCount(prev => ({ 
            total: prev?.total || totalCount, 
            success: (prev?.success || 0) + 1, 
            failed: prev?.failed || 0
          }));
        } catch (uploadError: any) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          errorCount++;
          setUploadCount(prev => ({ 
            total: prev?.total || totalCount, 
            success: prev?.success || 0, 
            failed: (prev?.failed || 0) + 1
          }));
        }
      }

      if (successCount > 0) {
        // Clear the cache to force refresh
        cache.delete('media-library-images');
        
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} image${successCount !== 1 ? 's' : ''}`,
        });
        fetchImages();
      }

      if (errorCount > 0) {
        setErrorMessage(`Failed to upload ${errorCount} image${errorCount !== 1 ? 's' : ''}. Please try again with smaller files or different formats.`);
        toast({
          title: 'Upload Issues',
          description: `Failed to upload ${errorCount} image${errorCount !== 1 ? 's' : ''}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error handling uploads:', error);
      setErrorMessage('Error uploading images. Please try again.');
      toast({
        title: 'Upload Error',
        description: error.message || 'There was a problem uploading your images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadCount(null);
      // Clear the input
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (image: ImageAsset) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([image.path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('path', image.path);

      if (dbError && dbError.code !== 'PGRST116') {
        console.warn('Database delete warning:', dbError);
      }

      // Update the UI and cache
      const updatedImages = images.filter(img => img.path !== image.path);
      setImages(updatedImages);
      cache.set('media-library-images', updatedImages, 10);
      
      toast({
        title: 'Image Deleted',
        description: 'The image has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error deleting image',
        description: error.message || 'Failed to delete the image',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: 'URL Copied',
      description: 'Image URL has been copied to clipboard',
    });
  };

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-muted-foreground">Manage your images and media files</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchImages}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="relative">
            <Input
              type="file"
              id="file-upload"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/gif,image/webp"
              multiple
              disabled={uploading}
            />
            <Button disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload progress */}
      {uploading && uploadCount && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-bhagwati-gold h-2.5 rounded-full" 
            style={{ width: `${Math.round((uploadCount.success + uploadCount.failed) / uploadCount.total * 100)}%` }}
          ></div>
          <p className="text-sm text-gray-500 mt-1">
            Uploading {uploadCount.success + uploadCount.failed} of {uploadCount.total} images...
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Search bar */}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
        </div>
      ) : filteredImages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {searchTerm ? (
              <p className="text-lg text-gray-500">No images match your search</p>
            ) : (
              <>
                <p className="text-lg text-gray-500">No images uploaded yet</p>
                <label htmlFor="file-upload-empty" className="mt-4">
                  <div className="cursor-pointer">
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload your first image
                    </Button>
                  </div>
                  <Input
                    type="file"
                    id="file-upload-empty"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    multiple
                    disabled={uploading}
                  />
                </label>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-square relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteImage(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(image.url, image.id)}
                    >
                      {copied === image.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-gray-500">
                  {image.created_at ? format(new Date(image.created_at), 'MMM d, yyyy') : 'Unknown date'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageManager;
