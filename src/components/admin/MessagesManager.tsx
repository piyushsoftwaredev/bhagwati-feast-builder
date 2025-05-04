
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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

const MessagesManager = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts');
  
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
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
        description: error.message || "Could not load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setContactMessages(contactMessages.filter(msg => msg.id !== id));
      toast({
        title: 'Message Deleted',
        description: 'Contact message has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error deleting message',
        description: error.message || 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBookings(bookings.filter(booking => booking.id !== id));
      toast({
        title: 'Booking Deleted',
        description: 'Booking request has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast({
        title: 'Error deleting booking',
        description: error.message || 'Failed to delete booking',
        variant: 'destructive',
      });
    }
  };

  const viewContactDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const viewBookingDetails = (booking: BookingRequest) => {
    setSelectedMessage(booking);
    setIsDialogOpen(true);
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy, h:mm a');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Messages & Bookings</h2>
          <p className="text-muted-foreground">Manage contact messages and booking requests</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contacts" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Contact Messages
            {contactMessages.length > 0 && (
              <span className="ml-2 bg-bhagwati-gold text-white text-xs rounded-full py-0.5 px-2">
                {contactMessages.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Booking Requests
            {bookings.length > 0 && (
              <span className="ml-2 bg-bhagwati-gold text-white text-xs rounded-full py-0.5 px-2">
                {bookings.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Contact Messages Tab */}
        <TabsContent value="contacts">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
            </div>
          ) : contactMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-500">No contact messages yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactMessages.map((message) => (
                      <TableRow key={message.id} onClick={() => viewContactDetails(message)} className="cursor-pointer">
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>{message.phone}</TableCell>
                        <TableCell>{formatDate(message.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(message.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Booking Requests Tab */}
        <TabsContent value="bookings">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-500">No booking requests yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Event Date</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} onClick={() => viewBookingDetails(booking)} className="cursor-pointer">
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>{booking.event_type}</TableCell>
                        <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.guest_count}</TableCell>
                        <TableCell>{formatDate(booking.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBooking(booking.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Message Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'contacts' ? 'Contact Message' : 'Booking Request'} Details
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Name</h3>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Email</h3>
                  <p>{selectedMessage.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Phone</h3>
                  <p>{selectedMessage.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Date</h3>
                  <p>{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>

              {/* Additional booking details */}
              {activeTab === 'bookings' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Event Type</h3>
                    <p>{selectedMessage.event_type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Event Date</h3>
                    <p>{new Date(selectedMessage.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Guest Count</h3>
                    <p>{selectedMessage.guest_count}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Message</h3>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (activeTab === 'contacts') {
                      handleDeleteContact(selectedMessage.id);
                    } else {
                      handleDeleteBooking(selectedMessage.id);
                    }
                    setIsDialogOpen(false);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesManager;
