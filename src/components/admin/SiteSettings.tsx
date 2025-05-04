
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
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import ImageUploader from './ImageUploader';

// Define schema for site settings
const siteSettingsSchema = z.object({
  siteName: z.string().min(2, { message: 'Site name is required' }),
  siteTagline: z.string().min(2, { message: 'Site tagline is required' }),
  phoneNumber1: z.string().min(5, { message: 'Phone number is required' }),
  phoneNumber2: z.string().optional(),
  email1: z.string().email({ message: 'Valid email is required' }),
  email2: z.string().email({ message: 'Valid email is required' }).optional(),
  address: z.string().min(5, { message: 'Address is required' }),
  businessHours: z.string().min(5, { message: 'Business hours are required' }),
  footerText: z.string().min(2, { message: 'Footer text is required' }),
  heroText: z.string().min(2, { message: 'Hero text is required' }),
  heroSubtext: z.string().min(2, { message: 'Hero subtext is required' }),
  heroButtonText: z.string().min(2, { message: 'Button text is required' }),
  heroImage: z.string().optional(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: 'Shree Bhagwati Caterers',
      siteTagline: 'Premium Vegetarian Catering Services',
      phoneNumber1: '+91 98765 43210',
      phoneNumber2: '+91 91234 56780',
      email1: 'info@shreebhagwaticaterers.com',
      email2: 'bookings@shreebhagwaticaterers.com',
      address: '123 Catering Street, Foodie District, Mumbai, Maharashtra 400001',
      businessHours: 'Monday - Saturday: 9:00 AM - 8:00 PM, Sunday: 10:00 AM - 4:00 PM',
      footerText: '© 2025 Shree Bhagwati Caterers. All rights reserved.',
      heroText: 'Exquisite Vegetarian Catering For Your Special Events',
      heroSubtext: 'Creating unforgettable culinary experiences with authentic flavors, elegant presentations, and impeccable service.',
      heroButtonText: 'Book Now',
      heroImage: '',
    }
  });

  // Fetch site settings
  const fetchSiteSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Map DB values to form
        form.reset({
          siteName: data.site_name || 'Shree Bhagwati Caterers',
          siteTagline: data.site_tagline || 'Premium Vegetarian Catering Services',
          phoneNumber1: data.phone_number_1 || '+91 98765 43210',
          phoneNumber2: data.phone_number_2 || '+91 91234 56780',
          email1: data.email_1 || 'info@shreebhagwaticaterers.com',
          email2: data.email_2 || 'bookings@shreebhagwaticaterers.com',
          address: data.address || '123 Catering Street, Foodie District, Mumbai, Maharashtra 400001',
          businessHours: data.business_hours || 'Monday - Saturday: 9:00 AM - 8:00 PM, Sunday: 10:00 AM - 4:00 PM',
          footerText: data.footer_text || '© 2025 Shree Bhagwati Caterers. All rights reserved.',
          heroText: data.hero_text || 'Exquisite Vegetarian Catering For Your Special Events',
          heroSubtext: data.hero_subtext || 'Creating unforgettable culinary experiences with authentic flavors, elegant presentations, and impeccable service.',
          heroButtonText: data.hero_button_text || 'Book Now',
          heroImage: data.hero_image || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching site settings:', error);
      toast({
        title: 'Failed to load settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save site settings
  const onSubmit = async (values: SiteSettingsFormValues) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1, // Single row for site settings
          site_name: values.siteName,
          site_tagline: values.siteTagline,
          phone_number_1: values.phoneNumber1,
          phone_number_2: values.phoneNumber2,
          email_1: values.email1,
          email_2: values.email2,
          address: values.address,
          business_hours: values.businessHours,
          footer_text: values.footerText,
          hero_text: values.heroText,
          hero_subtext: values.heroSubtext,
          hero_button_text: values.heroButtonText,
          hero_image: values.heroImage,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your site settings have been updated successfully',
      });
    } catch (error: any) {
      console.error('Error saving site settings:', error);
      toast({
        title: 'Failed to save settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Website Settings</h2>
        <p className="text-muted-foreground">Customize your website content and appearance</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteTagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Hours</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Homepage Content</CardTitle>
                <CardDescription>Edit your website homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="heroText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroSubtext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroButtonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call-to-Action Button Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heroImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Background Image</FormLabel>
                      <FormControl>
                        <ImageUploader
                          currentImage={field.value}
                          onImageSelected={(url) => form.setValue('heroImage', url)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Footer Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default SiteSettings;
