
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { addPost, updatePost, type Post } from '@/lib/json-storage';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  featured_image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PostEditorProps {
  post?: Post | null;
  onSave?: () => void;
}

const PostEditor = ({ post, onSave }: PostEditorProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      published: post?.published || false,
      featured: post?.featured || false,
      featured_image: post?.featured_image || "",
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (post?.id) {
        // Update existing post
        const updatedPost = updatePost(post.id, values);
        
        if (updatedPost) {
          toast({
            title: 'Post Updated',
            description: 'The post has been updated successfully',
          });
        } else {
          throw new Error('Failed to update post');
        }
      } else {
        // Create new post
        const newPost = addPost({
          ...values,
          author_id: 'admin',
        });

        if (newPost) {
          toast({
            title: 'Post Created',
            description: 'The new post has been created successfully',
          });
          
          // Reset form for new posts
          form.reset({
            title: "",
            content: "",
            published: false,
            featured: false,
            featured_image: "",
          });
        } else {
          throw new Error('Failed to create post');
        }
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
              <FormLabel>Featured Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the URL of the featured image for your post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Feature Post
                  </FormLabel>
                  <FormDescription>
                    Show this post prominently on the homepage
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
        </div>

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
