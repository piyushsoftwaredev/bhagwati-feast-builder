
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
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const createRequiredTables = async () => {
      try {
        // Check if posts table exists
        const { error: postsCheckError } = await supabase
          .from('posts')
          .select('id')
          .limit(1);
          
        // If table doesn't exist, create it
        if (postsCheckError && postsCheckError.code === 'PGRST116') {
          const { error: postsCreateError } = await supabase.rpc('create_posts_table');
          if (postsCreateError) {
            console.error('Error creating posts table:', postsCreateError);
            // Try to create it directly
            await supabase.query(`
              CREATE TABLE IF NOT EXISTS posts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title TEXT NOT NULL,
                content TEXT,
                featured_image TEXT,
                published BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                author_id UUID REFERENCES auth.users(id)
              );
            `);
          }
        }

        // Check if site_config table exists
        const { error: configCheckError } = await supabase
          .from('site_config')
          .select('id')
          .limit(1);
          
        // If table doesn't exist, create it
        if (configCheckError && configCheckError.code === 'PGRST116') {
          await supabase.query(`
            CREATE TABLE IF NOT EXISTS site_config (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              key TEXT UNIQUE NOT NULL,
              value JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);
        }

        // Check if contact_messages table exists
        const { error: messagesCheckError } = await supabase
          .from('contact_messages')
          .select('id')
          .limit(1);
          
        // If table doesn't exist, create it
        if (messagesCheckError && messagesCheckError.code === 'PGRST116') {
          await supabase.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT,
              message TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);
        }

        // Check if booking_requests table exists
        const { error: bookingsCheckError } = await supabase
          .from('booking_requests')
          .select('id')
          .limit(1);
          
        // If table doesn't exist, create it
        if (bookingsCheckError && bookingsCheckError.code === 'PGRST116') {
          await supabase.query(`
            CREATE TABLE IF NOT EXISTS booking_requests (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT,
              event_type TEXT NOT NULL,
              date DATE NOT NULL,
              guest_count INTEGER NOT NULL,
              message TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);
        }
        
        // Check if profiles table exists
        const { error: profilesCheckError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        // If table doesn't exist, create it
        if (profilesCheckError && profilesCheckError.code === 'PGRST116') {
          await supabase.query(`
            CREATE TABLE IF NOT EXISTS profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id),
              email TEXT,
              role TEXT DEFAULT 'user',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);
          
          // If the current user exists, create their profile as admin
          if (session?.user) {
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                role: 'admin'
              });
          }
        }

        setInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    if (session && session.isAdmin && !initialized) {
      createRequiredTables();
    }
  }, [session, initialized]);

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
