
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brush, Code, Layout, Palette, RefreshCw, Settings } from 'lucide-react';

// Define schema for theme settings
const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'Please enter a valid hex color code (e.g., #8B0000)' 
  }),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { 
    message: 'Please enter a valid hex color code (e.g., #FFD700)' 
  }),
  fontFamily: z.string().min(2, { message: 'Font family is required' }),
  headerStyle: z.string(),
  footerStyle: z.string(),
  customCss: z.string().optional(),
});

type ThemeSettingsValues = z.infer<typeof themeSettingsSchema>;

// Define a type for theme settings in the site_config table
interface ThemeSettingsConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerStyle: string;
  footerStyle: string;
  customCss?: string;
}

const ThemeSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const { toast } = useToast();

  // Initialize form
  const form = useForm<ThemeSettingsValues>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      primaryColor: '#8B0000', // Default maroon (bhagwati-maroon)
      secondaryColor: '#FFD700', // Default gold (bhagwati-gold)
      fontFamily: 'Inter, sans-serif',
      headerStyle: 'standard',
      footerStyle: 'standard',
      customCss: '',
    }
  });

  // Fetch theme settings
  const fetchThemeSettings = async () => {
    setLoading(true);
    try {
      // Get theme settings from site_config table instead of theme_settings table
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'theme_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.value) {
        // Parse the JSON value from site_config
        const themeSettings = data.value as ThemeSettingsConfig;
        
        form.reset({
          primaryColor: themeSettings.primaryColor || '#8B0000',
          secondaryColor: themeSettings.secondaryColor || '#FFD700',
          fontFamily: themeSettings.fontFamily || 'Inter, sans-serif',
          headerStyle: themeSettings.headerStyle || 'standard',
          footerStyle: themeSettings.footerStyle || 'standard',
          customCss: themeSettings.customCss || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching theme settings:', error);
      toast({
        title: 'Failed to load theme settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply current theme settings
  const applyTheme = (values: ThemeSettingsValues) => {
    // Get the root element to apply custom properties
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--color-primary', values.primaryColor);
    root.style.setProperty('--color-secondary', values.secondaryColor);
    root.style.setProperty('--font-family', values.fontFamily);
    
    // Add or update custom CSS
    let styleElement = document.getElementById('theme-custom-css');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-custom-css';
      document.head.appendChild(styleElement);
    }
    
    // Add the custom CSS
    styleElement.textContent = values.customCss || '';
  };

  // Save theme settings
  const onSubmit = async (values: ThemeSettingsValues) => {
    setSaving(true);
    try {
      // Store theme settings in site_config instead of theme_settings
      const themeSettingsData = {
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        fontFamily: values.fontFamily,
        headerStyle: values.headerStyle,
        footerStyle: values.footerStyle,
        customCss: values.customCss,
      };

      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'theme_settings',
          value: themeSettingsData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      // Apply the theme
      applyTheme(values);

      // Also save to localStorage for persistence on page reload
      localStorage.setItem('theme-settings', JSON.stringify(themeSettingsData));

      toast({
        title: 'Theme settings saved',
        description: 'Your theme settings have been updated successfully',
      });
    } catch (error: any) {
      console.error('Error saving theme settings:', error);
      toast({
        title: 'Failed to save theme settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Apply theme on initial load and when form values change
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.primaryColor && values.secondaryColor) {
        applyTheme(values as ThemeSettingsValues);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Initial fetch
  useEffect(() => {
    fetchThemeSettings();
  }, []);

  // Font family options
  const fontFamilies = [
    { value: 'Inter, sans-serif', label: 'Inter (Default)' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Lato, sans-serif', label: 'Lato' },
    { value: 'Montserrat, sans-serif', label: 'Montserrat' },
    { value: 'Poppins, sans-serif', label: 'Poppins' },
    { value: 'Open Sans, sans-serif', label: 'Open Sans' },
    { value: 'Playfair Display, serif', label: 'Playfair Display' },
  ];

  // Layout style options
  const layoutStyles = [
    { value: 'standard', label: 'Standard' },
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'minimal', label: 'Minimal' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Theme Settings</h2>
        <p className="text-muted-foreground">Customize your website's appearance</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="colors" className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex items-center">
                  <Brush className="mr-2 h-4 w-4" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center">
                  <Layout className="mr-2 h-4 w-4" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center">
                  <Code className="mr-2 h-4 w-4" />
                  Custom CSS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Scheme</CardTitle>
                    <CardDescription>Customize the color scheme of your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex gap-2 items-center">
                              <input 
                                type="color" 
                                id="primaryColorPicker" 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-10 h-10 rounded-md cursor-pointer"
                              />
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Used for headings, buttons and accents
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <div className="flex gap-2 items-center">
                              <input 
                                type="color" 
                                id="secondaryColorPicker" 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-10 h-10 rounded-md cursor-pointer"
                              />
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Used for highlights and secondary elements
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4 p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Preview</h3>
                      <div className="flex gap-2">
                        <div 
                          className="w-20 h-8 rounded-md" 
                          style={{ backgroundColor: form.getValues().primaryColor }}
                        ></div>
                        <div 
                          className="w-20 h-8 rounded-md"
                          style={{ backgroundColor: form.getValues().secondaryColor }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="typography">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                    <CardDescription>Select fonts and text styles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="fontFamily"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font Family</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fontFamilies.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The primary font used throughout the website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-6 p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Preview</h3>
                      <p 
                        className="text-lg" 
                        style={{ fontFamily: form.getValues().fontFamily }}
                      >
                        This is how your text will appear on the website
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="layout">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Settings</CardTitle>
                    <CardDescription>Choose layout styles for your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="headerStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Header Style</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select header style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {layoutStyles.map((style) => (
                                <SelectItem key={style.value} value={style.value}>
                                  {style.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Style for the site header
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="footerStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Footer Style</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select footer style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {layoutStyles.map((style) => (
                                <SelectItem key={style.value} value={style.value}>
                                  {style.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Style for the site footer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="custom">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom CSS</CardTitle>
                    <CardDescription>Add custom CSS for advanced styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="customCss"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom CSS</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              className="font-mono h-60"
                              placeholder=":root {
  --custom-variable: value;
}

.my-custom-class {
  property: value;
}"
                            />
                          </FormControl>
                          <FormDescription>
                            Advanced CSS rules to customize your site. Use with caution.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fetchThemeSettings()}
                disabled={loading || saving}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Saved
              </Button>
              <Button type="submit" disabled={saving}>
                <Settings className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Theme Settings"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ThemeSettings;
