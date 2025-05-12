import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { session } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!session?.user;

  useEffect(() => {
    // Close the mobile menu when the route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const getNavLinkClass = (isActive: boolean) => {
    return `block py-2 px-4 rounded transition-colors duration-200
      ${isActive
        ? 'text-bhagwati-maroon font-semibold'
        : 'text-gray-700 hover:bg-gray-100 hover:text-bhagwati-maroon'
      }`;
  };

  const getMobileNavLinkClass = (isActive: boolean) => {
    return `block py-2 px-4 text-left rounded transition-colors duration-200
      ${isActive
        ? 'text-bhagwati-maroon font-semibold bg-gray-100'
        : 'text-gray-700 hover:bg-gray-100 hover:text-bhagwati-maroon'
      }`;
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm py-4 fixed w-full top-0 z-50 shadow-sm">
      <div className="content-container flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl text-bhagwati-maroon">
              Shree <span className="text-bhagwati-gold">Bhagwati</span> Caterers
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink 
            to="/#home" 
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={(e) => handleNavLinkClick(e, 'home')}
          >
            Home
          </NavLink>
          <NavLink 
            to="/#services" 
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={(e) => handleNavLinkClick(e, 'services')}
          >
            Services
          </NavLink>
          <NavLink 
            to="/menu" 
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Menu
          </NavLink>
          <NavLink 
            to="/blog" 
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Blog
          </NavLink>
          <NavLink 
            to="/#about" 
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={(e) => handleNavLinkClick(e, 'about')}
          >
            About
          </NavLink>
          <NavLink 
            to="/#contact" 
            className={({ isActive }) => getNavLinkClass(isActive)}
            onClick={(e) => handleNavLinkClick(e, 'contact')}
          >
            Contact
          </NavLink>
          <NavLink 
            to="/booking" 
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Book Now
          </NavLink>
          {/* Admin link only shows if authenticated */}
          {isAuthenticated && (
            <NavLink
              to="/admin"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 right-0 border-t border-gray-200 shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            <NavLink 
              to="/#home" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={(e) => {
                handleNavLinkClick(e, 'home');
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </NavLink>
            <NavLink 
              to="/#services" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={(e) => {
                handleNavLinkClick(e, 'services');
                setIsMobileMenuOpen(false);
              }}
            >
              Services
            </NavLink>
            <NavLink 
              to="/menu" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </NavLink>
            <NavLink 
              to="/#about" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={(e) => {
                handleNavLinkClick(e, 'about');
                setIsMobileMenuOpen(false);
              }}
            >
              About
            </NavLink>
            <NavLink 
              to="/#contact" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={(e) => {
                handleNavLinkClick(e, 'contact');
                setIsMobileMenuOpen(false);
              }}
            >
              Contact
            </NavLink>
            <NavLink 
              to="/booking" 
              className={({ isActive }) => getMobileNavLinkClass(isActive)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Now
            </NavLink>
            {/* Admin link only shows if authenticated */}
            {isAuthenticated && (
              <NavLink
                to="/admin"
                className={({ isActive }) => getMobileNavLinkClass(isActive)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
