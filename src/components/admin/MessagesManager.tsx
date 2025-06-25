
import { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Calendar } from 'lucide-react';
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

// Demo data
const demoContactMessages: ContactMessage[] = [
  {
    id: 'contact-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    message: 'Interested in catering services for a corporate event.',
    created_at: new Date().toISOString(),
  }
];

const demoBookingRequests: BookingRequest[] = [
  {
    id: 'booking-1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 98765 43211',
    event_type: 'Wedding',
    date: '2024-03-15',
    guest_count: 150,
    message: 'Need catering for a wedding reception with 150 guests.',
    created_at: new Date().toISOString(),
  }
];

const MessagesManager = () => {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(demoContactMessages);
  const [bookings, setBookings] = useState<BookingRequest[]>(demoBookingRequests);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts');
  
  const { toast } = useToast();

  const handleDeleteContact = async (id: string) => {
    try {
      setContactMessages(contactMessages.filter(msg => msg.id !== id));
      toast({
        title: 'Message Deleted (Demo Mode)',
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
      setBookings(bookings.filter(booking => booking.id !== id));
      toast({
        title: 'Booking Deleted (Demo Mode)',
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy, h:mm a');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Messages & Bookings (Demo Mode)</h2>
          <p className="text-muted-foreground">Manage contact messages and booking requests - Demo data only</p>
        </div>
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
          {contactMessages.length === 0 ? (
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
                            Delete
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
          {bookings.length === 0 ? (
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
                            Delete
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesManager;
