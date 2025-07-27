import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2, Search, Upload, Copy, Plus } from 'lucide-react';

// Removed database dependencies - using static demo data
interface ImageAsset {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

const ImageManager = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Demo images for static website
  const demoImages: ImageAsset[] = [
    {
      id: '1',
      name: 'catering-setup-1.jpg',
      url: '/lovable-uploads/f3dd8b9e-0d8d-4025-b5c1-929eec597a75.png',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'luxury-buffet.jpg',
      url: '/lovable-uploads/c2f8f321-f583-4ec1-abd3-f61a789ec22a.png',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'elegant-dining.jpg',
      url: '/lovable-uploads/cd4468b2-489a-48f6-ad5b-5a125c881b59.png',
      createdAt: new Date().toISOString()
    }
  ];

  const fetchImages = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate loading delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImages(demoImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Create a preview URL for the uploaded file
        const previewUrl = URL.createObjectURL(file);
        const newImage: ImageAsset = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: previewUrl,
          createdAt: new Date().toISOString()
        };

        setImages(prev => [...prev, newImage]);
        
        toast({
          title: "Image uploaded",
          description: `${file.name} has been uploaded successfully.`
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image: ImageAsset): Promise<void> => {
    try {
      setImages(prev => prev.filter(img => img.id !== image.id));
      
      // Revoke object URL if it's a blob URL
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
      
      toast({
        title: "Image deleted",
        description: `${image.name} has been deleted.`
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    
    toast({
      title: "URL copied",
      description: "Image URL has been copied to clipboard."
    });
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Media Library</h2>
          <p className="text-muted-foreground">Manage your website images and media files</p>
        </div>
        
        <div className="flex gap-2">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" disabled={isUploading} asChild>
              <span>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </>
                )}
              </span>
            </Button>
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            onClick={fetchImages}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-16">
          <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No images found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Upload your first image to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(image.url, image.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteImage(image)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm truncate" title={image.name}>
                    {image.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(image.url, image.id)}
                      className="flex-1 h-8 text-xs"
                    >
                      {copiedId === image.id ? 'Copied!' : 'Copy URL'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = image.name;
                        link.click();
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageManager;