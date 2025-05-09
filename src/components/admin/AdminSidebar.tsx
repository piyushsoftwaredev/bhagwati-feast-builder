
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  Settings, 
  Image, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Server,
  MapPin,
  Calendar,
  BookOpen,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon, label, href, isActive, isCollapsed }: SidebarItemProps) => {
  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
        isActive 
          ? "bg-bhagwati-maroon/10 text-bhagwati-maroon font-medium" 
          : "text-gray-600 hover:bg-gray-100",
        isCollapsed && "justify-center"
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Extract the current path or tab from URL
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');
  
  const isActive = (path: string) => {
    if (path.startsWith('/admin?tab=')) {
      // For paths with tabs
      const tabName = path.split('=')[1];
      return currentTab === tabName;
    }
    // For regular paths
    return currentPath === path;
  };

  return (
    <div className={cn(
      "bg-white border-r h-[calc(100vh-64px)] sticky top-16 transition-all",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && (
          <h2 className="font-bold text-bhagwati-maroon">
            Bhagwati Admin
          </h2>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("p-1", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </Button>
      </div>
      
      <div className="space-y-1 p-2">
        <SidebarItem
          icon={<HomeIcon size={20} />}
          label="Dashboard"
          href="/dashboard"
          isActive={currentPath === '/dashboard'}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<FileText size={20} />}
          label="Posts"
          href="/admin?tab=posts"
          isActive={isActive('/admin?tab=posts')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<BookOpen size={20} />}
          label="Menu"
          href="/admin?tab=menu"
          isActive={isActive('/admin?tab=menu')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<Image size={20} />}
          label="Images"
          href="/admin?tab=images"
          isActive={isActive('/admin?tab=images')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<MessageSquare size={20} />}
          label="Messages"
          href="/admin?tab=messages"
          isActive={isActive('/admin?tab=messages')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<Calendar size={20} />}
          label="Bookings"
          href="/admin?tab=bookings"
          isActive={isActive('/admin?tab=bookings')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<MapPin size={20} />}
          label="Map Settings"
          href="/admin?tab=map"
          isActive={isActive('/admin?tab=map')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<Server size={20} />}
          label="Database"
          href="/admin?tab=database"
          isActive={isActive('/admin?tab=database')}
          isCollapsed={collapsed}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/admin?tab=settings"
          isActive={isActive('/admin?tab=settings')}
          isCollapsed={collapsed}
        />
      </div>
      
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">
            <p className="font-medium">Admin Panel</p>
            <p>Manage your website content and settings</p>
          </div>
          <Link to="/" className="flex items-center mt-2 text-xs text-bhagwati-gold hover:underline">
            View Website <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
