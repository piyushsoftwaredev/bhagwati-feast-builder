
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { demoData, type Page } from '@/lib/supabase';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" }),
  published: z.boolean().default(false),
});

const PageEditor = () => {
  const [pages, setPages] = useState<Page[]>(demoData.pages);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
      published: false,
    },
  });
  
  const handleCreatePage = () => {
    setSelectedPage(null);
    setIsCreatingPage(true);
    form.reset({
      title: "",
      content: "",
      slug: "",
      published: false,
    });
  };
  
  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setIsCreatingPage(false);
    form.reset({
      title: page.title,
      content: page.content,
      slug: page.slug,
      published: page.published || false,
    });
  };
  
  const handleSavePage = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      
      // Simulate save for static site
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedPage) {
        // Update existing page
        const updatedPages = pages.map(page => 
          page.id === selectedPage.id 
            ? { ...page, ...values, updated_at: new Date().toISOString() }
            : page
        );
        setPages(updatedPages);
        
        toast({
          title: 'Page updated (Demo Mode)',
          description: 'The page has been updated successfully in demo mode.',
        });
      } else {
        // Create new page
        const newPage: Page = {
          id: `demo-${Date.now()}`,
          title: values.title,
          content: values.content,
          slug: values.slug,
          published: values.published,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setPages([newPage, ...pages]);
        
        toast({
          title: 'Page created (Demo Mode)',
          description: 'The new page has been created successfully in demo mode.',
        });
      }
      
      // Reset form and state
      setSelectedPage(null);
      setIsCreatingPage(false);
      form.reset();
      
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: 'Error saving page',
        description: 'There was a problem saving the page.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedPage(null);
    setIsCreatingPage(false);
    form.reset();
  };
  
  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      // Simulate delete for static site
      const filteredPages = pages.filter(page => page.id !== pageId);
      setPages(filteredPages);
      
      toast({
        title: 'Page deleted (Demo Mode)',
        description: 'The page has been deleted successfully in demo mode.',
      });
      
      // Reset form if we were editing this page
      if (selectedPage?.id === pageId) {
        setSelectedPage(null);
        setIsCreatingPage(false);
        form.reset();
      }
      
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: 'Error deleting page',
        description: 'There was a problem deleting the page.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Management (Demo Mode)</CardTitle>
          <CardDescription>
            Create and edit content pages for your website - Demo functionality only
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCreatingPage && !selectedPage && (
            <div className="mb-6">
              <Button onClick={handleCreatePage}>
                <Plus className="mr-2 h-4 w-4" /> Create New Page
              </Button>
            </div>
          )}
          
          {(isCreatingPage || selectedPage) ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSavePage)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (URL path)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[300px]" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Publish Page</FormLabel>
                        <div className="text-sm text-gray-500">
                          When enabled, this page will be visible on your website
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : selectedPage ? 'Update Page' : 'Create Page'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              {pages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pages have been created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <h3 className="font-medium">{page.title}</h3>
                        <p className="text-sm text-gray-500">/page/{page.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditPage(page)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePage(page.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {pages.length === 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Get Started</AlertTitle>
                  <AlertDescription>
                    Click the "Create New Page" button above to add your first content page.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageEditor;
