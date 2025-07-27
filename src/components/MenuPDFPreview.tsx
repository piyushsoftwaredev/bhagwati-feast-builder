import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Phone, Mail, MapPin, Utensils, Coffee, Cake, UtensilsCrossed, Pizza, Soup } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { envConfig } from "@/lib/env-config";

// Menu icons mapping
const menuIcons = {
  "Starter Menu": Utensils,
  "Main Course": UtensilsCrossed, 
  "Beverages": Coffee,
  "Desserts": Cake,
  "Snacks": Pizza,
  "Soups": Soup,
  "default": Utensils
};

interface MenuPDF {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  category: string;
  featured: boolean;
}

// Static menu PDFs configuration - easily editable
const menuPDFs: MenuPDF[] = [
  {
    id: "1",
    title: "Starter Menu",
    description: "Delicious appetizers and starters to begin your meal",
    pdfUrl: "/menus/starters.pdf",
    category: "Appetizers",
    featured: true
  },
  {
    id: "2", 
    title: "Main Course",
    description: "Traditional vegetarian main dishes with authentic flavors",
    pdfUrl: "/menus/main-course.pdf",
    category: "Main Dishes",
    featured: true
  },
  {
    id: "3",
    title: "Beverages",
    description: "Refreshing drinks and traditional beverages",
    pdfUrl: "/menus/beverages.pdf", 
    category: "Drinks",
    featured: false
  },
  {
    id: "4",
    title: "Desserts",
    description: "Sweet treats and traditional desserts",
    pdfUrl: "/menus/desserts.pdf",
    category: "Sweets",
    featured: true
  },
  {
    id: "5",
    title: "Snacks",
    description: "Light bites and evening snacks",
    pdfUrl: "/menus/snacks.pdf",
    category: "Light Food",
    featured: false
  },
  {
    id: "6",
    title: "Soups",
    description: "Warm and comforting soup varieties",
    pdfUrl: "/menus/soups.pdf",
    category: "Soups",
    featured: false
  }
];

const MenuPDFPreview = () => {
  const handleDownload = (pdfUrl: string, title: string) => {
    // Create download link
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (pdfUrl: string) => {
    // Open PDF in new tab for preview
    window.open(pdfUrl, '_blank');
  };

  const featuredMenus = menuPDFs.filter(menu => menu.featured);
  const otherMenus = menuPDFs.filter(menu => !menu.featured);

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading">Our Premium Menu Collection</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Download our beautifully crafted menu PDFs for different occasions. 
            Each menu is carefully curated with authentic vegetarian recipes and premium ingredients.
          </p>
        </div>

        {/* Featured Menus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredMenus.map((menu) => {
            const IconComponent = menuIcons[menu.title as keyof typeof menuIcons] || menuIcons.default;
            return (
              <Card key={menu.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-primary">{menu.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {menu.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreview(menu.pdfUrl)}
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleDownload(menu.pdfUrl, menu.title)}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Other Menus */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-primary mb-6">More Menu Options</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherMenus.map((menu) => {
            const IconComponent = menuIcons[menu.title as keyof typeof menuIcons] || menuIcons.default;
            return (
              <Card key={menu.id} className="hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-muted rounded-md">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{menu.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {menu.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePreview(menu.pdfUrl)}
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(menu.pdfUrl, menu.title)}
                      className="flex-1"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Get
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom Menu Requests */}
        <div className="mt-12 text-center bg-card/80 rounded-lg p-8 border border-primary/10">
          <h3 className="text-lg font-semibold text-primary mb-2">Custom Menu Requests</h3>
          <p className="text-muted-foreground mb-4">
            Need a personalized menu for your special event? Contact us for custom menu creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Phone className="mr-2 h-4 w-4" />
              {envConfig.business.phone1}
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Mail className="mr-2 h-4 w-4" />
              {envConfig.business.email1}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuPDFPreview;
