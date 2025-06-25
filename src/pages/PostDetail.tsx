
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from 'date-fns';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import NotFound from './NotFound';

// Static posts data
const staticPosts = [
  {
    id: 'post-1',
    title: 'Wedding Season Special Menus',
    content: `<h2>Making Your Special Day Perfect</h2>
    <p>At Shree Bhagwati Caterers, we understand that your wedding day is one of the most important days of your life. Our exclusive wedding season menu features a carefully curated selection of traditional and contemporary dishes that will make your celebration truly unforgettable.</p>
    
    <h3>Our Wedding Menu Highlights</h3>
    <ul>
      <li>Traditional North Indian delicacies</li>
      <li>South Indian specialties</li>
      <li>Contemporary fusion dishes</li>
      <li>Custom dessert stations</li>
    </ul>
    
    <p>Our expert chefs use only the finest ingredients and authentic recipes passed down through generations to create a dining experience that your guests will remember forever.</p>`,
    featured_image: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published: true,
  },
  {
    id: 'post-2',
    title: 'Corporate Catering Excellence',
    content: `<h2>Professional Service for Business Events</h2>
    <p>Make a lasting impression at your next corporate event with our professional catering services. We understand the unique requirements of business gatherings and provide customizable menus that cater to diverse tastes and dietary preferences.</p>
    
    <h3>Corporate Services Include</h3>
    <ul>
      <li>Business lunch catering</li>
      <li>Conference and meeting refreshments</li>
      <li>Company celebration meals</li>
      <li>Executive dining experiences</li>
    </ul>
    
    <p>Our team ensures punctual service, professional presentation, and exceptional quality that reflects well on your organization.</p>`,
    featured_image: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    published: true,
  },
  {
    id: 'post-3',
    title: 'Festive Season Celebrations',
    content: `<h2>Traditional Flavors for Every Festival</h2>
    <p>Celebrate the rich traditions of Indian festivals with our specially crafted festive menus. From Diwali to Holi, from Navratri to Dussehra, we bring authentic flavors and traditional preparations to your celebrations.</p>
    
    <h3>Festival Specialties</h3>
    <ul>
      <li>Diwali sweets and savories</li>
      <li>Holi special thandai and snacks</li>
      <li>Navratri fasting menu</li>
      <li>Traditional prasadam preparations</li>
    </ul>
    
    <p>Each dish is prepared with devotion and attention to traditional cooking methods, ensuring that your festive celebrations are both delicious and authentic.</p>`,
    featured_image: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    published: true,
  }
];

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<typeof staticPosts[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const foundPost = staticPosts.find(p => p.id === id);
    
    if (!foundPost) {
      setNotFound(true);
    } else {
      setPost(foundPost);
    }
    
    setLoading(false);
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
