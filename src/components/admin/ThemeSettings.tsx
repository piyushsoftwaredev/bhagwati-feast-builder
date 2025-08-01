
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Removed database dependencies - using static theme configuration
interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

const getThemeSettings = (): ThemeSettings => ({
  primaryColor: '#8b5cf6',
  secondaryColor: '#f59e0b', 
  fontFamily: 'Inter'
});

const saveThemeSettings = (settings: ThemeSettings) => {
  // In a static site, theme settings would be saved to localStorage or managed via CSS variables
  localStorage.setItem('themeSettings', JSON.stringify(settings));
};
import { useToast } from '@/hooks/use-toast';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code (e.g. #8B0000)",
  }),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code (e.g. #FFD700)",
  }),
  font_family: z.string().min(2, { 
    message: "Please enter a font family (e.g. Inter, sans-serif)" 
  }),
  header_style: z.string().default('standard'),
  footer_style: z.string().default('standard'),
  custom_css: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ThemeSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary_color: '#8B0000',
      secondary_color: '#FFD700',
      font_family: 'Inter, sans-serif',
      header_style: 'standard',
      footer_style: 'standard',
      custom_css: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      // Ensure all required fields have values to match ThemeSettingsType
      const themeData: ThemeSettingsType = {
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        font_family: data.font_family,
        header_style: data.header_style || 'standard',
        footer_style: data.footer_style || 'standard',
        custom_css: data.custom_css || ''
      };
      
      // Simulate save for static site
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Theme settings saved (Demo Mode):', themeData);
      
      toast({
        title: 'Theme Settings Saved (Demo Mode)',
        description: 'Your theme settings have been updated successfully in demo mode',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save theme settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings (Demo Mode)</CardTitle>
        <CardDescription>
          Customize the appearance of your website by adjusting the colors and styles - Demo functionality only
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input {...field} placeholder="#8B0000" />
                      </FormControl>
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <FormDescription>
                      Main color for headers and primary elements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Color</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input {...field} placeholder="#FFD700" />
                      </FormControl>
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <FormDescription>
                      Accent color for buttons and highlights
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="font_family"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Family</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Inter, sans-serif" />
                  </FormControl>
                  <FormDescription>
                    Primary font for your site (e.g. Inter, sans-serif)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="header_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Style</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="standard">Standard</option>
                        <option value="centered">Centered</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Style of the header across your site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footer_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Style</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="standard">Standard</option>
                        <option value="simple">Simple</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Style of the footer across your site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="custom_css"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom CSS</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="/* Add your custom CSS here */"
                      className="font-mono h-[200px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Add custom CSS rules to override any styles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Theme Settings (Demo)'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
