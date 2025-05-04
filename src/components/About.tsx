
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 jali-bg">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-heading">About Shree Bhagwati Caterers</h2>
            <p className="text-gray-700 mb-6">
              Shree Bhagwati Caterers is a renowned name in the world of premium vegetarian catering, proudly serving unforgettable culinary experiences across weddings, school functions, parties, corporate events, religious gatherings, and luxury celebrations.
            </p>
            <p className="text-gray-700 mb-6">
              With decades of experience, we have become a trusted partner for families and organizations looking to impress their guests with authentic vegetarian cuisine, outstanding service, and elegant presentation.
            </p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-bhagwati-maroon mb-3">Our Specialties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Gujarati', 'Rajasthani', 'Punjabi', 'South Indian', 'Maharashtrian', 'Italian', 'Thai', 'Mexican', 'Chinese'].map((cuisine, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-bhagwati-gold mr-2" />
                    <span>{cuisine} Cuisine</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="public/lovable-uploads/fcc83566-eb0f-46e6-9401-1b4837300c76.png" 
              alt="About Shree Bhagwati Caterers" 
              className="rounded-lg shadow-xl relative z-10"
            />
            <div className="absolute -bottom-5 -left-5 w-full h-full border-2 border-bhagwati-gold rounded-lg z-0"></div>
            
            <Card className="absolute -bottom-10 -right-10 max-w-xs z-20 shadow-xl gold-border">
              <CardContent className="p-4">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-bhagwati-gold fill-bhagwati-gold" />
                  ))}
                </div>
                <p className="text-sm italic">
                  "The presentation, taste, and service were impeccable. Shree Bhagwati Caterers made our wedding reception truly memorable!"
                </p>
                <p className="mt-3 font-semibold text-bhagwati-maroon">- Mehta Family</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-bhagwati-gold mb-2">25+</div>
              <div className="text-bhagwati-maroon font-medium">Years Experience</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-bhagwati-gold mb-2">5000+</div>
              <div className="text-bhagwati-maroon font-medium">Events Catered</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-bhagwati-gold mb-2">100+</div>
              <div className="text-bhagwati-maroon font-medium">Staff Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="text-4xl font-bold text-bhagwati-gold mb-2">15+</div>
              <div className="text-bhagwati-maroon font-medium">Cuisine Types</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
