
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="content-container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="#home" className="flex items-center">
            <span className="text-bhagwati-maroon font-bold text-xl">Shree</span>
            <span className="text-bhagwati-gold font-bold text-2xl mx-1">BHAGWATI</span>
            <span className="text-bhagwati-maroon font-bold text-xl">Caterers</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-bhagwati-maroon hover:text-bhagwati-gold transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white">
            <Phone className="mr-2 h-4 w-4" /> Book Now
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-bhagwati-maroon hover:text-bhagwati-gold transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-md">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-bhagwati-maroon hover:text-bhagwati-gold py-2 transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white mt-3">
              <Phone className="mr-2 h-4 w-4" /> Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
