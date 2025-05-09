
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// Define the map settings interface
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

const mapStyleOptions = [
  { value: "mapbox://styles/mapbox/streets-v12", label: "Streets" },
  { value: "mapbox://styles/mapbox/outdoors-v12", label: "Outdoors" },
  { value: "mapbox://styles/mapbox/light-v11", label: "Light" },
  { value: "mapbox://styles/mapbox/dark-v11", label: "Dark" },
  { value: "mapbox://styles/mapbox/satellite-v9", label: "Satellite" },
  { value: "mapbox://styles/mapbox/satellite-streets-v12", label: "Satellite Streets" },
  { value: "mapbox://styles/mapbox/navigation-day-v1", label: "Navigation Day" },
  { value: "mapbox://styles/mapbox/navigation-night-v1", label: "Navigation Night" },
];

const defaultSettings: MapSettings = {
  mapbox_token: "",
  latitude: "19.0760",
  longitude: "72.8777",
  zoom: 12,
  map_style: "mapbox://styles/mapbox/streets-v12",
  show_map_on_homepage: true,
  show_map_in_footer: false,
  map_height: 400,
  pin_title: "Shree Bhagwati Caterers",
  pin_description: "Premium Vegetarian Catering Services"
};

const MapSettings = () => {
  const [settings, setSettings] = useState<MapSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'map_settings')
          .single();

        if (error) {
          console.error('Error fetching map settings:', error);
          return;
        }

        if (data && data.value) {
          const mapSettings = typeof data.value === 'string' 
            ? JSON.parse(data.value) as MapSettings
            : data.value as MapSettings;
          
          setSettings({
            ...defaultSettings, // Ensure all properties exist
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

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'map_settings',
          value: settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;
      
      toast({
        title: "Settings Saved",
        description: "Map settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving map settings:', error);
      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your map settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-bhagwati-maroon" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Map Settings</CardTitle>
          <CardDescription>
            Configure how and where the map appears on your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mapbox_token">Mapbox Access Token</Label>
                <Input 
                  id="mapbox_token" 
                  value={settings.mapbox_token} 
                  onChange={(e) => handleChange('mapbox_token', e.target.value)} 
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI..."
                />
                <p className="text-xs text-gray-500">
                  Get a token at <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="map_style">Map Style</Label>
                <Select 
                  value={settings.map_style}
                  onValueChange={(value) => handleChange('map_style', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a map style" />
                  </SelectTrigger>
                  <SelectContent>
                    {mapStyleOptions.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input 
                  id="latitude" 
                  value={settings.latitude} 
                  onChange={(e) => handleChange('latitude', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input 
                  id="longitude" 
                  value={settings.longitude} 
                  onChange={(e) => handleChange('longitude', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zoom">Zoom Level</Label>
                <Input 
                  id="zoom" 
                  type="number" 
                  min="1" 
                  max="22" 
                  value={settings.zoom.toString()} 
                  onChange={(e) => handleChange('zoom', parseInt(e.target.value) || 12)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pin_title">Pin Title</Label>
                <Input 
                  id="pin_title" 
                  value={settings.pin_title} 
                  onChange={(e) => handleChange('pin_title', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="map_height">Map Height (pixels)</Label>
                <Input 
                  id="map_height" 
                  type="number"
                  min="200"
                  max="800"
                  value={settings.map_height.toString()} 
                  onChange={(e) => handleChange('map_height', parseInt(e.target.value) || 400)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin_description">Pin Description</Label>
              <Input 
                id="pin_description" 
                value={settings.pin_description} 
                onChange={(e) => handleChange('pin_description', e.target.value)} 
              />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show_map_on_homepage" className="text-base">Show Map on Homepage</Label>
                  <p className="text-sm text-gray-500">Display location map on the homepage</p>
                </div>
                <Switch 
                  id="show_map_on_homepage" 
                  checked={settings.show_map_on_homepage}
                  onCheckedChange={(checked) => handleChange('show_map_on_homepage', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show_map_in_footer" className="text-base">Show Map in Footer</Label>
                  <p className="text-sm text-gray-500">Display a smaller map in the page footer</p>
                </div>
                <Switch 
                  id="show_map_in_footer" 
                  checked={settings.show_map_in_footer}
                  onCheckedChange={(checked) => handleChange('show_map_in_footer', checked)} 
                />
              </div>
            </div>
          </div>
          
          <Button 
            className="mt-6 bg-bhagwati-maroon hover:bg-red-900"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Map Settings'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapSettings;
