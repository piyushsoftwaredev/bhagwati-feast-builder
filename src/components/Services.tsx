
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Users, UtensilsCrossed, Calendar, Gift, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";

const services = [
  {
    title: "Luxury Buffet Setups",
    description: "Opulent buffet arrangements with premium serving equipment, elegant displays, and sophisticated presentation.",
    icon: <Gift className="h-8 w-8 text-secondary" />,
    image: "/lovable-uploads/f3dd8b9e-0d8d-4025-b5c1-929eec597a75.png"
  },
  {
    title: "Premium Event Catering", 
    description: "High-end catering services with ornate chandeliers, luxury ambiance, and exceptional culinary experiences.",
    icon: <Users className="h-8 w-8 text-secondary" />,
    image: "/lovable-uploads/c2f8f321-f583-4ec1-abd3-f61a789ec22a.png"
  },
  {
    title: "Elegant Live Stations",
    description: "Interactive cooking stations with professional chefs and premium live cooking experiences.",
    icon: <Utensils className="h-8 w-8 text-secondary" />,
    image: "/lovable-uploads/32da8463-f389-487c-84b4-12d6c3cb623c.png"
  },
  {
    title: "Grand Wedding Receptions",
    description: "Spectacular wedding catering with lavish setups, crystal chandeliers, and royal dining experiences.",
    icon: <Calendar className="h-8 w-8 text-secondary" />,
    image: "/lovable-uploads/4e345c38-d584-4854-bd86-9417eb22256a.png"
  },
  {
    title: "Corporate Galas",
    description: "Professional luxury catering for corporate events with sophisticated presentation and premium service.",
    icon: <Award className="h-8 w-8 text-secondary" />,
    image: "/lovable-uploads/cb916d1d-c6aa-40bc-af47-e58fd0a5d003.png"
  },
  {
    title: "Festival Celebrations",
    description: "Traditional yet luxurious catering for cultural festivals with authentic flavors and elegant presentation.",
    icon: <UtensilsCrossed className="h-8 w-8 text-secondary" />,
    image: "/lovable-uploads/f1ea15f5-dbe8-48e2-9edf-ceaf395ec13e.png"
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-muted/20 via-background to-accent/10">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">Our Premium Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            Experience luxury catering at its finest - from ornate buffet setups to grand wedding receptions, 
            we deliver exceptional culinary experiences with unmatched elegance and sophistication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-500 hover:shadow-2xl border-none rounded-xl group">
              <div className="h-52 overflow-hidden relative">
                <LazyImage 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <CardHeader className="relative pb-2">
                <div className="absolute -top-8 left-6 bg-card p-4 rounded-full shadow-lg ring-1 ring-border/50 group-hover:ring-primary/20 transition-all duration-500">
                  {service.icon}
                </div>
                <CardTitle className="text-primary mt-8 text-xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10 transition-colors duration-300">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
