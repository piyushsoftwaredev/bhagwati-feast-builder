
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center jali-bg pt-20"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(public/lovable-uploads/d269b48e-612e-4705-86db-369974728a52.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="content-container text-center md:text-left flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-bhagwati-maroon">Exquisite</span>
            <span className="text-bhagwati-gold block mt-2">Vegetarian Catering</span>
            <span className="text-bhagwati-maroon block mt-2">For Your Special Events</span>
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
            Creating unforgettable culinary experiences with authentic flavors, elegant presentations, and impeccable service.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90 text-white px-8 py-6">
              Our Services
            </Button>
            <Button variant="outline" className="border-bhagwati-gold text-bhagwati-gold hover:bg-bhagwati-gold/5 px-8 py-6">
              Contact Us
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative">
            <img 
              src="public/lovable-uploads/552bbf7d-7306-47f5-8053-d68be3010abf.png" 
              alt="Bhagwati Catering Service" 
              className="rounded-lg shadow-xl relative z-10 max-w-full md:max-w-md"
            />
            <div className="absolute -bottom-5 -right-5 w-full h-full border-2 border-bhagwati-gold rounded-lg z-0"></div>
            <div className="absolute -top-5 -left-5 w-32 h-32 bg-bhagwati-gold/10 rounded-full z-0"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <a 
          href="#services" 
          className="animate-bounce p-2 bg-white/80 rounded-full shadow-lg"
        >
          <ChevronDown className="text-bhagwati-maroon" size={24} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
