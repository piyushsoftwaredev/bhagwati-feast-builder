
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { GripVertical } from 'lucide-react';
import { 
  getHomepageSections, 
  setHomepageSections, 
  type HomepageSection 
} from '@/lib/json-storage';

const HomepageNavManager = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadSections = () => {
      const homepageSections = getHomepageSections();
      setSections(homepageSections);
    };
    
    loadSections();
  }, []);

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
    setHasChanges(true);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, visible: !section.visible }
        : section
    );
    setSections(updatedSections);
    setHasChanges(true);
  };

  const saveSections = () => {
    try {
      setHomepageSections(sections);
      setHasChanges(false);
      toast({
        title: 'Homepage Navigation Saved',
        description: 'Your homepage section order and visibility have been updated.',
      });
    } catch (error) {
      console.error('Error saving homepage sections:', error);
      toast({
        title: 'Error Saving',
        description: 'There was a problem saving your changes.',
        variant: 'destructive',
      });
    }
  };

  const resetSections = () => {
    const originalSections = getHomepageSections();
    setSections(originalSections);
    setHasChanges(false);
    toast({
      title: 'Changes Reset',
      description: 'All changes have been reset to the last saved state.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Homepage Navigation</h2>
          <p className="text-muted-foreground">
            Drag and drop to reorder sections, toggle visibility
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={resetSections}>
              Reset Changes
            </Button>
          )}
          <Button onClick={saveSections} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between p-4 bg-white border rounded-lg ${
                            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">{section.name}</h3>
                              <p className="text-sm text-gray-500">Component: {section.component}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {section.visible ? 'Visible' : 'Hidden'}
                            </span>
                            <Switch
                              checked={section.visible}
                              onCheckedChange={() => toggleSectionVisibility(section.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageNavManager;
