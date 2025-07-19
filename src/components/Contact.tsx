
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const contactInfo = {
    address: import.meta.env.VITE_BUSINESS_ADDRESS || '123 Catering Street, Foodie District, Mumbai, Maharashtra 400001',
    phone1: import.meta.env.VITE_BUSINESS_PHONE_1 || '+91 98765 43210',
    phone2: import.meta.env.VITE_BUSINESS_PHONE_2 || '+91 91234 56780',
    email1: import.meta.env.VITE_BUSINESS_EMAIL_1 || 'info@shreebhagwaticaterers.com',
    email2: import.meta.env.VITE_BUSINESS_EMAIL_2 || 'bookings@shreebhagwaticaterers.com',
    hoursMonSat: import.meta.env.VITE_BUSINESS_HOURS_MON_SAT || '9:00 AM - 8:00 PM',
    hoursSun: import.meta.env.VITE_BUSINESS_HOURS_SUN || '10:00 AM - 6:00 PM'
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-bhagwati-maroon mb-6">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to make your event unforgettable? Contact us today to discuss your catering needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-bhagwati-maroon mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-bhagwati-maroon mb-1">Address</h4>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-bhagwati-maroon mb-1">Phone Numbers</h4>
                    <p className="text-gray-600">{contactInfo.phone1}</p>
                    <p className="text-gray-600">{contactInfo.phone2}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-bhagwati-maroon mb-1">Email Addresses</h4>
                    <p className="text-gray-600">{contactInfo.email1}</p>
                    <p className="text-gray-600">{contactInfo.email2}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-bhagwati-maroon to-bhagwati-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-bhagwati-maroon mb-1">Business Hours</h4>
                    <p className="text-gray-600">Mon - Sat: {contactInfo.hoursMonSat}</p>
                    <p className="text-gray-600">Sunday: {contactInfo.hoursSun}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Reviews Preview */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-bhagwati-maroon mb-6">What Our Clients Say</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-bhagwati-gold pl-4">
                  <p className="text-gray-600 italic">"Exceptional service and delicious food! Made our wedding day perfect."</p>
                  <p className="text-bhagwati-maroon font-semibold mt-2">- Happy Client</p>
                </div>
                <div className="border-l-4 border-bhagwati-gold pl-4">
                  <p className="text-gray-600 italic">"Professional team, authentic flavors, and beautiful presentation."</p>
                  <p className="text-bhagwati-maroon font-semibold mt-2">- Satisfied Customer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden">
              <iframe
                src={import.meta.env.VITE_MAP_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0234567890123!2d72.8776!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
