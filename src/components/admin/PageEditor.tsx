
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Save } from 'lucide-react';
import ImageUploader from './ImageUploader';

type PageData = {
  id: string;
  title: string;
  content: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
  updated_at: string;
};

const PageEditor = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // New page template
  const newPageTemplate: Omit<PageData, 'id' | 'updated_at'> = {
    title: 'New Page',
    content: 'Enter your page content here...',
    slug: 'new-page',
    meta_title: '',
    meta_description: '',
    featured_image: '',
  };

  // Fetch all pages
  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
      
      // Set default page if none is selected
      if (data && data.length > 0 && !currentPage) {
        setCurrentPage(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error loading pages',
        description: error.message || 'Failed to load pages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new page
  const createNewPage = () => {
    const timestamp = new Date().toISOString();
    const newPage = {
      ...newPageTemplate,
      id: `new-${Date.now()}`, // Temporary ID
      updated_at: timestamp,
    };
    setCurrentPage(newPage);
  };

  // Save current page
  const savePage = async () => {
    if (!currentPage) return;
    
    setSaving(true);
    try {
      // Format slug properly
      const slug = currentPage.slug
        ? currentPage.slug
        : currentPage.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const pageData = {
        ...currentPage,
        slug,
        updated_at: new Date().toISOString(),
      };

      if (currentPage.id.startsWith('new-')) {
        // Create new page
        const { data, error } = await supabase
          .from('pages')
          .insert([{
            title: pageData.title,
            content: pageData.content,
            slug: pageData.slug,
            meta_title: pageData.meta_title,
            meta_description: pageData.meta_description,
            featured_image: pageData.featured_image,
            updated_at: pageData.updated_at,
          }])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCurrentPage(data[0]);
          // Add to pages list
          setPages([...pages, data[0]]);
        }

        toast({
          title: 'Page Created',
          description: 'The new page has been created successfully',
        });
      } else {
        // Update existing page
        const { data, error } = await supabase
          .from('pages')
          .update({
            title: pageData.title,
            content: pageData.content,
            slug: pageData.slug,
            meta_title: pageData.meta_title,
            meta_description: pageData.meta_description,
            featured_image: pageData.featured_image,
            updated_at: pageData.updated_at,
          })
          .eq('id', currentPage.id)
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCurrentPage(data[0]);
          // Update pages list
          setPages(pages.map(p => p.id === data[0].id ? data[0] : p));
        }

        toast({
          title: 'Page Updated',
          description: 'The page has been updated successfully',
        });
      }
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast({
        title: 'Error saving page',
        description: error.message || 'Failed to save the page',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Update field value in current page
  const updatePageField = (field: string, value: any) => {
    if (!currentPage) return;
    setCurrentPage({ ...currentPage, [field]: value });
  };

  // Initial fetch
  useEffect(() => {
    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Page Editor</h2>
          <p className="text-muted-foreground">Create and edit pages for your website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPages}>
            Refresh
          </Button>
          <Button onClick={createNewPage}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Page List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Pages</CardTitle>
            <CardDescription>Select a page to edit</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              <ul>
                {pages.map(page => (
                  <li 
                    key={page.id}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                      currentPage?.id === page.id ? 'bg-muted' : ''
                    }`}
                  >
                    {page.title}
                  </li>
                ))}
              </ul>
              {pages.length === 0 && (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  No pages created yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Page Editor */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{currentPage?.title || 'Select a Page'}</CardTitle>
            <CardDescription>
              {currentPage 
                ? `Edit page content and settings` 
                : 'Select a page from the list or create a new one'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPage ? (
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={currentPage.title}
                      onChange={(e) => updatePageField('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={currentPage.content}
                      onChange={(e) => updatePageField('content', e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="featured-image">Featured Image</Label>
                    <ImageUploader
                      currentImage={currentPage.featured_image}
                      onImageSelected={(url) => updatePageField('featured_image', url)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Page Slug</Label>
                    <Input
                      id="slug"
                      value={currentPage.slug}
                      onChange={(e) => updatePageField('slug', e.target.value)}
                      placeholder="page-url-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be used in the page URL: yourdomain.com/{currentPage.slug}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={currentPage.meta_title || ''}
                      onChange={(e) => updatePageField('meta_title', e.target.value)}
                      placeholder="SEO Title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      value={currentPage.meta_description || ''}
                      onChange={(e) => updatePageField('meta_description', e.target.value)}
                      placeholder="SEO Description"
                    />
                    <p className="text-xs text-muted-foreground">
                      This description will appear in search engine results.
                    </p>
                  </div>
                </TabsContent>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={savePage} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Page'}
                  </Button>
                </div>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Select a page to edit or create a new one
                </p>
                <Button onClick={createNewPage} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Page
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageEditor;
