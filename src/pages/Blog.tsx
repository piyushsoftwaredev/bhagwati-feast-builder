
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  created_at: string;
  published: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }

        setPosts(data || []);
      } catch (err) {
        console.error('Error in posts fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-bhagwati-maroon mb-4">Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Latest news and updates from Shree Bhagwati Caterers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bhagwati-gold"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No posts published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(post.created_at), 'MMMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">
                      {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}
                      {post.content.length > 150 ? '...' : ''}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/post/${post.id}`} className="w-full">
                      <Button 
                        variant="outline" 
                        className="w-full border-bhagwati-maroon text-bhagwati-maroon hover:bg-bhagwati-maroon/10"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
