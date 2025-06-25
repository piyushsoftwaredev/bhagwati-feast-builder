
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url?: string;
}

// Demo menu data
const demoMenuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Dal Makhani',
    description: 'Rich and creamy black lentils cooked with butter and spices',
    price: '₹180',
    category: 'Main Course',
    image_url: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png'
  },
  {
    id: 'menu-2',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich tomato-based gravy',
    price: '₹220',
    category: 'Main Course'
  }
];

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenuItems);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: ''
  });
  const { toast } = useToast();

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Simulate save for static site
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingItem) {
        // Update existing item
        const updatedItems = menuItems.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        );
        setMenuItems(updatedItems);
        toast({
          title: 'Menu Item Updated (Demo Mode)',
          description: 'Menu item has been updated successfully',
        });
      } else {
        // Add new item
        const newItem: MenuItem = {
          id: `menu-${Date.now()}`,
          ...formData
        };
        setMenuItems([...menuItems, newItem]);
        toast({
          title: 'Menu Item Added (Demo Mode)',
          description: 'New menu item has been added successfully',
        });
      }
      
      setIsEditing(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', category: '', image_url: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save menu item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const filteredItems = menuItems.filter(item => item.id !== id);
      setMenuItems(filteredItems);
      toast({
        title: 'Menu Item Deleted (Demo Mode)',
        description: 'Menu item has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '', image_url: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Management (Demo Mode)</CardTitle>
          <CardDescription>
            Manage your menu items - Demo functionality only
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing && (
            <div className="mb-6">
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </div>
          )}

          {isEditing && (
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="₹180"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Main Course, Appetizer, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Item description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Image URL (optional)"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-sm font-medium text-bhagwati-gold">{item.price}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items yet. Add your first item above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManager;
