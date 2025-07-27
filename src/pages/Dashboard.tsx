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
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Removed database dependencies - using static configuration

const Dashboard = () => {
  const { session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [initialized, setInitialized] = useState(true); // Always initialized for static site
  const [loadingMessage] = useState('Loading dashboard...');

  // Current date and time (fixed as requested)
  const currentDateTime = "2025-05-05 03:27:36";
  const currentUser = "piyushsoftwaredev";

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
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect handled above
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-primary font-bold">
          Redirecting to login...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Static Website</AlertTitle>
          <AlertDescription>
            This is a static website using hardcoded data - no database required.
            <span className="ml-2 text-xs text-gray-500">
              Last updated: {currentDateTime} • User: {currentUser}
            </span>
          </AlertDescription>
        </Alert>

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
              onSettingsChange={() => {
                toast({
                  title: "Settings Updated",
                  description: "Site settings have been updated successfully.",
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