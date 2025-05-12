
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';

interface SiteConfigProps {
  onSave?: () => void;
}

const contactSchema = z.object({
  address: z.string().min(5, { message: 'Address is required' }),
  phone1: z.string().min(5, { message: 'Primary phone is required' }),
  phone2: z.string().optional(),
  email1: z.string().email({ message: 'Valid email is required' }),
  email2: z.string().email({ message: 'Valid email is required' }).optional(),
});

const featuresSchema = z.object({
  showHero: z.boolean().default(true),
  showServices: z.boolean().default(true),
  showMenu: z.boolean().default(true),
  showGallery: z.boolean().default(true),
  showPosts: z.boolean().default(true),
  showAbout: z.boolean().default(true),
  showContact: z.boolean().default(true),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type FeaturesFormValues = z.infer<typeof featuresSchema>;

const SiteConfig = ({ onSave }: SiteConfigProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      address: '',
      phone1: '',
      phone2: '',
      email1: '',
      email2: '',
    },
  });

  const featuresForm = useForm<FeaturesFormValues>({
    resolver: zodResolver(featuresSchema),
    defaultValues: {
      showHero: true,
      showServices: true,
      showMenu: true,
      showGallery: true,
      showPosts: true,
      showAbout: true,
      showContact: true,
    },
  });

  // Fetch site config from the database
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Fetch contact info
        const { data: contactData } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'contact_info')
          .maybeSingle();

        if (contactData?.value) {
          const contact = contactData.value as ContactFormValues;
          contactForm.reset(contact);
        }

        // Fetch feature settings
        const { data: featuresData } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'features')
          .maybeSingle();

        if (featuresData?.value) {
          const features = featuresData.value as FeaturesFormValues;
          featuresForm.reset(features);
        }
      } catch (error) {
        console.error('Error fetching site config:', error);
      }
    };

    fetchConfig();
  }, [contactForm, featuresForm]);

  const saveContactInfo = async (values: ContactFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert(
          { 
            key: 'contact_info',
            value: values
          },
          { 
            onConflict: 'key',
          }
        );

      if (error) throw error;
      
      toast({
        title: 'Contact Information Saved',
        description: 'Your contact information has been updated successfully.',
      });
      
      if (onSave) onSave();
    } catch (error: any) {
      console.error('Error saving contact info:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save contact information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFeatures = async (values: FeaturesFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert(
          { 
            key: 'features',
            value: values
          },
          { 
            onConflict: 'key',
          }
        );

      if (error) throw error;
      
      toast({
        title: 'Features Saved',
        description: 'Your feature settings have been updated successfully.',
      });
      
      if (onSave) onSave();
    } catch (error: any) {
      console.error('Error saving features:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save feature settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="features">Feature Visibility</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Update the contact information displayed on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(saveContactInfo)} className="space-y-6">
                  <FormField
                    control={contactForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your business address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="phone1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Primary phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="phone2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Secondary phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="email1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Primary email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="email2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Secondary email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-bhagwati-maroon hover:bg-red-900"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Contact Information'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Visibility</CardTitle>
              <CardDescription>
                Control which sections are visible on your homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...featuresForm}>
                <form onSubmit={featuresForm.handleSubmit(saveFeatures)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={featuresForm.control}
                      name="showHero"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Hero Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show the main banner section at the top of the homepage
                            </p>
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
                      control={featuresForm.control}
                      name="showServices"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Services Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show the services section on the homepage
                            </p>
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
                      control={featuresForm.control}
                      name="showMenu"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Menu Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show the featured menu items on the homepage
                            </p>
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
                      control={featuresForm.control}
                      name="showGallery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Gallery Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show the photo gallery on the homepage
                            </p>
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
                      control={featuresForm.control}
                      name="showPosts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Blog Posts Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show recent blog posts on the homepage
                            </p>
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
                      control={featuresForm.control}
                      name="showAbout"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              About Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show the about us section on the homepage
                            </p>
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
                      control={featuresForm.control}
                      name="showContact"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Contact Section
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show the contact form and info on the homepage
                            </p>
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

                  <Button 
                    type="submit" 
                    className="bg-bhagwati-maroon hover:bg-red-900"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Feature Settings'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteConfig;
