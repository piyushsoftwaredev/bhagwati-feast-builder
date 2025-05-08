
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase, Post, uploadImage } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import ImageUploader from './ImageUploader';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  published: z.boolean().default(false),
  featured_image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PostEditorProps {
  post?: Post | null;
  onSave?: () => void;
  isDemo?: boolean;
}

const PostEditor = ({ post, onSave, isDemo = false }: PostEditorProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(post?.featured_image);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      published: post?.published || false,
      featured_image: post?.featured_image || "",
    }
  });

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id && !isDemo) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create or edit posts',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        ...values,
        featured_image: featuredImage,
        updated_at: new Date().toISOString(),
      };

      if (isDemo) {
        // Handle demo mode - just simulate success
        setTimeout(() => {
          toast({
            title: post?.id ? 'Post Updated' : 'Post Created',
            description: `The post has been ${post?.id ? 'updated' : 'created'} successfully in demo mode`,
          });
          if (onSave) onSave();
        }, 500);
        return;
      }

      if (post?.id) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);
        
        if (error) throw error;
        
        toast({
          title: 'Post Updated',
          description: 'The post has been updated successfully',
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([{
            ...postData,
            author_id: session?.user?.id || 'demo-user',
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        
        toast({
          title: 'Post Created',
          description: 'The new post has been created successfully',
        });
      }

      // Reset form for new posts
      if (!post?.id) {
        form.reset({
          title: "",
          content: "",
          published: false,
          featured_image: "",
        });
        setFeaturedImage(undefined);
      }
      
      if (onSave) onSave();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error Saving Post',
        description: error.message || 'There was a problem saving the post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    setFeaturedImage(imageUrl);
    form.setValue('featured_image', imageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
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
                <Textarea 
                  placeholder="Write your post content here..." 
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <ImageUploader 
                  currentImage={featuredImage} 
                  onImageSelected={handleImageUpload}
                />
              </FormControl>
              <FormDescription>
                Upload a featured image for your post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Publish Post
                </FormLabel>
                <FormDescription>
                  When turned on, the post will be visible on your website
                </FormDescription>
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

        <div className="flex justify-end gap-3">
          {onSave && (
            <Button type="button" variant="outline" onClick={onSave} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : post?.id ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostEditor;
