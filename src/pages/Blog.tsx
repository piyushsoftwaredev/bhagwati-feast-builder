
import { Link } from 'react-router-dom';
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

// Static blog posts data
const staticPosts = [
  {
    id: 'post-1',
    title: 'Wedding Season Special Menus',
    content: 'Discover our exclusive wedding season menu featuring traditional and contemporary dishes crafted to make your special day unforgettable. Our expert chefs have curated authentic recipes that celebrate the rich flavors of Indian cuisine.',
    featured_image: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    created_at: new Date().toISOString(),
    published: true,
  },
  {
    id: 'post-2',
    title: 'Corporate Catering Excellence',
    content: 'Professional catering solutions for corporate events, meetings, and conferences with customizable menus and impeccable service. We understand the importance of making a great impression at business events.',
    featured_image: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    published: true,
  },
  {
    id: 'post-3',
    title: 'Festive Season Celebrations',
    content: 'Traditional vegetarian delicacies for all your festive celebrations, prepared with authentic recipes and premium ingredients. From Diwali to Holi, we bring the taste of tradition to your celebrations.',
    featured_image: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    published: true,
  }
];

const Blog = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staticPosts.map((post) => (
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
