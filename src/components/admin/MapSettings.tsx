
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Map, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define schema for map settings
const mapSettingsSchema = z.object({
  mapboxToken: z.string().min(1, { message: 'API key is required' }),
  latitude: z.string().regex(/^-?[0-9]\d*(\.\d+)?$/, { message: 'Must be a valid latitude' }),
  longitude: z.string().regex(/^-?[0-9]\d*(\.\d+)?$/, { message: 'Must be a valid longitude' }),
  zoom: z.number().min(1).max(20),
  mapStyle: z.string(),
  showMapOnHomepage: z.boolean(),
  showMapInFooter: z.boolean(),
  mapHeight: z.number().min(200).max(800),
  pinTitle: z.string(),
  pinDescription: z.string(),
});

type MapSettingsFormValues = z.infer<typeof mapSettingsSchema>;

const DEFAULT_SETTINGS = {
  mapboxToken: 'pk.placeholder', // This will be replaced with real token
  latitude: '19.0760',
  longitude: '72.8777',
  zoom: 12,
  mapStyle: 'mapbox://styles/mapbox/streets-v12',
  showMapOnHomepage: true,
  showMapInFooter: true,
  mapHeight: 400,
  pinTitle: 'Shree Bhagwati Caterers',
  pinDescription: 'Premium Vegetarian Catering Services',
};

const MapSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<MapSettingsFormValues>({
    resolver: zodResolver(mapSettingsSchema),
    defaultValues: DEFAULT_SETTINGS,
  });

  // Fetch map settings
  const fetchMapSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'map_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.value) {
        // Map DB values to form
        const settings = data.value;
        form.reset({
          mapboxToken: settings.mapbox_token || DEFAULT_SETTINGS.mapboxToken,
          latitude: settings.latitude || DEFAULT_SETTINGS.latitude,
          longitude: settings.longitude || DEFAULT_SETTINGS.longitude,
          zoom: settings.zoom || DEFAULT_SETTINGS.zoom,
          mapStyle: settings.map_style || DEFAULT_SETTINGS.mapStyle,
          showMapOnHomepage: settings.show_map_on_homepage ?? DEFAULT_SETTINGS.showMapOnHomepage,
          showMapInFooter: settings.show_map_in_footer ?? DEFAULT_SETTINGS.showMapInFooter,
          mapHeight: settings.map_height || DEFAULT_SETTINGS.mapHeight,
          pinTitle: settings.pin_title || DEFAULT_SETTINGS.pinTitle,
          pinDescription: settings.pin_description || DEFAULT_SETTINGS.pinDescription,
        });
      }
    } catch (error: any) {
      console.error('Error fetching map settings:', error);
      toast({
        title: 'Failed to load map settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save map settings
  const onSubmit = async (values: MapSettingsFormValues) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'map_settings',
          value: {
            mapbox_token: values.mapboxToken,
            latitude: values.latitude,
            longitude: values.longitude,
            zoom: values.zoom,
            map_style: values.mapStyle,
            show_map_on_homepage: values.showMapOnHomepage,
            show_map_in_footer: values.showMapInFooter,
            map_height: values.mapHeight,
            pin_title: values.pinTitle,
            pin_description: values.pinDescription,
            updated_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

      if (error) throw error;

      toast({
        title: 'Map settings saved',
        description: 'Your map settings have been updated successfully',
      });
      
      sonnerToast.success('Map settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving map settings:', error);
      toast({
        title: 'Failed to save settings',
        description: error.message,
        variant: 'destructive',
      });
      sonnerToast.error('Failed to save map settings');
    } finally {
      setSaving(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMapSettings();
  }, []);

  const mapStyleOptions = [
    { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
    { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12' },
    { label: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
    { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
    { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
    { label: 'Satellite Streets', value: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { label: 'Navigation Day', value: 'mapbox://styles/mapbox/navigation-day-v1' },
    { label: 'Navigation Night', value: 'mapbox://styles/mapbox/navigation-night-v1' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Map Settings</h2>
        <p className="text-muted-foreground">Configure your website map display and location</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Map Configuration</CardTitle>
                    <CardDescription>Configure your map API and location settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mapboxToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mapbox API Key</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormDescription>
                            Enter your Mapbox API key. Get one at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="pinTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Title to show in the map pin popup</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pinDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Description to show in the map pin popup</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Customize how your map appears on your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="mapStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Map Style</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              {mapStyleOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zoom"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Zoom Level: {value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={20}
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Adjust the zoom level of your map (1-20)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mapHeight"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Map Height: {value}px</FormLabel>
                          <FormControl>
                            <Slider
                              min={200}
                              max={800}
                              step={10}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Adjust the height of the map in pixels</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="showMapOnHomepage"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show on Homepage</FormLabel>
                              <FormDescription>
                                Display map in the contact section of your homepage
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="showMapInFooter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Show in Footer</FormLabel>
                              <FormDescription>
                                Display a smaller map in your website footer
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Map className="mr-2 h-4 w-4" />
                    Save Map Settings
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default MapSettings;
