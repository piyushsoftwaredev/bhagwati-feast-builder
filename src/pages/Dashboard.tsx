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
import { initializeDatabaseProvider, getCurrentDatabase, DatabaseType, initializeDatabase } from '@/lib/database-provider';
import { AlertCircle, Loader2 } from 'lucide-react';
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
  const [dbType, setDbType] = useState<DatabaseType | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading dashboard...');

  // Current date and time (fixed as requested)
  const currentDateTime = "2025-05-05 03:27:36";
  const currentUser = "piyushsoftwaredev";

  // Check database connection first
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoadingMessage('Checking database connection...');
        setIsInitializing(true);
        
        // Try to connect to available databases (MySQL first, then Supabase)
        const databaseType = await initializeDatabaseProvider();
        setDbType(databaseType);
        setConnectionChecked(true);
        
        if (databaseType === DatabaseType.DEMO) {
          setInitError("Could not connect to any database. Using demo mode.");
          toast({
            title: "Database Connection Issue",
            description: "Using demo mode. Some features may be limited.",
            variant: "destructive",
          });
          setInitialized(true); // Still mark as initialized to show the UI
          setIsInitializing(false);
        } else {
          // Initialize database if needed
          if (session?.user) {
            setLoadingMessage('Initializing database tables...');
            try {
              const success = await initializeDatabase(
                session.user.id,
                session.user.email || ''
              );
              
              if (success) {
                setInitialized(true);
                toast({
                  title: "Database Connected",
                  description: `Connected to ${databaseType === DatabaseType.MYSQL ? 'local MySQL' : 'Supabase'} database.`,
                  variant: "default",
                });
              } else {
                setInitError("Database initialization failed. Using demo mode.");
                toast({
                  title: "Database Initialization Issue",
                  description: "Failed to initialize database. Some features may be limited.",
                  variant: "destructive",
                });
                setInitialized(true); // Still mark as initialized to show the UI
              }
            } catch (err) {
              console.error("Database initialization error:", err);
              setInitError("Database initialization error. Using demo mode.");
              setInitialized(true); // Still mark as initialized to show the UI
            }
          } else {
            setInitialized(true);
          }
          
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setInitialized(true); // Continue in demo mode
        setConnectionChecked(true);
        setIsInitializing(false);
        setInitError("Error checking database connections. Using demo mode.");
        
        toast({
          title: "Database Connection Error",
          description: "Failed to connect to any database. Using demo mode.",
          variant: "destructive",
        });
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

  // Show loading state while auth is being checked or database is initializing
  if (authLoading || isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-bhagwati-gold mx-auto" />
          <p className="mt-4 text-lg">{loadingMessage}</p>
          {isInitializing && (
            <p className="mt-2 text-sm text-gray-500">
              This may take a moment if tables need to be created.
            </p>
          )}
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
        
        {dbType && dbType !== DatabaseType.DEMO && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connected</AlertTitle>
            <AlertDescription>
              Using {dbType === DatabaseType.MYSQL ? 'local MySQL' : 'Supabase'} database.
              <span className="ml-2 text-xs text-gray-500">
                Connected at: {currentDateTime} • User: {currentUser}
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        {initError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Notice</AlertTitle>
            <AlertDescription>
              {initError}
              <button 
                className="ml-2 underline"
                onClick={() => {
                  setConnectionChecked(false);
                  setInitError(null);
                  setInitialized(false);
                  setIsInitializing(true);
                  
                  // Force reinitialization
                  initializeDatabaseProvider(true).then(dbType => {
                    setDbType(dbType);
                    setConnectionChecked(true);
                    
                    if (dbType === DatabaseType.DEMO) {
                      setInitError("Could not connect to any database. Using demo mode.");
                      setInitialized(true);
                    } else if (session?.user) {
                      initializeDatabase(session.user.id, session.user.email || '').then(success => {
                        setInitialized(true);
                        if (!success) {
                          setInitError("Database initialization failed. Using demo mode.");
                        }
                      }).catch(err => {
                        console.error("Database initialization error:", err);
                        setInitError("Database initialization error. Using demo mode.");
                        setInitialized(true);
                      });
                    } else {
                      setInitialized(true);
                    }
                    
                    setIsInitializing(false);
                  }).catch(err => {
                    console.error("Connection check error:", err);
                    setInitialized(true);
                    setConnectionChecked(true);
                    setIsInitializing(false);
                    setInitError("Error checking database connections. Using demo mode.");
                  });
                }}
              >
                Try again
              </button>
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
            <SiteSettings 
              dbType={dbType}
              onDatabaseChange={() => {
                setConnectionChecked(false);
                setInitialized(false);
                setInitError(null);
                setIsInitializing(true);
                
                // Force reinitialization
                initializeDatabaseProvider(true).then(databaseType => {
                  setDbType(databaseType);
                  setConnectionChecked(true);
                  
                  if (session?.user) {
                    initializeDatabase(session.user.id, session.user.email || '')
                      .then(() => {
                        setInitialized(true);
                        setIsInitializing(false);
                        toast({
                          title: "Database Connection Updated",
                          description: `Now using ${databaseType} database.`,
                        });
                      })
                      .catch(error => {
                        console.error("Database initialization error:", error);
                        setInitialized(true);
                        setIsInitializing(false);
                        setInitError("Database initialization failed. Some features may be limited.");
                      });
                  } else {
                    setInitialized(true);
                    setIsInitializing(false);
                  }
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;