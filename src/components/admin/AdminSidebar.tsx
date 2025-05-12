
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Map,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Database,
  Menu as MenuIcon,
  Globe,
  Layout,
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the active tab from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'site-settings';
  
  // Navigation items with icons
  const navItems = [
    { 
      name: 'Settings',
      tab: 'site-settings',
      icon: <Settings className="h-5 w-5" />
    },
    { 
      name: 'Site Config',
      tab: 'site-config',
      icon: <Globe className="h-5 w-5" />
    },
    { 
      name: 'Homepage Nav',
      tab: 'homepage-nav',
      icon: <Layout className="h-5 w-5" />
    },
    { 
      name: 'Map',
      tab: 'map',
      icon: <Map className="h-5 w-5" />
    },
    { 
      name: 'Posts',
      tab: 'posts',
      icon: <FileText className="h-5 w-5" />
    },
    { 
      name: 'Menu',
      tab: 'menu',
      icon: <MenuIcon className="h-5 w-5" />
    },
    { 
      name: 'Images',
      tab: 'images',
      icon: <ImageIcon className="h-5 w-5" />
    },
    { 
      name: 'Messages',
      tab: 'messages',
      icon: <MessageSquare className="h-5 w-5" />
    },
    { 
      name: 'Bookings',
      tab: 'bookings',
      icon: <Calendar className="h-5 w-5" />
    },
    { 
      name: 'Database',
      tab: 'database',
      icon: <Database className="h-5 w-5" />
    }
  ];
  
  const handleNavClick = (tab: string) => {
    navigate(`/admin?tab=${tab}`);
  };
  
  return (
    <div className="w-64 border-r bg-white hidden md:block p-6 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.tab}
            variant={activeTab === item.tab ? "default" : "ghost"}
            className={cn(
              "justify-start",
              activeTab === item.tab && "bg-bhagwati-maroon text-white hover:bg-bhagwati-maroon/90"
            )}
            onClick={() => handleNavClick(item.tab)}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
