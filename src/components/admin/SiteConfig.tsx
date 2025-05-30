
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { getContactInfo, setContactInfo, type ContactInfo } from '@/lib/json-storage';

const formSchema = z.object({
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  phone1: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  phone2: z.string().optional(),
  email1: z.string().email({ message: "Please enter a valid email address" }),
  email2: z.string().email().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const SiteConfig = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      phone1: '',
      phone2: '',
      email1: '',
      email2: '',
    },
  });

  useEffect(() => {
    const loadContactInfo = () => {
      try {
        const contactInfo = getContactInfo();
        form.reset(contactInfo);
      } catch (error) {
        console.error('Error loading contact info:', error);
        toast({
          title: 'Error',
          description: 'Failed to load contact information',
          variant: 'destructive',
        });
      }
    };

    loadContactInfo();
  }, [form, toast]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const contactInfo: ContactInfo = {
        address: data.address,
        phone1: data.phone1,
        phone2: data.phone2 || undefined,
        email1: data.email1,
        email2: data.email2 || undefined,
      };
      
      setContactInfo(contactInfo);
      
      toast({
        title: 'Contact Information Saved',
        description: 'Your contact information has been updated successfully',
      });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: 'Error',
        description: 'Failed to save contact information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Site Configuration</h2>
        <p className="text-muted-foreground">
          Manage your website's contact information and other settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update your business contact details that appear on the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete business address"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This address will be displayed in the contact section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormDescription>
                        Main contact phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 91234 56780" {...field} />
                      </FormControl>
                      <FormDescription>
                        Additional contact number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Email</FormLabel>
                      <FormControl>
                        <Input placeholder="info@company.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Main contact email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="bookings@company.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Additional email for specific purposes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Contact Information'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteConfig;
