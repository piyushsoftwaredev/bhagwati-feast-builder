
import { useState, useEffect, useCallback } from 'react';
import { supabase, Post } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cache } from '@/lib/cache-service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, PlusCircle, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import PostEditor from './PostEditor';

const PostManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  // Memoized fetch posts function
  const fetchPosts = useCallback(async (useCache = true) => {
    setLoading(true);
    
    // Check cache first if enabled
    const cacheKey = 'posts-list';
    if (useCache) {
      const cachedPosts = cache.get<Post[]>(cacheKey);
      if (cachedPosts) {
        setPosts(cachedPosts);
        setLoading(false);
        console.log('Using cached posts data');
        return;
      }
    }
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const postsData = data || [];
      setPosts(postsData);
      
      // Cache the results
      cache.set(cacheKey, postsData, 5); // Cache for 5 minutes
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error loading posts',
        description: error.message || 'Failed to load posts. Ensure your database is properly set up.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete a post with cache invalidation
  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== id));
      
      // Invalidate cache
      cache.remove('posts-list');
      
      toast({
        title: 'Post Deleted',
        description: 'Post has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error deleting post',
        description: error.message || 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  // Toggle post published status with optimistic updates
  const togglePublished = async (post: Post) => {
    // Optimistic update for better UX
    const updatedPosts = posts.map(p => 
      p.id === post.id ? { ...p, published: !p.published } : p
    );
    setPosts(updatedPosts);
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;
      
      // Update cache
      cache.set('posts-list', updatedPosts, 5);
      
      toast({
        title: post.published ? 'Post Unpublished' : 'Post Published',
        description: `The post is now ${post.published ? 'unpublished' : 'published'}`,
      });
    } catch (error: any) {
      // Revert optimistic update on error
      setPosts(posts);
      console.error('Error toggling post status:', error);
      toast({
        title: 'Error updating post',
        description: error.message || 'Failed to update post status',
        variant: 'destructive',
      });
    }
  };

  // Update posts when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      // Use cache when the dialog closes to reduce loading time
      fetchPosts(false); // Force refresh when dialog closes
    }
  }, [isDialogOpen, fetchPosts]);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Posts</h2>
          <p className="text-muted-foreground">Create and manage blog posts for your website</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPost(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <PostEditor 
                post={editingPost} 
                onSave={() => setIsDialogOpen(false)} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-500">No posts created yet</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setEditingPost(null);
                setIsDialogOpen(true);
              }}
            >
              Create your first post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(post.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublished(post)}
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPost(post);
                            setIsDialogOpen(true);
                          }}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePost(post.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostManager;
