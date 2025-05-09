
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Define the PageData interface
interface PageData {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

const PageEditor = () => {
  const [pages] = useState<PageData[]>([]);
  const [selectedPage] = useState<PageData | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
          <CardDescription>
            Create and edit content pages for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Page Editor</AlertTitle>
            <AlertDescription>
              This feature is currently under development. You'll soon be able to create and edit custom pages.
            </AlertDescription>
          </Alert>

          {pages.length === 0 && !selectedPage && (
            <div className="text-center py-8">
              <p className="text-gray-500">No pages have been created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageEditor;
