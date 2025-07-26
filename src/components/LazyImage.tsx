import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded && !hasError) {
          const imageElement = new Image();
          
          imageElement.onload = () => {
            setIsLoaded(true);
            onLoad?.();
          };
          
          imageElement.onerror = () => {
            setHasError(true);
            onError?.();
          };
          
          imageElement.src = src;
          observer.unobserve(img);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);

    return () => {
      observer.unobserve(img);
    };
  }, [src, isLoaded, hasError, onLoad, onError]);

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {!isLoaded && !hasError && (
        <div 
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse',
            placeholderClassName
          )}
        />
      )}
      
      {isLoaded && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
      
      {hasError && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500',
          placeholderClassName
        )}>
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};