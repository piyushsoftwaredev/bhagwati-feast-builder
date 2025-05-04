
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: values.name,
            email: values.email,
            phone: values.phone,
            message: values.message,
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We will get back to you soon!",
        duration: 5000,
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error Sending Message",
        description: error.message || "There was a problem sending your message. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">Contact Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Have a question or want to book our catering services? Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-bhagwati-maroon mb-6">Send us a Message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I would like to inquire about your catering services..." 
                          className="min-h-[120px]" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-bhagwati-maroon hover:bg-bhagwati-maroon/90 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100 mb-6">
              <h3 className="text-2xl font-bold text-bhagwati-maroon mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-bhagwati-gold mt-1 mr-4" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-gray-700">+91 98765 43210</p>
                    <p className="text-gray-700">+91 91234 56780</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-bhagwati-gold mt-1 mr-4" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-gray-700">info@shreebhagwaticaterers.com</p>
                    <p className="text-gray-700">bookings@shreebhagwaticaterers.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-bhagwati-gold mt-1 mr-4" />
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-gray-700">123 Catering Street, Foodie District</p>
                    <p className="text-gray-700">Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CalendarIcon className="h-5 w-5 text-bhagwati-gold mt-1 mr-4" />
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-gray-700">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-700">Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100 flex-1">
              <h3 className="text-2xl font-bold text-bhagwati-maroon mb-6">Book an Event</h3>
              <p className="text-gray-700 mb-6">
                Looking to book our catering services for your next event? Contact us directly or fill out the contact form with your requirements.
              </p>
              <Button className="bg-bhagwati-gold hover:bg-bhagwati-gold/90 text-white w-full">
                Book Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-16">
          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74110193988222!3d19.08219783958011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1651855177201!5m2!1sen!2sin"
              title="Map"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
