// Environment configuration utility
export const envConfig = {
  business: {
    name: import.meta.env.VITE_BUSINESS_NAME || "Shree Bhagwati Caterers",
    address: import.meta.env.VITE_BUSINESS_ADDRESS || "123 Catering Street, Foodie District, Mumbai, Maharashtra 400001",
    phone1: import.meta.env.VITE_BUSINESS_PHONE_1 || "+91 98765 43210",
    phone2: import.meta.env.VITE_BUSINESS_PHONE_2 || "+91 91234 56780",
    email1: import.meta.env.VITE_BUSINESS_EMAIL_1 || "info@shreebhagwaticaterers.com",
    email2: import.meta.env.VITE_BUSINESS_EMAIL_2 || "bookings@shreebhagwaticaterers.com",
    hoursMonSat: import.meta.env.VITE_BUSINESS_HOURS_MON_SAT || "9:00 AM - 8:00 PM",
    hoursSun: import.meta.env.VITE_BUSINESS_HOURS_SUN || "10:00 AM - 6:00 PM",
  },
  map: {
    embedUrl: import.meta.env.VITE_MAP_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0234567890123!2d72.8776!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin",
  },
  theme: {
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR || "#8B0000",
    secondaryColor: import.meta.env.VITE_SECONDARY_COLOR || "#FFD700",
  }
};