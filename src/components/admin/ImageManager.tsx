
import { useState, useEffect } from 'react';
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
import { ImageAsset } from '@/lib/supabase';

// Static image management for demo purposes
const ImageManager = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Demo images
  const demoImages: ImageAsset[] = [
    {
      id: '1',
      path: 'uploads/demo-1.png',
      url: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
      name: 'demo-catering-1.png',
      size: 1024000,
      type: 'image/png',
      created_at: new Date().toISOString(),
      uploaded_by: 'demo-user',
    },
    {
      id: '2',
      path: 'uploads/demo-2.png',
      url: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
      name: 'demo-catering-2.png',
      size: 856000,
      type: 'image/png',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      uploaded_by: 'demo-user',
    },
    {
      id: '3',
      path: 'uploads/demo-3.png',
      url: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
      name: 'demo-catering-3.png',
      size: 924000,
      type: 'image/png',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      uploaded_by: 'demo-user',
    }
  ];

  const fetchImages = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setImages(demoImages);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      setErrorMessage('Failed to load images.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setErrorMessage(null);

    try {
      const newImages: ImageAsset[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        const newImage: ImageAsset = {
          id: `new-${Date.now()}-${i}`,
          path: `uploads/${file.name}`,
          url: url,
          name: file.name,
          size: file.size,
          type: file.type,
          created_at: new Date().toISOString(),
          uploaded_by: 'demo-user',
        };
        
        newImages.push(newImage);
      }

      setImages(prev => [...newImages, ...prev]);
      
      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${newImages.length} image${newImages.length !== 1 ? 's' : ''}`,
      });
    } catch (error: any) {
      console.error('Error handling uploads:', error);
      setErrorMessage('Error uploading images.');
      toast({
        title: 'Upload Error',
        description: 'There was a problem uploading your images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (image: ImageAsset) => {
    try {
      setImages(prev => prev.filter(img => img.id !== image.id));
      
      // Revoke object URL if it's a blob URL
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
      
      toast({
        title: 'Image Deleted',
        description: 'The image has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error deleting image',
        description: 'Failed to delete the image',
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

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-muted-foreground">Manage your images and media files (Demo Mode)</p>
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

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

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
