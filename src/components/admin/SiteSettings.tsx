import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { DatabaseType } from '@/lib/database-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Define props interface for SiteSettings
interface SiteSettingsProps {
  dbType: DatabaseType | null;
  onDatabaseChange: () => void;
}

const SiteSettings = ({ dbType, onDatabaseChange }: SiteSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'Bhagwati Feast',
    siteDescription: 'Premium Indian catering and event services',
    primaryColor: '#8B0000',
    secondaryColor: '#FFD700',
    fontFamily: 'Inter, sans-serif',
    contactEmail: 'contact@bhagwatifeast.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    businessHours: 'Mon-Fri: 9am-7pm, Sat-Sun: 10am-4pm',
    customCss: '',
    enableBooking: true,
    enableContact: true,
    socialFacebook: 'https://facebook.com/bhagwatifeast',
    socialInstagram: 'https://instagram.com/bhagwatifeast',
  });

  useEffect(() => {
    // Load settings from the database
    // This is a placeholder - you'll need to implement actual data loading
    const loadSettings = async () => {
      // In a real implementation, you would fetch from the database
      console.log('Loading settings...');
    };
    
    loadSettings();
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    try {
      // Save settings to the database
      // This is a placeholder - you'll need to implement actual saving logic
      console.log('Saving settings:', settings);
      
      // Show success toast
      toast({
        title: "Settings Saved",
        description: "Your site settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>
            Manage your database connection settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Current Database</AlertTitle>
              <AlertDescription>
                {dbType === DatabaseType.MYSQL ? 'Connected to local MySQL database' : 
                 dbType === DatabaseType.SUPABASE ? 'Connected to Supabase cloud database' : 
                 'Using demo mode (no database connection)'}
                <span className="ml-2 text-xs text-gray-500">
                  Connected at: 2025-05-05 03:16:41 • User: piyushsoftwaredev
                </span>
              </AlertDescription>
            </Alert>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline"
                onClick={onDatabaseChange}
              >
                Reconnect Database
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Implementation for exporting database
                  toast({
                    title: "Database Export",
                    description: "Database export started. This may take a moment."
                  });
                }}
              >
                Export Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>
            Basic information about your catering business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  value={settings.siteName} 
                  onChange={(e) => handleChange('siteName', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input 
                  id="siteDescription" 
                  value={settings.siteDescription} 
                  onChange={(e) => handleChange('siteDescription', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  type="email"
                  value={settings.contactEmail} 
                  onChange={(e) => handleChange('contactEmail', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone" 
                  value={settings.contactPhone} 
                  onChange={(e) => handleChange('contactPhone', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea 
                id="address" 
                value={settings.address} 
                onChange={(e) => handleChange('address', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessHours">Business Hours</Label>
              <Input 
                id="businessHours" 
                value={settings.businessHours} 
                onChange={(e) => handleChange('businessHours', e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex space-x-2">
                  <ColorPicker 
                    value={settings.primaryColor} 
                    onChange={(value) => handleChange('primaryColor', value)} 
                  />
                  <Input 
                    id="primaryColor" 
                    value={settings.primaryColor} 
                    onChange={(e) => handleChange('primaryColor', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex space-x-2">
                  <ColorPicker 
                    value={settings.secondaryColor} 
                    onChange={(value) => handleChange('secondaryColor', value)} 
                  />
                  <Input 
                    id="secondaryColor" 
                    value={settings.secondaryColor} 
                    onChange={(e) => handleChange('secondaryColor', e.target.value)} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Input 
                id="fontFamily" 
                value={settings.fontFamily} 
                onChange={(e) => handleChange('fontFamily', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea 
                id="customCss" 
                value={settings.customCss} 
                onChange={(e) => handleChange('customCss', e.target.value)} 
                className="font-mono text-sm h-32"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Enable or disable site features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableBooking" className="text-base">Enable Booking</Label>
                <p className="text-sm text-gray-500">Allow customers to book your services</p>
              </div>
              <Switch 
                id="enableBooking" 
                checked={settings.enableBooking}
                onCheckedChange={(checked) => handleChange('enableBooking', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableContact" className="text-base">Enable Contact Form</Label>
                <p className="text-sm text-gray-500">Show contact form on the contact page</p>
              </div>
              <Switch 
                id="enableContact" 
                checked={settings.enableContact}
                onCheckedChange={(checked) => handleChange('enableContact', checked)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Link your social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="socialFacebook">Facebook URL</Label>
              <Input 
                id="socialFacebook" 
                value={settings.socialFacebook} 
                onChange={(e) => handleChange('socialFacebook', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="socialInstagram">Instagram URL</Label>
              <Input 
                id="socialInstagram" 
                value={settings.socialInstagram} 
                onChange={(e) => handleChange('socialInstagram', e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
          className="bg-bhagwati-maroon hover:bg-red-900"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SiteSettings;