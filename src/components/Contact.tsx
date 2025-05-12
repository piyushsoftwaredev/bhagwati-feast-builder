import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfo {
  address: string;
  phone1: string;
  phone2?: string;
  email1: string;
  email2?: string;
}

const defaultContactInfo: ContactInfo = {
  address: '123 Catering Street, Foodie District, Mumbai, Maharashtra 400001',
  phone1: '+91 98765 43210',
  phone2: '+91 91234 56780',
  email1: 'info@shreebhagwaticaterers.com',
  email2: 'bookings@shreebhagwaticaterers.com'
};

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'contact_info')
          .single();
        
        if (error) {
          console.error('Error fetching contact info:', error);
          return;
        }
        
        if (data?.value) {
          // Cast to ContactInfo type
          const contactData = data.value as ContactInfo;
          setContactInfo(contactData);
        }
      } catch (err) {
        console.error('Error in contact info fetch:', err);
      }
    };
    
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: 'Error',
          description: 'Please enter a valid email address.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

      toast({
        title: 'Success',
        description: 'Your message has been sent!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bhagwati-maroon mb-4">Contact Us</h2>
          <p className="text-gray-600">Get in touch with Shree Bhagwati Caterers for your next event</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:order-2">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-bhagwati-maroon">Send us a message</h3>
              
              {/* Contact form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="Your Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-bhagwati-maroon text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="lg:order-1">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-bhagwati-maroon">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-bhagwati-gold shrink-0 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-bhagwati-gold shrink-0 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">{contactInfo.phone1}</p>
                      {contactInfo.phone2 && <p className="text-gray-600">{contactInfo.phone2}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-bhagwati-gold shrink-0 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">{contactInfo.email1}</p>
                      {contactInfo.email2 && <p className="text-gray-600">{contactInfo.email2}</p>}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6 text-bhagwati-maroon">Visit Us</h3>
                {/* Replace with your actual map component */}
                <div>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.132140459938!2d72.8365911747965!3d18.96749778204316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce34c2ca4b9d%3A0x4ca2a2f5595c984!2sShree%20Bhagwati%20Caterers!5e0!3m2!1sen!2sus!4v1622037952939!5m2!1sen!2sus"
                    width="100%" 
                    height="300" 
                    style={{ border:0 }}
                    allowFullScreen={true} 
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
