
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface MapSettings {
  mapbox_token: string;
  latitude: string;
  longitude: string;
  zoom: number;
  map_style: string;
  show_map_on_homepage: boolean;
  show_map_in_footer: boolean;
  map_height: number;
  pin_title: string;
  pin_description: string;
}

const defaultMapSettings: MapSettings = {
  mapbox_token: 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDBkbTk5YWYwOHZsM2NxcWs1OG9ka2tuIn0.0wNxwnNjJPWZMkCGc8gpXw',
  latitude: '19.0760',
  longitude: '72.8777',
  zoom: 12,
  map_style: 'mapbox://styles/mapbox/streets-v12',
  show_map_on_homepage: true,
  show_map_in_footer: false,
  map_height: 400,
  pin_title: 'Shree Bhagwati Caterers',
  pin_description: 'Premium Vegetarian Catering Services',
};

const MapSettings = () => {
  const [settings, setSettings] = useState<MapSettings>(defaultMapSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('key', 'map_settings')
          .single();

        if (error) {
          console.error('Error fetching map settings:', error);
          return;
        }

        if (data && data.value) {
          // Convert the JSON value to an object
          const mapSettings = typeof data.value === 'string' 
            ? JSON.parse(data.value)
            : data.value;
            
          setSettings({
            ...defaultMapSettings,
            ...mapSettings
          });
        }
      } catch (error) {
        console.error('Error parsing map settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field: keyof MapSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Convert the settings object to a JSON string to ensure it's properly
      // stored as a JSON value in Supabase
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'map_settings',
          value: settings as any, // Type assertion to fix TS error
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Map settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving map settings:', error);
      toast({
        title: 'Error',
        description: 'Could not save map settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map Settings</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Settings</CardTitle>
        <CardDescription>
          Configure your location map settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="mapbox_token">Mapbox Token</Label>
              <Input
                id="mapbox_token"
                type="text"
                value={settings.mapbox_token}
                onChange={(e) => handleChange('mapbox_token', e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get a token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mapbox</a>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  value={settings.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  value={settings.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zoom">Zoom Level</Label>
                <Input
                  id="zoom"
                  type="number"
                  min="1"
                  max="22"
                  value={settings.zoom}
                  onChange={(e) => handleChange('zoom', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="map_height">Map Height (px)</Label>
                <Input
                  id="map_height"
                  type="number"
                  min="200"
                  max="800"
                  value={settings.map_height}
                  onChange={(e) => handleChange('map_height', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="map_style">Map Style</Label>
              <Input
                id="map_style"
                type="text"
                value={settings.map_style}
                onChange={(e) => handleChange('map_style', e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Example: mapbox://styles/mapbox/streets-v12
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pin_title">Pin Title</Label>
                <Input
                  id="pin_title"
                  type="text"
                  value={settings.pin_title}
                  onChange={(e) => handleChange('pin_title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pin_description">Pin Description</Label>
                <Input
                  id="pin_description"
                  type="text"
                  value={settings.pin_description}
                  onChange={(e) => handleChange('pin_description', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="text-sm font-medium">Show on Homepage</h3>
                  <p className="text-sm text-gray-500">
                    Display the map on your homepage
                  </p>
                </div>
                <Switch
                  checked={settings.show_map_on_homepage}
                  onCheckedChange={(checked) => handleChange('show_map_on_homepage', checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="text-sm font-medium">Show in Footer</h3>
                  <p className="text-sm text-gray-500">
                    Display the map in your website footer
                  </p>
                </div>
                <Switch
                  checked={settings.show_map_in_footer}
                  onCheckedChange={(checked) => handleChange('show_map_in_footer', checked)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MapSettings;
