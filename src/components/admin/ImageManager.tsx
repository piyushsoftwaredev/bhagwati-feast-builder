
import { useState, useEffect } from 'react';
import { supabase, ImageAsset, deleteImage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Trash2, Upload, Copy, Check, FolderPlus } from 'lucide-react';
import { format } from 'date-fns';

const ImageManager = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchImages = async () => {
    setLoading(true);
    try {
      // List all files in the 'uploads' folder
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .list('uploads');

      if (storageError) throw storageError;

      // Get details from the database if we have them
      const { data: dbImages, error: dbError } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      
      // Map storage files to our format, using DB data where available
      const processedImages: ImageAsset[] = storageData.map(file => {
        const dbImage = dbImages?.find(dbImg => dbImg.path === `uploads/${file.name}`);
        const fileUrl = supabase.storage.from('images').getPublicUrl(`uploads/${file.name}`).data.publicUrl;
        
        return dbImage || {
          id: file.id || crypto.randomUUID(),
          path: `uploads/${file.name}`,
          url: fileUrl,
          name: file.name,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || 'image/*',
          created_at: file.created_at || new Date().toISOString(),
          uploaded_by: 'unknown',
        };
      });

      setImages(processedImages);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Error loading images',
        description: error.message || 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          errorCount++;
          continue;
        }

        // Upload to storage
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`uploads/${file.name}`, file);

        if (error) {
          errorCount++;
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(`uploads/${file.name}`);

        // Save metadata to database
        await supabase.from('images').insert([{
          path: `uploads/${file.name}`,
          url: publicUrlData.publicUrl,
          name: file.name,
          size: file.size,
          type: file.type,
        }]);

        successCount++;
      }

      if (successCount > 0) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} image${successCount !== 1 ? 's' : ''}`,
        });
        fetchImages();
      }

      if (errorCount > 0) {
        toast({
          title: 'Upload Issues',
          description: `Failed to upload ${errorCount} image${errorCount !== 1 ? 's' : ''}`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'There was a problem uploading your images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
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

      if (dbError) throw dbError;

      setImages(images.filter(img => img.path !== image.path));
      
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
            Refresh
          </Button>
          <div className="relative">
            <Input
              type="file"
              id="file-upload"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              accept="image/*"
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
                    accept="image/*"
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
                  {format(new Date(image.created_at), 'MMM d, yyyy')}
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
