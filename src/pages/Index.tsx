
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MenuPDFPreview from "@/components/MenuPDFPreview";
import GoogleReviews from "@/components/GoogleReviews";
import RecentPosts from "@/components/RecentPosts";
import { useToast } from "@/hooks/use-toast";
import { envConfig } from "@/lib/env-config";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Display welcome toast
    toast({
      title: `Welcome to ${envConfig.business.name}`,
      description: "Explore our premium vegetarian catering services for your special events.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <MenuPDFPreview />
      <GoogleReviews />
      <Gallery />
      <RecentPosts />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
