
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

// Static posts data - no backend needed
const staticPosts = [
  {
    id: 'post-1',
    title: 'Wedding Season Special Menus',
    content: 'Discover our exclusive wedding season menu featuring traditional and contemporary dishes crafted to make your special day unforgettable.',
    featured_image: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    created_at: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Corporate Catering Excellence',
    content: 'Professional catering solutions for corporate events, meetings, and conferences with customizable menus and impeccable service.',
    featured_image: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'post-3',
    title: 'Festive Season Celebrations',
    content: 'Traditional vegetarian delicacies for all your festive celebrations, prepared with authentic recipes and premium ingredients.',
    featured_image: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  }
];

const RecentPosts = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-bhagwati-maroon mb-6">
            Latest Updates
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest offerings and culinary innovations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staticPosts.map((post) => (
            <Card key={post.id} className="group hover-lift bg-white/80 backdrop-blur-lg border border-white/20 overflow-hidden">
              {post.featured_image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-bhagwati-maroon transition-colors text-lg">
                  {post.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.content}
                </p>
                <Button variant="outline" className="group/button border-bhagwati-gold text-bhagwati-gold hover:bg-bhagwati-gold hover:text-white">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;
