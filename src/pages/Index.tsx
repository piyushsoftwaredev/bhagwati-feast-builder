
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import RecentPosts from "@/components/RecentPosts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HomepageSection {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  component: string;
}

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: 'hero', name: 'Hero Banner', visible: true, order: 0, component: 'Hero' },
  { id: 'services', name: 'Our Services', visible: true, order: 1, component: 'Services' },
  { id: 'menu', name: 'Featured Menu', visible: true, order: 2, component: 'Menu' },
  { id: 'gallery', name: 'Photo Gallery', visible: true, order: 3, component: 'Gallery' },
  { id: 'recent-posts', name: 'Recent Posts', visible: true, order: 4, component: 'RecentPosts' },
  { id: 'about', name: 'About Us', visible: true, order: 5, component: 'About' },
  { id: 'contact', name: 'Contact Information', visible: true, order: 6, component: 'Contact' }
];

const Index = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Display welcome toast
    toast({
      title: "Welcome to Shree Bhagwati Caterers",
      description: "Explore our premium vegetarian catering services for your special events.",
      duration: 5000,
    });
    
    // Fetch homepage sections config
    const fetchHomepageSections = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('key', 'homepage_sections')
          .single();

        if (!error && data?.value) {
          setSections(data.value as HomepageSection[]);
        }
      } catch (error) {
        console.error('Error loading homepage sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageSections();
  }, [toast]);

  // Function to render component based on name
  const renderComponent = (componentName: string) => {
    switch (componentName) {
      case 'Hero': return <Hero />;
      case 'Services': return <Services />;
      case 'Menu': return <Menu />;
      case 'Gallery': return <Gallery />;
      case 'RecentPosts': return <RecentPosts />;
      case 'About': return <About />;
      case 'Contact': return <Contact />;
      default: return null;
    }
  };

  // Render visible sections in order
  const visibleSections = loading 
    ? DEFAULT_SECTIONS 
    : [...sections].sort((a, b) => a.order - b.order).filter(s => s.visible);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {visibleSections.map((section) => (
        <div key={section.id}>
          {renderComponent(section.component)}
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default Index;
