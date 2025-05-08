
import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectGroup, SelectItem, 
  SelectLabel, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Pencil, Plus, Trash2, Image, MoveUp, MoveDown } from "lucide-react";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  is_vegetarian: boolean;
  is_featured: boolean;
}

const MenuManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('categories');
  
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Add/Edit Category dialog states
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  
  // Add/Edit Menu Item dialog states
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category_id: '',
    is_vegetarian: true,
    is_featured: false
  });
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');
      
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
      
      // Fetch menu items
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      
      if (menuItemsError) throw menuItemsError;
      setMenuItems(menuItemsData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load menu data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Category CRUD operations
  const addCategory = async () => {
    if (!categoryForm.name) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }
    
    setSaving(true);
    try {
      // Get the highest order number
      const highestOrder = categories.length > 0
        ? Math.max(...categories.map(c => c.display_order))
        : 0;
      
      const newCategory = {
        name: categoryForm.name,
        description: categoryForm.description || null,
        display_order: highestOrder + 1
      };
      
      const { error } = await supabase
        .from('menu_categories')
        .insert(newCategory);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Category added successfully'
      });
      
      // Reset form and refresh data
      setCategoryForm({ name: '', description: '' });
      setIsAddCategoryDialogOpen(false);
      fetchData();
      
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const editCategory = async () => {
    if (!selectedCategory || !categoryForm.name) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }
    
    setSaving(true);
    try {
      const updatedCategory = {
        name: categoryForm.name,
        description: categoryForm.description || null
      };
      
      const { error } = await supabase
        .from('menu_categories')
        .update(updatedCategory)
        .eq('id', selectedCategory.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Category updated successfully'
      });
      
      // Reset form and refresh data
      setCategoryForm({ name: '', description: '' });
      setSelectedCategory(null);
      setIsAddCategoryDialogOpen(false);
      fetchData();
      
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const deleteCategory = async (categoryId: string) => {
    try {
      // Check if category has menu items
      const itemsInCategory = menuItems.filter(item => item.category_id === categoryId);
      
      if (itemsInCategory.length > 0) {
        toast({
          title: 'Cannot Delete',
          description: `This category has ${itemsInCategory.length} menu items. Please delete or move them first.`,
          variant: 'destructive'
        });
        return;
      }
      
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Category deleted successfully'
      });
      
      fetchData();
      
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      });
    }
  };
  
  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (
      (direction === 'up' && categoryIndex === 0) || 
      (direction === 'down' && categoryIndex === categories.length - 1)
    ) {
      return;
    }
    
    const swapIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    
    try {
      const currentCategory = categories[categoryIndex];
      const swapCategory = categories[swapIndex];
      
      // Swap display_order values
      const updates = [
        { 
          id: currentCategory.id, 
          display_order: swapCategory.display_order 
        },
        { 
          id: swapCategory.id, 
          display_order: currentCategory.display_order 
        }
      ];
      
      // Update both categories
      for (const update of updates) {
        const { error } = await supabase
          .from('menu_categories')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      fetchData();
      
    } catch (error) {
      console.error('Error moving category:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder categories',
        variant: 'destructive'
      });
    }
  };
  
  // Menu item CRUD operations
  const addMenuItem = async () => {
    if (!menuItemForm.name || !menuItemForm.category_id) {
      toast({
        title: 'Validation Error',
        description: 'Name and category are required',
        variant: 'destructive'
      });
      return;
    }
    
    setSaving(true);
    try {
      const newMenuItem = {
        name: menuItemForm.name,
        description: menuItemForm.description || null,
        price: Number(menuItemForm.price),
        image_url: menuItemForm.image_url || null,
        category_id: menuItemForm.category_id,
        is_vegetarian: menuItemForm.is_vegetarian,
        is_featured: menuItemForm.is_featured
      };
      
      const { error } = await supabase
        .from('menu_items')
        .insert(newMenuItem);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Menu item added successfully'
      });
      
      // Reset form and refresh data
      setMenuItemForm({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category_id: '',
        is_vegetarian: true,
        is_featured: false
      });
      setIsAddMenuItemDialogOpen(false);
      fetchData();
      
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add menu item',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const editMenuItem = async () => {
    if (!selectedMenuItem || !menuItemForm.name || !menuItemForm.category_id) {
      toast({
        title: 'Validation Error',
        description: 'Name and category are required',
        variant: 'destructive'
      });
      return;
    }
    
    setSaving(true);
    try {
      const updatedMenuItem = {
        name: menuItemForm.name,
        description: menuItemForm.description || null,
        price: Number(menuItemForm.price),
        image_url: menuItemForm.image_url || null,
        category_id: menuItemForm.category_id,
        is_vegetarian: menuItemForm.is_vegetarian,
        is_featured: menuItemForm.is_featured
      };
      
      const { error } = await supabase
        .from('menu_items')
        .update(updatedMenuItem)
        .eq('id', selectedMenuItem.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Menu item updated successfully'
      });
      
      // Reset form and refresh data
      setMenuItemForm({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category_id: '',
        is_vegetarian: true,
        is_featured: false
      });
      setSelectedMenuItem(null);
      setIsAddMenuItemDialogOpen(false);
      fetchData();
      
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update menu item',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const deleteMenuItem = async (menuItemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', menuItemId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully'
      });
      
      fetchData();
      
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive'
      });
    }
  };
  
  // Helper to get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  
  const openAddCategoryDialog = () => {
    setCategoryForm({ name: '', description: '' });
    setSelectedCategory(null);
    setIsAddCategoryDialogOpen(true);
  };
  
  const openEditCategoryDialog = (category: MenuCategory) => {
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    });
    setSelectedCategory(category);
    setIsAddCategoryDialogOpen(true);
  };
  
  const openAddMenuItemDialog = () => {
    setMenuItemForm({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      is_vegetarian: true,
      is_featured: false
    });
    setSelectedMenuItem(null);
    setIsAddMenuItemDialogOpen(true);
  };
  
  const openEditMenuItemDialog = (menuItem: MenuItem) => {
    setMenuItemForm({
      name: menuItem.name,
      description: menuItem.description || '',
      price: menuItem.price,
      image_url: menuItem.image_url || '',
      category_id: menuItem.category_id,
      is_vegetarian: menuItem.is_vegetarian,
      is_featured: menuItem.is_featured
    });
    setSelectedMenuItem(menuItem);
    setIsAddMenuItemDialogOpen(true);
  };
  
  // Helper to open image browser in a new dialog
  const openImageBrowser = () => {
    // This is a placeholder - in a real implementation,
    // you would open image gallery to select an image
    toast({
      title: 'Feature Not Implemented',
      description: 'Image browser is not implemented in this demo'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Management</CardTitle>
          <CardDescription>
            Manage your catering menu categories and items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="items">Menu Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  onClick={openAddCategoryDialog}
                  className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Order</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          No categories found. Create your first category.
                        </td>
                      </tr>
                    ) : (
                      categories.map((category, index) => (
                        <tr key={category.id} className="border-t">
                          <td className="px-4 py-3 font-medium">{category.name}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {category.description || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <span>{category.display_order}</span>
                              <div className="ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={index === 0}
                                  onClick={() => moveCategory(category.id, 'up')}
                                  className="h-7 w-7 p-0"
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={index === categories.length - 1}
                                  onClick={() => moveCategory(category.id, 'down')}
                                  className="h-7 w-7 p-0"
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditCategoryDialog(category)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the "{category.name}" category?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteCategory(category.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="items" className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  onClick={openAddMenuItemDialog}
                  className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90"
                  disabled={categories.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
              </div>
              
              {categories.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-md">
                  You need to create at least one category before adding menu items.
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-center">Vegetarian</th>
                        <th className="px-4 py-2 text-center">Featured</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No menu items found. Create your first menu item.
                          </td>
                        </tr>
                      ) : (
                        menuItems.map(item => (
                          <tr key={item.id} className="border-t">
                            <td className="px-4 py-3 font-medium">{item.name}</td>
                            <td className="px-4 py-3">{getCategoryName(item.category_id)}</td>
                            <td className="px-4 py-3">₹{item.price}</td>
                            <td className="px-4 py-3 text-center">
                              {item.is_vegetarian ? '✓' : '✗'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item.is_featured ? '✓' : '✗'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditMenuItemDialog(item)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{item.name}"?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteMenuItem(item.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Category Add/Edit Dialog */}
      <Dialog 
        open={isAddCategoryDialogOpen} 
        onOpenChange={setIsAddCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory 
                ? 'Update the details of this category'
                : 'Create a new menu category'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name" 
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                placeholder="e.g., Appetizers, Main Course, Desserts"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                placeholder="A short description of this category"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={selectedCategory ? editCategory : addCategory}
              disabled={saving}
              className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90"
            >
              {saving ? 'Saving...' : (selectedCategory ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Menu Item Add/Edit Dialog */}
      <Dialog 
        open={isAddMenuItemDialogOpen} 
        onOpenChange={setIsAddMenuItemDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </DialogTitle>
            <DialogDescription>
              {selectedMenuItem 
                ? 'Update the details of this menu item'
                : 'Create a new item for your menu'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input 
                id="item-name" 
                value={menuItemForm.name}
                onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
                placeholder="e.g., Paneer Tikka, Vegetable Biryani"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-description">Description (Optional)</Label>
              <Textarea 
                id="item-description" 
                value={menuItemForm.description}
                onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
                placeholder="A brief description of this dish"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select 
                  value={menuItemForm.category_id}
                  onValueChange={(value) => setMenuItemForm({...menuItemForm, category_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (₹)</Label>
                <Input 
                  id="item-price" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={menuItemForm.price}
                  onChange={(e) => setMenuItemForm({...menuItemForm, price: parseFloat(e.target.value)})}
                  placeholder="e.g., 250"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-image">Image URL</Label>
              <div className="flex space-x-2">
                <Input 
                  id="item-image" 
                  className="flex-1"
                  value={menuItemForm.image_url}
                  onChange={(e) => setMenuItemForm({...menuItemForm, image_url: e.target.value})}
                  placeholder="/path/to/image.jpg"
                />
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={openImageBrowser}
                >
                  <Image className="h-4 w-4 mr-1" /> Browse
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-vegetarian"
                  checked={menuItemForm.is_vegetarian}
                  onCheckedChange={(checked) => setMenuItemForm({...menuItemForm, is_vegetarian: checked})}
                />
                <Label htmlFor="is-vegetarian">Vegetarian</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-featured"
                  checked={menuItemForm.is_featured}
                  onCheckedChange={(checked) => setMenuItemForm({...menuItemForm, is_featured: checked})}
                />
                <Label htmlFor="is-featured">Featured Item</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddMenuItemDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={selectedMenuItem ? editMenuItem : addMenuItem}
              disabled={saving}
              className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90"
            >
              {saving ? 'Saving...' : (selectedMenuItem ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManager;
