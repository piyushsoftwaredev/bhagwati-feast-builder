
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    guests: "",
    message: "",
  });
  
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventType: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    toast({
      title: "Inquiry Received!",
      description: "Thank you for reaching out. Our team will contact you shortly.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      date: "",
      guests: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Ready to create an unforgettable culinary experience for your next event?
            Get in touch with us today to discuss your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-bhagwati-maroon mb-6">Send us an Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-bhagwati-gold focus:ring-bhagwati-gold"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-bhagwati-gold focus:ring-bhagwati-gold"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="border-gray-300 focus:border-bhagwati-gold focus:ring-bhagwati-gold"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <Select onValueChange={handleSelectChange} value={formData.eventType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="religious">Religious Ceremony</SelectItem>
                    <SelectItem value="social">Social Gathering</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-bhagwati-gold focus:ring-bhagwati-gold"
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    value={formData.guests}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-bhagwati-gold focus:ring-bhagwati-gold"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message / Requirements
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-bhagwati-gold focus:ring-bhagwati-gold"
                />
              </div>
              
              <Button type="submit" className="w-full bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white">
                Submit Inquiry
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold text-bhagwati-maroon mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-bhagwati-gold mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-gray-600">+91 12345 67890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-bhagwati-gold mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@shreebhagwaticaterers.com</p>
                    <p className="text-gray-600">bookings@shreebhagwaticaterers.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-bhagwati-gold mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">123 Catering Complex, Food Street</p>
                    <p className="text-gray-600">Gujarat, India - 380001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-bhagwati-gold mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM to 7:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM to 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-bhagwati-maroon mb-6">Our Location</h3>
              <div className="h-80 bg-gray-200 rounded-md overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235527.45588965834!2d72.43965558836859!3d23.02049777354699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620041027135!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
