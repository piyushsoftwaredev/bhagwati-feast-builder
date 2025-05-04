
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Home, LogOut, Mail, MessageSquare } from 'lucide-react';

// Define types for our data
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

type BookingRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  date: string;
  guest_count: number;
  message: string;
  created_at: string;
};

const Admin = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    
    if (session && !session.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch contact messages
        const { data: contactData, error: contactError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (contactError) throw contactError;
        setContactMessages(contactData || []);
        
        // Fetch booking requests
        const { data: bookingData, error: bookingError } = await supabase
          .from('booking_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (bookingError) throw bookingError;
        setBookings(bookingData || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Data Fetch Error",
          description: error.message || "Could not load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session, navigate, toast]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Logged Out Successfully",
      description: "You have been logged out of your account",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhagwati-gold mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-bhagwati-maroon text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center">
              <span className="text-white font-bold text-xl">Shree</span>
              <span className="text-bhagwati-gold font-bold text-2xl mx-1">BHAGWATI</span>
              <span className="text-white font-bold text-xl">Admin</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-bhagwati-maroon/80"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              View Site
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-bhagwati-maroon/80"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-bhagwati-maroon mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your catering business inquiries and bookings</p>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Booking Requests
              {bookings.length > 0 && (
                <span className="ml-2 bg-bhagwati-gold text-white text-xs rounded-full py-0.5 px-2">
                  {bookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Messages
              {contactMessages.length > 0 && (
                <span className="ml-2 bg-bhagwati-gold text-white text-xs rounded-full py-0.5 px-2">
                  {contactMessages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* Booking Requests Tab */}
          <TabsContent value="bookings">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-gray-500">No booking requests yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/40">
                      <CardTitle className="flex justify-between">
                        <span>{booking.name}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {formatDate(booking.created_at)}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex flex-col sm:flex-row sm:gap-4">
                          <span>{booking.email}</span>
                          <span>{booking.phone}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold">Event Type</h4>
                          <p>{booking.event_type}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">Date</h4>
                          <p>{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">Guest Count</h4>
                          <p>{booking.guest_count}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Message</h4>
                        <p className="text-gray-700">{booking.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Contact Messages Tab */}
          <TabsContent value="messages">
            {contactMessages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg text-gray-500">No contact messages yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {contactMessages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader className="bg-muted/40">
                      <CardTitle className="flex justify-between">
                        <span>{message.name}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {formatDate(message.created_at)}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex flex-col sm:flex-row sm:gap-4">
                          <span>{message.email}</span>
                          <span>{message.phone}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-semibold mb-1">Message</h4>
                      <p className="text-gray-700">{message.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
