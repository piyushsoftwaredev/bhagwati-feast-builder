
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LocationMap from './LocationMap';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

interface ContactInfo {
  address: string;
  phone1: string;
  phone2?: string;
  email1: string;
  email2?: string;
}

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '123 Catering Street, Foodie District, Mumbai, Maharashtra 400001',
    phone1: '+91 98765 43210',
    phone2: '+91 91234 56780',
    email1: 'info@shreebhagwaticaterers.com',
    email2: 'bookings@shreebhagwaticaterers.com',
  });
  
  useEffect(() => {
    // Fetch contact info from site_config
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'contact_info')
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching contact info:', error);
          return;
        }
        
        if (data?.value) {
          setContactInfo(data.value as ContactInfo);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    
    fetchContactInfo();
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            message: values.message,
            status: 'new',
          },
        ]);
        
      if (error) throw error;
      
      toast.success("Message sent successfully!");
      form.reset();
      setSuccess(true);
      
      // Reset success status after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bhagwati-maroon mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or want to book our catering services? Get in touch with us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-bhagwati-maroon">Send a Message</h3>
            
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
                <p className="font-medium">Thank you for your message!</p>
                <p className="mt-1">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-bhagwati-maroon hover:bg-bhagwati-maroon/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-bhagwati-maroon">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-bhagwati-gold mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-bhagwati-gold mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-600">{contactInfo.phone1}</p>
                    {contactInfo.phone2 && <p className="text-gray-600">{contactInfo.phone2}</p>}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-bhagwati-gold mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-600">{contactInfo.email1}</p>
                    {contactInfo.email2 && <p className="text-gray-600">{contactInfo.email2}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-bhagwati-maroon">Our Location</h3>
              <LocationMap height={300} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
