
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

// Static menu data
const staticCategories = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Delicious starters to begin your meal',
    display_order: 1
  },
  {
    id: 'main-course',
    name: 'Main Course',
    description: 'Hearty traditional dishes',
    display_order: 2
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet endings to your meal',
    display_order: 3
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Refreshing drinks',
    display_order: 4
  }
];

const staticMenuItems = [
  {
    id: '1',
    name: 'Samosa Chaat',
    description: 'Crispy samosas topped with tangy chutneys and fresh herbs',
    image_url: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    category_id: 'appetizers',
    is_vegetarian: true,
    is_featured: true
  },
  {
    id: '2',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection with aromatic spices',
    image_url: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
    category_id: 'appetizers',
    is_vegetarian: true,
    is_featured: false
  },
  {
    id: '3',
    name: 'Dal Makhani',
    description: 'Rich and creamy black lentils slow-cooked with butter and spices',
    image_url: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
    category_id: 'main-course',
    is_vegetarian: true,
    is_featured: true
  },
  {
    id: '4',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice layered with seasonal vegetables and aromatic spices',
    image_url: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    category_id: 'main-course',
    is_vegetarian: true,
    is_featured: true
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in cardamom-scented sugar syrup',
    image_url: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
    category_id: 'desserts',
    is_vegetarian: true,
    is_featured: false
  },
  {
    id: '6',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea brewed with aromatic spices',
    image_url: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
    category_id: 'beverages',
    is_vegetarian: true,
    is_featured: false
  }
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<string>(staticCategories[0].id);

  // Filter menu items by category
  const filteredItems = staticMenuItems.filter(
    item => item.category_id === activeCategory
  );

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="section-heading mx-auto">Our Premium Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Explore our delectable vegetarian dishes prepared with the finest ingredients
            and authentic recipes handed down through generations
          </p>
        </div>
        
        <Tabs 
          value={activeCategory} 
          onValueChange={setActiveCategory}
          className="space-y-8"
        >
          <TabsList className="mx-auto flex justify-center flex-wrap">
            {staticCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-6"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {staticCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    {item.image_url ? (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <UtensilsCrossed className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-bhagwati-maroon">{item.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {item.is_vegetarian && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Vegetarian</span>
                      )}
                      {item.is_featured && (
                        <span className="text-xs bg-bhagwati-gold/20 text-bhagwati-gold ml-2 px-2 py-1 rounded">Featured</span>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No menu items found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 text-center">
          <Link to="/menu">
            <Button className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90 text-white px-8 py-6">
              View Full Menu <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Menu;
