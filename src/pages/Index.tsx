
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const { isSupabaseReady } = useAuth();

  useEffect(() => {
    toast({
      title: "Welcome to Shree Bhagwati Caterers",
      description: "Explore our premium vegetarian catering services for your special events.",
      duration: 5000,
    });

    if (!isSupabaseReady) {
      console.warn("Supabase connection issue detected. Some features may not work properly.");
    }
  }, [toast, isSupabaseReady]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
