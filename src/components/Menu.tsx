
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, UtensilsCrossed } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { Link } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string;
  is_vegetarian: boolean;
  is_featured: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

const Menu = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        // Fetch categories ordered by display_order
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          return;
        }

        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
          setActiveCategory(categoriesData[0].id);

          // Fetch all menu items
          const { data: menuItemsData, error: menuItemsError } = await supabase
            .from('menu_items')
            .select('*')
            .order('name');

          if (menuItemsError) {
            console.error('Error fetching menu items:', menuItemsError);
            return;
          }

          if (menuItemsData) {
            setMenuItems(menuItemsData);
          }
        }
      } catch (error) {
        console.error('Error in menu data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is admin (simplified check for demo purposes)
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session); // In a real app, you'd check for admin role
    };

    fetchMenuData();
    checkAdminStatus();
  }, []);

  // Filter menu items by category
  const filteredItems = menuItems.filter(
    item => activeCategory && item.category_id === activeCategory
  );

  // Render loading skeletons
  if (loading) {
    return (
      <section id="menu" className="py-20">
        <div className="content-container">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto mt-4" />
          </div>
          
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-96" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-36" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

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

        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <Link to="/admin?tab=menu">
              <Button variant="outline" className="border-bhagwati-gold text-bhagwati-gold hover:bg-bhagwati-gold/10">
                Edit Menu
              </Button>
            </Link>
          </div>
        )}
        
        {categories.length > 0 ? (
          <Tabs 
            value={activeCategory || categories[0].id} 
            onValueChange={setActiveCategory}
            className="space-y-8"
          >
            <TabsList className="mx-auto flex justify-center flex-wrap">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-6"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
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
                          <span className="font-bold text-bhagwati-gold">₹{item.price}</span>
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
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Menu categories will be available soon.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90 text-white px-8 py-6">
            View Full Menu <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Menu;
