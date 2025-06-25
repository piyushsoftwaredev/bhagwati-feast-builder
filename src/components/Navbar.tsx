
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Glass Effect Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg' 
            : 'bg-white/95 backdrop-blur-md'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
        
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-bhagwati-maroon via-bhagwati-gold to-bhagwati-maroon bg-clip-text text-transparent">
                  Shree
                </span>
                <span className="ml-2 text-2xl md:text-3xl font-bold text-bhagwati-gold">
                  Bhagwati
                </span>
                <span className="ml-2 text-2xl md:text-3xl font-light text-bhagwati-maroon">
                  Caterers
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Services', href: '#services' },
                { name: 'Menu', href: '#menu' },
                { name: 'Gallery', href: '#gallery' },
                { name: 'About', href: '#about' },
                { name: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href.substring(1))}
                  className="relative px-4 py-2 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:text-bhagwati-maroon group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-bhagwati-gold/20 to-bhagwati-maroon/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                </a>
              ))}
              
              {/* CTA Button */}
              <Link
                to="/booking"
                className="ml-4 px-6 py-3 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Book Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-bhagwati-gold to-bhagwati-maroon opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-bhagwati-maroon hover:bg-white/30 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Services', href: '#services' },
                { name: 'Menu', href: '#menu' },
                { name: 'Gallery', href: '#gallery' },
                { name: 'About', href: '#about' },
                { name: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href.substring(1))}
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gradient-to-r hover:from-bhagwati-gold/20 hover:to-bhagwati-maroon/20 hover:text-bhagwati-maroon transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
              
              <Link
                to="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-4"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
