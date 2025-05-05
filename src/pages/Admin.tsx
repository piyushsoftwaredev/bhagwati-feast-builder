
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNav from '@/components/admin/AdminNav';
import PostManager from '@/components/admin/PostManager';
import SiteSettings from '@/components/admin/SiteSettings';
import ImageManager from '@/components/admin/ImageManager';
import MessagesManager from '@/components/admin/MessagesManager';
import MapSettings from '@/components/admin/MapSettings';
import { MessageSquare, Settings, Database, ImageIcon, Map } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('site-settings');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="site-settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="map-settings" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
              <span className="sm:hidden">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
              <span className="sm:hidden">Images</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-settings">
            <SiteSettings />
          </TabsContent>
          
          <TabsContent value="map-settings">
            <MapSettings />
          </TabsContent>

          <TabsContent value="posts">
            <PostManager />
          </TabsContent>

          <TabsContent value="images">
            <ImageManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
