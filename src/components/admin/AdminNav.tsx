
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Settings, Grid, Image, MessageCircle, FileText } from 'lucide-react';

const AdminNav = () => {
  const { signOut } = useAuth();

  return (
    <header className="bg-bhagwati-maroon text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-white font-bold text-xl">Shree</span>
            <span className="text-bhagwati-gold font-bold text-2xl mx-1">BHAGWATI</span>
            <span className="text-white font-bold text-xl">CMS</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-white hover:text-bhagwati-gold transition flex items-center">
            <Grid className="mr-1 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard?tab=posts" className="text-white hover:text-bhagwati-gold transition flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            <span>Posts</span>
          </Link>
          <Link to="/dashboard?tab=images" className="text-white hover:text-bhagwati-gold transition flex items-center">
            <Image className="mr-1 h-4 w-4" />
            <span>Media</span>
          </Link>
          <Link to="/dashboard?tab=messages" className="text-white hover:text-bhagwati-gold transition flex items-center">
            <MessageCircle className="mr-1 h-4 w-4" />
            <span>Messages</span>
          </Link>
          <Link to="/dashboard?tab=settings" className="text-white hover:text-bhagwati-gold transition flex items-center">
            <Settings className="mr-1 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white hover:text-bhagwati-gold flex items-center">
            <Home className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Link>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-bhagwati-maroon/80"
            onClick={signOut}
          >
            <LogOut className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
