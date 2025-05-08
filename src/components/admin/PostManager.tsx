
import { useState, useEffect, useCallback } from 'react';
import { supabase, Post, demoData } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, PlusCircle, Eye, EyeOff } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import PostEditor from './PostEditor';

const PostManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  
  const { toast } = useToast();

  // Memoized fetch posts function
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Using demo data due to error:', error);
        setPosts(demoData.posts);
        setIsDemo(true);
      } else {
        const postsData = data || [];
        setPosts(postsData);
        setIsDemo(false);
      }
    } catch (error: any) {
      console.warn('Using demo data due to exception:', error);
      setPosts(demoData.posts);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a post
  const deletePost = async (id: string) => {
    try {
      if (isDemo) {
        // Handle demo mode deletion
        setPosts(posts.filter(post => post.id !== id));
        toast({
          title: 'Post Deleted',
          description: 'Post has been deleted in demo mode',
        });
        return;
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== id));
      
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
    // Optimistic update
    const updatedPosts = posts.map(p => 
      p.id === post.id ? { ...p, published: !p.published } : p
    );
    setPosts(updatedPosts);
    
    try {
      if (!isDemo) {
        const { error } = await supabase
          .from('posts')
          .update({ published: !post.published })
          .eq('id', post.id);

        if (error) throw error;
      }
      
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

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Update posts when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      fetchPosts();
    }
  }, [isDialogOpen, fetchPosts]);

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
                isDemo={isDemo}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isDemo && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Running in demo mode. Changes won't be saved to the database.
              </p>
            </div>
          </div>
        </div>
      )}

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
          <CardHeader>
            <CardTitle>Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                  <TableHead className="hidden md:table-cell">Updated</TableHead>
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
                    <TableCell className="hidden sm:table-cell">{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(post.updated_at), 'MMM d, yyyy')}</TableCell>
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
