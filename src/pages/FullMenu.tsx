
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

interface MenuItem {
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  vegetarian?: boolean;
}

interface MenuSection {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

const FullMenu = () => {
  const [activeCategory, setActiveCategory] = useState("main-course");
  
  const categories = [
    { id: "main-course", name: "Main Course" },
    { id: "rice-tandoor", name: "Rice & Tandoor" },
    { id: "indian-snacks", name: "Indian Snacks" },
    { id: "chinese-snacks", name: "Chinese Snacks" },
    { id: "soups", name: "Soups" },
    { id: "chaats", name: "Chaats" },
    { id: "south-indian", name: "South Indian" },
    { id: "salads", name: "Salad Bar" },
    { id: "raita", name: "Raita Hub" },
    { id: "papad", name: "Papad" },
    { id: "fruits", name: "Fruits" },
    { id: "desserts", name: "Desserts" },
    { id: "ice-cream", name: "Ice Cream" },
    { id: "kulfi", name: "Stick Kulfi" },
    { id: "beverages", name: "Beverages" },
    { id: "extras", name: "Extra Charges" },
  ];
  
  const menuSections: Record<string, MenuSection[]> = {
    "main-course": [
      {
        title: "Main Course",
        items: [
          { name: "Shahi Paneer", vegetarian: true },
          { name: "Palak Paneer", vegetarian: true },
          { name: "Soyabean Chaap", vegetarian: true },
          { name: "Amritsari Cholley", vegetarian: true },
          { name: "Dal Makhni", vegetarian: true },
          { name: "Mix Vegetable", vegetarian: true },
          { name: "Kashmiri Dam Aloo", vegetarian: true },
          { name: "Kadi Pakoda", vegetarian: true },
          { name: "Kaju Matar Makhana", vegetarian: true },
          { name: "Palak Kopta", vegetarian: true },
          { name: "Sarsoo Ka Saag (Seasonal)", vegetarian: true },
          { name: "Tinda Masala (Seasonal)", vegetarian: true },
        ]
      },
      {
        title: "Desi Rasoi",
        items: [
          { name: "Dal Tadka", vegetarian: true },
          { name: "Kurkuri Bhindi (Seasonal)", vegetarian: true },
          { name: "Aloo Methi (Seasonal)", vegetarian: true },
          { name: "Gajar Matar Sukhi Sabzi", vegetarian: true },
          { name: "Tawa Fulka", vegetarian: true },
          { name: "Fulka Machine (On Demand)", vegetarian: true },
        ]
      }
    ],
    "rice-tandoor": [
      {
        title: "Rice",
        subtitle: "Choice any 3",
        items: [
          { name: "Hyderabadi Veg Biryani", vegetarian: true },
          { name: "Navratan Pulao", vegetarian: true },
          { name: "Mix Vegetable Pulao", vegetarian: true },
          { name: "Matar Pulao Rice", vegetarian: true },
          { name: "Jeera Rice", vegetarian: true },
        ]
      },
      {
        title: "Tandoor-Se",
        items: [
          { name: "Plain Naan", vegetarian: true },
          { name: "Butter Naan", vegetarian: true },
          { name: "Stuff Naan", vegetarian: true },
          { name: "Lachha Prantha", vegetarian: true },
          { name: "Tandoori Roti", vegetarian: true },
          { name: "Missi Roti", vegetarian: true },
          { name: "Plain Poori", vegetarian: true },
          { name: "Palak Poori", vegetarian: true },
        ]
      }
    ],
    "indian-snacks": [
      {
        title: "Indian Snacks",
        items: [
          { name: "Paneer Sholla", vegetarian: true },
          { name: "Tiranga Paneer", vegetarian: true },
          { name: "Dhahi Kabab", vegetarian: true },
          { name: "Dhahi Ka Sholla", vegetarian: true },
          { name: "Speeti Roll", vegetarian: true },
          { name: "Vegetable Cocktail Roll", vegetarian: true },
          { name: "Baby Corn Roll", vegetarian: true },
          { name: "Boby Corn Stick", vegetarian: true },
          { name: "Khasta Kabab", vegetarian: true },
          { name: "Corn Boll", vegetarian: true },
          { name: "Stufed Chaap", vegetarian: true },
          { name: "Cheese Insulator", vegetarian: true },
          { name: "Patato Finger", vegetarian: true },
        ]
      },
    ],
    "chinese-snacks": [
      {
        title: "Chinese Snacks",
        items: [
          { name: "Chilly Paneer", vegetarian: true },
          { name: "Chilly Gobhi", vegetarian: true },
          { name: "Chilly Patato", vegetarian: true },
          { name: "Chilly Manchurian with Gravy", vegetarian: true },
        ]
      }
    ],
    "soups": [
      {
        title: "Soups Station",
        items: [
          { name: "Cream of Tomato Soup", vegetarian: true },
          { name: "Sweet Corn Soup", vegetarian: true },
        ]
      }
    ],
    "chaats": [
      {
        title: "Komcha Chatpati Chaat",
        items: [
          { name: "Gol Gappe", vegetarian: true },
          { name: "Bhalla Papdi", vegetarian: true },
          { name: "Mango Bhalla", vegetarian: true },
          { name: "Aloo Paneer Tikki", vegetarian: true },
          { name: "Tokri Lachha Tikki", vegetarian: true },
          { name: "Moong Dal Chilla", vegetarian: true },
          { name: "Pao Bhaji", vegetarian: true },
          { name: "Veg. Chowmein", vegetarian: true },
          { name: "Matar Patila Kulche with Makkan", vegetarian: true },
        ]
      }
    ],
    "south-indian": [
      {
        title: "South India",
        items: [
          { name: "Plain Dosa", vegetarian: true },
          { name: "Masala Dosa", vegetarian: true },
          { name: "Idli", vegetarian: true },
          { name: "Vada", vegetarian: true },
          { name: "Sambar", vegetarian: true },
        ]
      }
    ],
    "salads": [
      {
        title: "Salad Bar",
        items: [
          { name: "Green Salad", vegetarian: true },
          { name: "Ankruit Salad", vegetarian: true },
          { name: "Russian Salad", vegetarian: true },
          { name: "Kachumbar Salad", vegetarian: true },
          { name: "Matar Aloo Salad", vegetarian: true },
          { name: "Macaroni Salad", vegetarian: true },
          { name: "Chesse Capsicum Salad", vegetarian: true },
          { name: "Mixed Pickles", vegetarian: true },
          { name: "4 Types of Papad", vegetarian: true },
        ]
      }
    ],
    "raita": [
      {
        title: "Raita Hub",
        subtitle: "Choose any 3",
        items: [
          { name: "Mix Fruit", vegetarian: true },
          { name: "Mix Vegetable", vegetarian: true },
          { name: "Bathue Ka Raita", vegetarian: true },
          { name: "Boondi Ka Raita", vegetarian: true },
          { name: "Dhahi Pakodi", vegetarian: true },
        ]
      }
    ],
    "papad": [
      {
        title: "Papad",
        items: [
          { name: "Mung Daal Papad", vegetarian: true },
          { name: "Cookies Papad", vegetarian: true },
          { name: "Bikaneri Papad", vegetarian: true },
          { name: "Urad Dal Papad", vegetarian: true },
        ]
      }
    ],
    "fruits": [
      {
        title: "Indian Fruit",
        items: [
          { name: "Apple", vegetarian: true },
          { name: "Pineapple", vegetarian: true },
          { name: "Watermelon", vegetarian: true },
          { name: "Canary Melon", vegetarian: true },
          { name: "Guava", vegetarian: true },
          { name: "Grapes", vegetarian: true },
          { name: "Orange", vegetarian: true },
        ]
      },
      {
        title: "Imported Fruit",
        items: [
          { name: "Kiwi", vegetarian: true },
          { name: "Dragon Fruit", vegetarian: true },
          { name: "Red Globe Grapes", vegetarian: true },
          { name: "Strawberry", vegetarian: true },
          { name: "Tamarinds", vegetarian: true },
        ]
      },
      {
        title: "Dim Sum Pasta",
        subtitle: "On Live Demand",
        items: [
          { name: "Pasta (Live)", vegetarian: true },
          { name: "Baked Vegetable", vegetarian: true },
          { name: "Vegetable Gratin", vegetarian: true },
          { name: "Vegetable Lasgne", vegetarian: true },
        ]
      }
    ],
    "desserts": [
      {
        title: "Sweets",
        subtitle: "Choose any Five",
        items: [
          { name: "Stuff Gulab Jamun", vegetarian: true },
          { name: "Moong Dal Halwa", vegetarian: true },
          { name: "Gajar Halwa (Seasonal)", vegetarian: true },
          { name: "Rabri Jalebi", vegetarian: true },
          { name: "Cold Kesari Kheer", vegetarian: true },
          { name: "Cold Strawberry Kheer", vegetarian: true },
          { name: "Bengali Rasgulla", vegetarian: true },
          { name: "Rajbhog", vegetarian: true },
        ]
      }
    ],
    "ice-cream": [
      {
        title: "Ice Cream",
        items: [
          { name: "Vanilla", vegetarian: true },
          { name: "Strawberry", vegetarian: true },
          { name: "Butterscotch Ice Cream", vegetarian: true },
          { name: "Chocolate Ice Cream", vegetarian: true },
        ]
      }
    ],
    "kulfi": [
      {
        title: "Stick Kulfi",
        items: [
          { name: "Rabdi Stick Kulfi", vegetarian: true },
          { name: "Anar Stick Kulfi", vegetarian: true },
          { name: "Mango Stick Kulfi", vegetarian: true },
          { name: "Paan Stick Kulfi", vegetarian: true },
        ]
      }
    ],
    "beverages": [
      {
        title: "Welcome Drinks",
        items: [
          { name: "Bottle", vegetarian: true },
          { name: "Glass (Pkd.)", vegetarian: true },
          { name: "Coke", vegetarian: true },
          { name: "Fanta", vegetarian: true },
          { name: "Limca", vegetarian: true },
          { name: "Mineral Water Jar (20Ltr.)", vegetarian: true },
          { name: "Coffee", vegetarian: true },
        ]
      },
      {
        title: "Mocktails",
        items: [
          { name: "Blue Heaven", vegetarian: true },
          { name: "Green Mint", vegetarian: true },
          { name: "Pineapple Mist", vegetarian: true },
          { name: "Ginger Mint", vegetarian: true },
          { name: "Mojito Mint", vegetarian: true },
        ]
      },
      {
        title: "Shakes",
        items: [
          { name: "Strawberry Shake", vegetarian: true },
          { name: "Butter Scotch Shake", vegetarian: true },
          { name: "Pineapple Shake", vegetarian: true },
          { name: "Mango Shake", vegetarian: true },
        ]
      },
      {
        title: "Fresh Juices",
        items: [
          { name: "Fresh Juice", vegetarian: true },
          { name: "Water Melon Juice", vegetarian: true },
          { name: "Orange Juice", vegetarian: true },
        ]
      }
    ],
    "extras": [
      {
        title: "Extra Charges Stall",
        items: [
          { name: "Doodh Ki Kadai", vegetarian: true },
          { name: "Kulfi Falooda", vegetarian: true },
          { name: "Verity Kulfi", vegetarian: true },
          { name: "Ice Cream Parlour", vegetarian: true },
          { name: "Pizza Counter", vegetarian: true },
          { name: "Coffee Hut", vegetarian: true },
          { name: "Chuski Popcorn", vegetarian: true },
          { name: "Candy Sweet Corn", vegetarian: true },
          { name: "Cake Pooding Counter", vegetarian: true },
          { name: "VIP Sajaan Court (Silver)", vegetarian: true },
          { name: "Pan Counter", vegetarian: true },
          { name: "Spacial Rajsthani Counter", vegetarian: true },
        ]
      },
      {
        title: "Assemble Point",
        items: [
          { name: "Water Glass (Pkt)", vegetarian: true },
          { name: "Coke", vegetarian: true },
          { name: "Limca", vegetarian: true },
          { name: "Fanta", vegetarian: true },
          { name: "Coffee", vegetarian: true },
          { name: "4 Types Pakode", vegetarian: true },
        ]
      }
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-12 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-bhagwati-maroon">Our Complete Menu</h1>
            <Link to="/" className="flex items-center text-bhagwati-maroon hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-center text-bhagwati-gold mb-2">Shree Bhagwati Caterers</h2>
              <p className="text-center text-gray-600 mb-6">
                We specialize in premium vegetarian catering for all occasions. All our food is 100% vegetarian.
              </p>
              
              <Tabs 
                value={activeCategory} 
                onValueChange={setActiveCategory}
                className="space-y-8"
              >
                <TabsList className="w-full flex flex-wrap justify-center">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="px-4 py-2 text-sm"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(menuSections).map(([categoryId, sections]) => (
                  <TabsContent key={categoryId} value={categoryId} className="pt-4">
                    <div className="flex flex-col gap-12">
                      {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden">
                          <div className="border-b border-gray-200 bg-gradient-to-r from-bhagwati-maroon/5 to-bhagwati-gold/5 p-4">
                            <h3 className="text-2xl font-bold text-bhagwati-maroon text-center">
                              {section.title}
                            </h3>
                            {section.subtitle && (
                              <p className="text-center text-gray-600 italic mt-1">{section.subtitle}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {section.items.map((item, itemIdx) => (
                              <Card key={itemIdx} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-lg">{item.name}</span>
                                    {item.price && <span className="font-bold text-bhagwati-gold">₹{item.price}</span>}
                                  </div>
                                  {item.description && (
                                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                  )}
                                  {item.vegetarian && (
                                    <div className="mt-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        100% Vegetarian
                                      </span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-bhagwati-maroon/10">
              <h2 className="text-xl font-bold text-center text-bhagwati-maroon mb-4">Notes</h2>
              <div className="space-y-2">
                <p className="text-gray-700"><strong>1.</strong> Bone China Crockery Will be Extra Charges.</p>
                <p className="text-gray-700"><strong>2.</strong> Sajan Dinner Course, Silver Service Will be Extra Charges.</p>
              </div>
              
              <h3 className="text-lg font-bold text-center text-bhagwati-maroon mt-6 mb-3">Terms & Conditions</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>50% ADVANCE SHALL BE PAID AT THE TIME OF BOOKING AND BALANCE SHALL BE PAID BEFORE THE FUNCTION.</li>
                <li>THE MINIMUM GUARANTEE WILL BE CHARGED EVEN IF THE NUMBER OF PERSONS ARE LESS, IF THE PERSONS EXCEED THE MINIMUM GUARANTEE THEY WILL BE CHARGED ACCORDINGLY AFTER FOOD BUT BEFORE SOLEMNIZATION OF RELIGIOUS FUNCTION.</li>
                <li>ADVANCE PAYMENT SHALL NOT BE REFUND IN CASE OF CANCELLATIONS OF THE FUNCTION OR ANY OTHER CIRCUMSTANCES.</li>
                <li>SHARING WITH PLATES ARE NOT ALLOWED.</li>
                <li>SERVICE CHARGE EXTRA.</li>
                <li>TAXES AS APPLICATION.(AS PER APPLICABLE GOVT. OF INDIA.)</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FullMenu;
