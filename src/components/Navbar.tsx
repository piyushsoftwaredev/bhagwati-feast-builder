
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { name: 'Home', href: '/#home' },
  { name: 'Services', href: '/#services' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { session, signOut } = useAuth();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Create path-aware link component
  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    // Check if it's a hash link on the homepage or a regular route
    if (to.startsWith('#') && isHomePage) {
      return (
        <a 
          href={to}
          className="text-bhagwati-maroon hover:text-bhagwati-gold transition-colors font-medium"
          onClick={() => setIsOpen(false)}
        >
          {children}
        </a>
      );
    } else if (to.startsWith('/#') && !isHomePage) {
      // Hash links from other pages should navigate to homepage first
      return (
        <Link
          to={to}
          className="text-bhagwati-maroon hover:text-bhagwati-gold transition-colors font-medium"
          onClick={() => setIsOpen(false)}
        >
          {children}
        </Link>
      );
    } else {
      // Regular links
      return (
        <Link
          to={to}
          className="text-bhagwati-maroon hover:text-bhagwati-gold transition-colors font-medium"
          onClick={() => setIsOpen(false)}
        >
          {children}
        </Link>
      );
    }
  };

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="content-container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <span className="text-bhagwati-maroon font-bold text-xl">Shree</span>
            <span className="text-bhagwati-gold font-bold text-2xl mx-1">BHAGWATI</span>
            <span className="text-bhagwati-maroon font-bold text-xl">Caterers</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.href}>
              {link.name}
            </NavLink>
          ))}
          
          {session ? (
            <div className="flex items-center space-x-2">
              {session.isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="text-bhagwati-maroon hover:text-bhagwati-gold hover:bg-transparent">
                    <User className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
              )}
              <Button 
                onClick={() => signOut()}
                variant="ghost" 
                className="text-bhagwati-maroon hover:text-bhagwati-gold hover:bg-transparent"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-bhagwati-maroon hover:text-bhagwati-gold hover:bg-transparent">
                  <User className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link to="/booking">
                <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white">
                  <Phone className="mr-2 h-4 w-4" /> Book Now
                </Button>
              </Link>
            </>
          )}
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
              <NavLink key={link.name} to={link.href}>
                {link.name}
              </NavLink>
            ))}
            
            {session ? (
              <>
                {session.isAdmin && (
                  <Link 
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-bhagwati-maroon hover:text-bhagwati-gold py-2 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-bhagwati-maroon hover:text-bhagwati-gold py-2 transition-colors font-medium text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-bhagwati-maroon hover:text-bhagwati-gold py-2 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/booking" onClick={() => setIsOpen(false)}>
                  <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white w-full">
                    <Phone className="mr-2 h-4 w-4" /> Book Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
