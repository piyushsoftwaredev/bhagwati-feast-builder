
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageEditor from '@/components/admin/PageEditor';
import ImageManager from '@/components/admin/ImageManager';
import PostManager from '@/components/admin/PostManager';
import MessagesManager from '@/components/admin/MessagesManager';
import SiteSettings from '@/components/admin/SiteSettings';
import AdminNav from '@/components/admin/AdminNav';
import { useToast } from '@/hooks/use-toast';
import { initializeDatabase } from '@/lib/supabase-functions';

const Dashboard = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        if (session?.user) {
          await initializeDatabase(session.user.id, session.user.email);
        }
        setInitialized(true);
      } catch (error) {
        console.error('Error setting up database:', error);
        toast({
          title: "Database Setup Error",
          description: "There was an issue setting up the database. Please try again or contact support.",
          variant: "destructive",
        });
      }
    };

    if (session && session.isAdmin && !initialized) {
      setupDatabase();
    }
  }, [session, initialized, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhagwati-gold mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    navigate('/login');
    return null;
  }

  if (!session.isAdmin) {
    toast({
      title: "Access Denied",
      description: "You do not have permission to access the dashboard",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bhagwati-maroon mb-6">Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="images">Media Library</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <PostManager />
          </TabsContent>
          
          <TabsContent value="pages" className="space-y-4">
            <PageEditor />
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <ImageManager />
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <MessagesManager />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
