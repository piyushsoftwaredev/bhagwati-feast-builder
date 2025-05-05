
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
import { initializeDatabase, ensureStorageBuckets, createDatabaseFunctions } from '@/lib/supabase-functions';
import { cache } from '@/lib/cache-service';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      if (isInitializing) return; // Prevent multiple initialization attempts
      
      // Check if we've already initialized in this session via cache
      const cacheKey = `db-initialized-${session?.user?.id}`;
      if (cache.has(cacheKey)) {
        setInitialized(true);
        return;
      }
      
      setIsInitializing(true);
      setInitError(null);
      
      try {
        console.log('Setting up database for user:', session?.user?.id);
        
        if (session?.user) {
          // Use a single comprehensive initialization function
          const { success, message } = await initializeDatabaseComponents(session.user.id, session.user.email);
          
          if (success) {
            setInitialized(true);
            // Cache the initialization status for 30 minutes
            cache.set(cacheKey, true, 30);
            console.log('Database and storage setup complete');
          } else {
            setInitError(message || 'Database initialization incomplete. Some features may be unavailable.');
          }
        }
      } catch (error: any) {
        console.error('Error setting up database:', error);
        setInitError('Failed to initialize the database. Please try again or contact support.');
        
        toast({
          title: "Database Setup Error",
          description: "There was an issue setting up the database. Please try again or contact support.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    // Combined initialization function to reduce load time
    const initializeDatabaseComponents = async (userId?: string, userEmail?: string) => {
      try {
        // Initialize in parallel rather than sequentially
        const [dbResult, storageResult, functionsResult] = await Promise.all([
          initializeDatabase(userId, userEmail),
          ensureStorageBuckets(),
          createDatabaseFunctions()
        ]);
        
        if (dbResult && storageResult && functionsResult) {
          return { success: true };
        } else {
          return { 
            success: false, 
            message: 'Some database components failed to initialize. The application may have limited functionality.' 
          };
        }
      } catch (error) {
        console.error('Error during database initialization:', error);
        return { 
          success: false, 
          message: 'Error initializing database components.' 
        };
      }
    };

    if (session && session.isAdmin && !initialized && !isInitializing) {
      setupDatabase();
    }
  }, [session, initialized, toast, isInitializing]);

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
        
        {initError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>
              {initError}
              <button 
                className="ml-2 underline"
                onClick={() => {
                  setInitialized(false);
                  setIsInitializing(false);
                  // Clear the cache to force reinitialization
                  cache.remove(`db-initialized-${session?.user?.id}`);
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
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="images">Media Library</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {initialized ? <PostManager /> : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
                  <p className="mt-4">Waiting for database initialization...</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pages" className="space-y-4">
            {initialized ? <PageEditor /> : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
                  <p className="mt-4">Waiting for database initialization...</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            {initialized ? <ImageManager /> : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
                  <p className="mt-4">Waiting for database initialization...</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            {initialized ? <MessagesManager /> : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
                  <p className="mt-4">Waiting for database initialization...</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            {initialized ? <SiteSettings /> : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
                  <p className="mt-4">Waiting for database initialization...</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
