
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from 'date-fns';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import NotFound from './NotFound';

interface Post {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          setNotFound(true);
          return;
        }

        setPost(data as Post);
      } catch (err) {
        console.error('Error in post fetch:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (notFound) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="content-container py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bhagwati-gold"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="content-container py-16">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to all posts
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-bhagwati-maroon mb-4">{post.title}</h1>
          
          <div className="text-gray-500 mb-6">
            Published on {format(new Date(post.created_at), 'MMMM d, yyyy')}
            {post.updated_at !== post.created_at && 
              ` • Updated on ${format(new Date(post.updated_at), 'MMMM d, yyyy')}`
            }
          </div>

          {post.featured_image && (
            <div className="my-8">
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default PostDetail;
