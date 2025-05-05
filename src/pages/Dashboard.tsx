
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
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const { session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Check Supabase connection first
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection();
        setInitialized(connected);
        setConnectionChecked(true);
        
        if (!connected) {
          setInitError("Could not connect to database. Using demo mode.");
          toast({
            title: "Database Connection Issue",
            description: "Using demo mode. Some features may be limited.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setInitialized(true); // Continue in demo mode
        setConnectionChecked(true);
        setInitError("Error checking database connection. Using demo mode.");
      }
    };
    
    if (!connectionChecked && !authLoading && session) {
      checkConnection();
    }
  }, [authLoading, session, connectionChecked, toast]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhagwati-gold mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bhagwati-maroon mb-6">Dashboard</h1>
        
        {initError && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Notice</AlertTitle>
            <AlertDescription>
              {initError}
              <button 
                className="ml-2 underline"
                onClick={() => {
                  setConnectionChecked(false);
                  setInitError(null);
                }}
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        )}
        
        {isInitializing && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setting up database</AlertTitle>
            <AlertDescription>
              Please wait while we prepare your admin dashboard...
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="images">Media</TabsTrigger>
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
