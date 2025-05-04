
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-white font-bold text-xl">Shree</span>
              <span className="text-bhagwati-gold font-bold text-2xl mx-1">BHAGWATI</span>
              <span className="text-white font-bold text-xl">Caterers</span>
            </div>
            <p className="mb-6 text-gray-400">
              Creating unforgettable culinary experiences with authentic flavors, elegant 
              presentations, and impeccable service since 1998.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-bhagwati-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-bhagwati-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-bhagwati-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-bhagwati-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-bhagwati-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-bhagwati-gold">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Wedding Catering</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Corporate Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Social Gatherings</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Religious Ceremonies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Luxury Catering</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Live Counters</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-bhagwati-gold">Newsletter</h3>
            <p className="mb-4 text-gray-400">
              Subscribe to our newsletter for exclusive updates and special offers.
            </p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white">
                Subscribe
              </Button>
            </div>
            
            <div className="mt-6 space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>info@shreebhagwaticaterers.com</span>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>123 Catering Complex, Food Street<br />Gujarat, India - 380001</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Shree Bhagwati Caterers. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
