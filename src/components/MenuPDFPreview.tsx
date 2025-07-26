import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { envConfig } from "@/lib/env-config";

interface MenuPDF {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  previewImage: string;
  category: 'wedding' | 'corporate' | 'premium' | 'festival';
  featured: boolean;
}

// Static menu PDFs configuration - easily editable
const menuPDFs: MenuPDF[] = [
  {
    id: 'wedding-menu',
    title: 'Wedding Celebration Menu',
    description: 'Complete wedding feast menu with traditional delicacies',
    pdfUrl: '/menus/wedding-menu.pdf',
    previewImage: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    category: 'wedding',
    featured: true
  },
  {
    id: 'corporate-menu',
    title: 'Corporate Event Menu',
    description: 'Professional catering menu for business events',
    pdfUrl: '/menus/corporate-menu.pdf',
    previewImage: '/lovable-uploads/29d05495-6e8e-408c-bec9-3ee275a1cb56.png',
    category: 'corporate',
    featured: true
  },
  {
    id: 'premium-menu',
    title: 'Premium Collection',
    description: 'Luxury dining experience with exotic vegetarian cuisine',
    pdfUrl: '/menus/premium-menu.pdf',
    previewImage: '/lovable-uploads/855a3d91-f135-4067-9759-efbd99d6ac2b.png',
    category: 'premium',
    featured: true
  },
  {
    id: 'festival-menu',
    title: 'Festival Special Menu',
    description: 'Traditional festival catering with authentic recipes',
    pdfUrl: '/menus/festival-menu.pdf',
    previewImage: '/lovable-uploads/c83694ad-699f-427b-838a-2053287781c1.png',
    category: 'festival',
    featured: false
  }
];

const categoryNames = {
  wedding: 'Wedding',
  corporate: 'Corporate', 
  premium: 'Premium',
  festival: 'Festival'
};

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

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="content-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/fcc83566-eb0f-46e6-9401-1b4837300c76.png" 
              alt={envConfig.business.name}
              className="h-12 w-auto"
            />
            <h2 className="section-heading">Our Premium Menu Collection</h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Download our beautifully crafted menu PDFs for different occasions. 
            Each menu is carefully curated with authentic vegetarian recipes and premium ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {menuPDFs.filter(menu => menu.featured).map((menu) => (
            <Card key={menu.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={menu.previewImage}
                  alt={menu.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {categoryNames[menu.category]}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary group-hover:text-secondary transition-colors">
                  {menu.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {menu.description}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreview(menu.pdfUrl)}
                    className="flex-1 border-primary/20 hover:bg-primary/5"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleDownload(menu.pdfUrl, menu.title)}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional menus */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-primary mb-6">More Menu Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {menuPDFs.filter(menu => !menu.featured).map((menu) => (
              <Card key={menu.id} className="p-4 hover:shadow-md transition-shadow bg-white/60 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-medium text-primary">{menu.title}</h4>
                    <p className="text-sm text-muted-foreground">{menu.description}</p>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handlePreview(menu.pdfUrl)}
                      className="p-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(menu.pdfUrl, menu.title)}
                      className="p-2"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-primary/10">
          <h3 className="text-lg font-semibold text-primary mb-2">Custom Menu Requests</h3>
          <p className="text-muted-foreground mb-4">
            Need a personalized menu for your special event? Contact us for custom menu creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Call: {envConfig.business.phone1}
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Email: {envConfig.business.email1}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuPDFPreview;