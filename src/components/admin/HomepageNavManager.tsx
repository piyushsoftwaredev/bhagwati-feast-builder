
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { GripVertical, Settings, EyeOff, Eye } from 'lucide-react';

interface HomepageSection {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  component: string;
}

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: 'hero', name: 'Hero Banner', visible: true, order: 0, component: 'Hero' },
  { id: 'services', name: 'Our Services', visible: true, order: 1, component: 'Services' },
  { id: 'menu', name: 'Featured Menu', visible: true, order: 2, component: 'Menu' },
  { id: 'gallery', name: 'Photo Gallery', visible: true, order: 3, component: 'Gallery' },
  { id: 'recent-posts', name: 'Recent Posts', visible: true, order: 4, component: 'RecentPosts' },
  { id: 'about', name: 'About Us', visible: true, order: 5, component: 'About' },
  { id: 'contact', name: 'Contact Information', visible: true, order: 6, component: 'Contact' }
];

const HomepageNavManager = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load homepage sections from database
  useEffect(() => {
    const fetchHomepageSections = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('key', 'homepage_sections')
          .single();

        if (error) {
          console.warn('Using default homepage sections due to error:', error);
          setSections(DEFAULT_SECTIONS);
        } else if (data?.value) {
          setSections(data.value as HomepageSection[]);
        } else {
          // If no config found, use defaults
          setSections(DEFAULT_SECTIONS);
        }
      } catch (error) {
        console.error('Error loading homepage sections:', error);
        setSections(DEFAULT_SECTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageSections();
  }, []);

  // Save homepage sections to database
  const saveHomepageSections = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'homepage_sections',
          value: sections,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Changes Saved',
        description: 'Homepage sections have been updated successfully.'
      });
    } catch (error: any) {
      console.error('Error saving homepage sections:', error);
      toast({
        title: 'Error Saving Changes',
        description: error.message || 'There was a problem saving your changes.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle visibility toggle
  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map(section => 
      section.id === id 
        ? { ...section, visible: !section.visible } 
        : section
    ));
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setSections(updatedItems);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSections(DEFAULT_SECTIONS);
    toast({
      title: 'Reset to Defaults',
      description: 'Homepage sections have been reset to default settings.'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-bhagwati-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Homepage Navigation</h2>
          <p className="text-muted-foreground">Drag and drop to reorder sections or toggle visibility</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Default
          </Button>
          <Button onClick={saveHomepageSections} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
          <CardDescription>
            Drag sections to reorder them. Toggle the visibility to show/hide sections on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="homepage-sections">
              {(provided) => (
                <ul
                  className="space-y-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sections.sort((a, b) => a.order - b.order).map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-md p-3 bg-white flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab p-1 hover:bg-gray-100 rounded"
                            >
                              <GripVertical className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{section.name}</h3>
                              <p className="text-sm text-gray-500">{section.component} Component</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {section.visible ? 
                                <Eye className="h-4 w-4 text-green-600" /> : 
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              }
                              <span className="text-sm font-medium">
                                {section.visible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                            <Switch
                              checked={section.visible}
                              onCheckedChange={() => toggleSectionVisibility(section.id)}
                            />
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageNavManager;
