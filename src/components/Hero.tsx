
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center hero-pattern pt-20 bg-gradient-to-br from-background via-background/95 to-accent/5"
    >
      <div className="content-container text-center md:text-left flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-primary">Exquisite</span>
            <span className="text-secondary block mt-2">Vegetarian Catering</span>
            <span className="text-primary block mt-2">For Your Special Events</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
            Creating unforgettable culinary experiences with authentic flavors, elegant presentations, and impeccable service.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/booking">
              <Button size="lg" className="cta-button bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 w-full sm:w-auto">
                Book Now
              </Button>
            </Link>
            <Link to="#menu">
              <Button size="lg" variant="outline" className="cta-button border-secondary text-secondary hover:bg-secondary/5 px-8 py-3 w-full sm:w-auto">
                View Menu
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative">
            <img 
              src="/lovable-uploads/c2f8f321-f583-4ec1-abd3-f61a789ec22a.png" 
              alt="Luxurious Catering Setup with Elegant Chandeliers and Premium Service" 
              className="rounded-xl shadow-2xl relative z-10 max-w-full md:max-w-md smooth-lift"
              loading="eager"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-secondary/30 rounded-xl z-0"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full z-0"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a 
          href="#services" 
          className="animate-bounce p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <ChevronDown className="text-primary" size={20} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
