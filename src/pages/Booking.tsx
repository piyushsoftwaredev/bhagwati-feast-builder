
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 bg-gray-50">
        <div className="content-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-bhagwati-maroon mb-4">
              Book Our Catering Services
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Let us make your event special with our exquisite vegetarian catering. Fill out the form below and we'll get back to you to discuss your requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <BookingForm />
            </div>
            
            <div className="flex flex-col gap-6">
              {/* Benefits Card */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-bhagwati-maroon mb-4">Why Choose Us?</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bhagwati-gold/20 flex items-center justify-center">
                      <span className="text-bhagwati-maroon text-sm">✓</span>
                    </div>
                    <span className="ml-3 text-gray-700">Pure vegetarian cuisine with authentic flavors</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bhagwati-gold/20 flex items-center justify-center">
                      <span className="text-bhagwati-maroon text-sm">✓</span>
                    </div>
                    <span className="ml-3 text-gray-700">Customizable menus for all dietary preferences</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bhagwati-gold/20 flex items-center justify-center">
                      <span className="text-bhagwati-maroon text-sm">✓</span>
                    </div>
                    <span className="ml-3 text-gray-700">Professional service staff and elegant presentation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bhagwati-gold/20 flex items-center justify-center">
                      <span className="text-bhagwati-maroon text-sm">✓</span>
                    </div>
                    <span className="ml-3 text-gray-700">Decades of experience in event catering</span>
                  </li>
                </ul>
              </div>
              
              {/* Testimonial Card */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-bhagwati-maroon mb-4">What Our Clients Say</h3>
                
                <blockquote className="italic text-gray-600 mb-4">
                  "Shree Bhagwati Caterers made our wedding reception absolutely perfect. The food was exquisite and the service was impeccable. Highly recommended!"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">AM</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Anjali & Mihir</p>
                    <p className="text-sm text-gray-500">Wedding Reception</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Info Card */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-bhagwati-maroon mb-4">Need Help?</h3>
                
                <p className="text-gray-700 mb-4">
                  If you have any questions about our catering services or need assistance with booking, please don't hesitate to contact us.
                </p>
                
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="text-bhagwati-gold mr-2">☎</span>
                    <span>+91 98765 43210</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-bhagwati-gold mr-2">✉</span>
                    <span>bookings@shreebhagwaticaterers.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Booking;
