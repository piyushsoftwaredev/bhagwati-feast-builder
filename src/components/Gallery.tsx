
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "public/lovable-uploads/85295c30-c0f5-402a-aac3-01ffb77813dd.png",
  "public/lovable-uploads/34472606-9de3-4d0b-a7a8-f71a7d9a8855.png",
  "public/lovable-uploads/0396753c-dfda-477f-b50d-9bb340fe980a.png",
  "public/lovable-uploads/b254bb53-4e33-45f3-b7f6-2f14c80c8c42.png",
  "public/lovable-uploads/9d334954-742a-4fcb-89dc-29d2c62cf95b.png",
  "public/lovable-uploads/8dbe11d3-7faa-4923-8afb-a768c9b355d4.png",
  "public/lovable-uploads/1ac90582-7584-47b2-80a5-7398975ad2ce.png",
  "public/lovable-uploads/eb2d15d6-23ca-4364-9fa7-1165619a4900.png"
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
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="section-heading mx-auto">Our Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Witness the elegance and creativity of our catering setups through these glimpses of our past events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-md cursor-pointer hover:shadow-lg transition-all duration-300 group relative"
              onClick={() => openImage(image, index)}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-bhagwati-gold/0 group-hover:bg-bhagwati-gold/20 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-medium">View</span>
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
                <ChevronLeft className="text-bhagwati-maroon" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <ChevronRight className="text-bhagwati-maroon" />
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-10 text-center">
          <Button className="bg-bhagwati-maroon hover:bg-bhagwati-maroon/90 text-white">
            View More Images
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
