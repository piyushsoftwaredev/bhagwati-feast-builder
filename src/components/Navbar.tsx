
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
      {/* Professional Glass Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 glass-navbar ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Professional Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold text-lg">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-primary leading-tight">
                    {import.meta.env.VITE_BUSINESS_NAME?.split(' ')[0] || "Shree"}
                  </span>
                  <span className="text-sm font-medium text-secondary leading-tight">
                    {import.meta.env.VITE_BUSINESS_NAME?.split(' ').slice(1).join(' ') || "Bhagwati Caterers"}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
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
                  className="relative px-4 py-2 text-foreground/80 font-medium rounded-md transition-all duration-200 hover:text-primary hover:bg-accent/50 group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-200"></div>
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-2 rounded-md bg-accent/10 hover:bg-accent/20 text-primary transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
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
                  className="block px-4 py-3 text-foreground/80 font-medium rounded-md hover:bg-accent/50 hover:text-primary transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
