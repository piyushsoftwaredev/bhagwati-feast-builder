
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
import { getHomepageSections, type HomepageSection } from "@/lib/json-storage";

const Index = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Display welcome toast
    toast({
      title: "Welcome to Shree Bhagwati Caterers",
      description: "Explore our premium vegetarian catering services for your special events.",
      duration: 5000,
    });
    
    // Load homepage sections
    const loadHomepageSections = () => {
      try {
        const homepageSections = getHomepageSections();
        setSections(homepageSections);
      } catch (error) {
        console.error('Error loading homepage sections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomepageSections();
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
    ? [] 
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
