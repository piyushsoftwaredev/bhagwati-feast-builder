
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Users, UtensilsCrossed, Calendar, Gift, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Wedding Feasts",
    description: "Exquisite vegetarian spreads for your special day with customized menus and elegant presentations.",
    icon: <Gift className="h-8 w-8 text-bhagwati-gold" />,
    image: "public/lovable-uploads/5adc614d-01a0-4509-b84e-4d7ec509df13.png"
  },
  {
    title: "Corporate Events",
    description: "Impress your clients and team with professional catering services tailored to your business needs.",
    icon: <Users className="h-8 w-8 text-bhagwati-gold" />,
    image: "public/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png"
  },
  {
    title: "Social Gatherings",
    description: "From intimate gatherings to grand celebrations, we create memorable dining experiences.",
    icon: <Utensils className="h-8 w-8 text-bhagwati-gold" />,
    image: "public/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png"
  },
  {
    title: "Religious Ceremonies",
    description: "Pure vegetarian catering for religious events with authentic traditional recipes.",
    icon: <Calendar className="h-8 w-8 text-bhagwati-gold" />,
    image: "public/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png"
  },
  {
    title: "Luxury Catering",
    description: "Premium catering services with exotic cuisines and personalized dining experiences.",
    icon: <Award className="h-8 w-8 text-bhagwati-gold" />,
    image: "public/lovable-uploads/c83694ad-699f-427b-838a-2053287781c1.png"
  },
  {
    title: "Live Counters",
    description: "Interactive food stations with expert chefs preparing delicacies right in front of your guests.",
    icon: <UtensilsCrossed className="h-8 w-8 text-bhagwati-gold" />,
    image: "public/lovable-uploads/0ce92a39-38f1-496f-9e8e-dffecfd7bca5.png"
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 jali-bg">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">Our Premium Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            At Shree Bhagwati Caterers, we offer a variety of premium catering services 
            designed to make your events truly special and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg border-none">
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="relative">
                <div className="absolute -top-8 left-4 bg-white p-3 rounded-full shadow-md">
                  {service.icon}
                </div>
                <CardTitle className="text-bhagwati-maroon mt-6">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-bhagwati-gold text-bhagwati-gold hover:bg-bhagwati-gold/10">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white px-8 py-6">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
