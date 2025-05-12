
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const RecentPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .limit(3)
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

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-bhagwati-maroon mb-4">Recent Updates</h2>
            <p className="text-gray-600 mb-8">Loading recent posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bhagwati-maroon mb-4">Recent Updates</h2>
          <p className="text-gray-600">Latest news and updates from Shree Bhagwati Caterers</p>
        </div>

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
        
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button 
              variant="outline" 
              className="border-bhagwati-gold text-bhagwati-gold hover:bg-bhagwati-gold/10"
            >
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;
