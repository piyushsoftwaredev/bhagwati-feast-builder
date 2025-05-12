
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNav from '@/components/admin/AdminNav';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PostManager from '@/components/admin/PostManager';
import SiteSettings from '@/components/admin/SiteSettings';
import ImageManager from '@/components/admin/ImageManager';
import MessagesManager from '@/components/admin/MessagesManager';
import MapSettings from '@/components/admin/MapSettings';
import MenuManager from '@/components/admin/MenuManager';
import SiteConfig from '@/components/admin/SiteConfig';
import HomepageNavManager from '@/components/admin/HomepageNavManager';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatabaseType } from '@/lib/database-provider';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('site-settings');
  const [dbType, setDbType] = useState<DatabaseType>(DatabaseType.SUPABASE);
  const [loading, setLoading] = useState(true);
  
  // Parse active tab from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab) {
      setActiveTab(tab);
    } else {
      // Set default tab if none specified
      navigate('/admin?tab=site-settings', { replace: true });
    }
    
    setLoading(false);
  }, [location, navigate]);
  
  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin?tab=${value}`);
  };
  
  // Function to handle database connection changes
  const handleDatabaseChange = () => {
    // In a real implementation, this would show a modal to reconnect the database
    console.log('Reconnecting database...');
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-bhagwati-gold mx-auto" />
          <p className="mt-4 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the redirect will happen above
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNav />
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
  
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="hidden">
                <TabsTrigger value="site-settings">Settings</TabsTrigger>
                <TabsTrigger value="site-config">Site Config</TabsTrigger>
                <TabsTrigger value="homepage-nav">Homepage Nav</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
              </TabsList>
  
              <TabsContent value="site-settings">
                <SiteSettings dbType={dbType} onDatabaseChange={handleDatabaseChange} />
              </TabsContent>
              
              <TabsContent value="site-config">
                <SiteConfig />
              </TabsContent>
              
              <TabsContent value="homepage-nav">
                <HomepageNavManager />
              </TabsContent>
              
              <TabsContent value="map">
                <MapSettings />
              </TabsContent>
  
              <TabsContent value="posts">
                <PostManager />
              </TabsContent>

              <TabsContent value="menu">
                <MenuManager />
              </TabsContent>
  
              <TabsContent value="images">
                <ImageManager />
              </TabsContent>
  
              <TabsContent value="messages">
                <MessagesManager />
              </TabsContent>

              <TabsContent value="bookings">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-bhagwati-maroon mb-4">Booking Management</h2>
                  <p className="text-gray-600 mb-4">
                    This feature is coming soon! You'll soon be able to manage your event bookings here.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="database">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-bhagwati-maroon mb-4">Database Management</h2>
                  <p className="text-gray-600 mb-4">
                    This feature is coming soon! You'll soon be able to manage your database settings here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
