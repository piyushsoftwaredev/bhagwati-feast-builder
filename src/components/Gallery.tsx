
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/lovable-uploads/f3dd8b9e-0d8d-4025-b5c1-929eec597a75.png",
  "/lovable-uploads/ea95171a-ba8d-4ccc-9728-466125cc0a12.png", 
  "/lovable-uploads/04022677-d954-43b0-876d-dd5c2347b9ca.png",
  "/lovable-uploads/cd4468b2-489a-48f6-ad5b-5a125c881b59.png",
  "/lovable-uploads/32da8463-f389-487c-84b4-12d6c3cb623c.png",
  "/lovable-uploads/cb916d1d-c6aa-40bc-af47-e58fd0a5d003.png",
  "/lovable-uploads/f1ea15f5-dbe8-48e2-9edf-ceaf395ec13e.png",
  "/lovable-uploads/4e345c38-d584-4854-bd86-9417eb22256a.png",
  "/lovable-uploads/b66ca58b-b858-4677-b757-34700e2f45f5.png"
];

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setOpen(true);
  };

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const goPrevious = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">Our Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            Experience the luxury and grandeur of our premium catering setups - from ornate buffet displays to elegant chandelier-lit venues.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-xl cursor-pointer hover:shadow-2xl transition-all duration-500 group relative ring-1 ring-border/50 hover:ring-primary/20"
              onClick={() => openImage(image, index)}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 text-lg font-semibold transform scale-75 group-hover:scale-100">View Gallery</span>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Enlarged gallery image"
                className="w-full h-auto rounded-md"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <ChevronLeft className="text-primary" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <ChevronRight className="text-primary" />
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl">
            View Complete Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
