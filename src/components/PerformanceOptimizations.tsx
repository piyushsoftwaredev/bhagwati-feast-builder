import { memo, lazy, Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
export const LazyGoogleReviews = lazy(() => import('./GoogleReviews'));
export const LazyGallery = lazy(() => import('./Gallery'));

// Loading skeletons for better UX
export const ReviewsSkeleton = memo(() => (
  <div className="py-20 bg-gradient-to-br from-white to-primary/5">
    <div className="content-container">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto mb-6" />
        <Skeleton className="h-16 w-80 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
));

export const GallerySkeleton = memo(() => (
  <div className="py-20">
    <div className="content-container">
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  </div>
));

// Performance wrapper for components
export const withPerformance = <T extends object>(
  Component: React.ComponentType<T>,
  SkeletonComponent: React.ComponentType
) => {
  return memo((props: T) => (
    <Suspense fallback={<SkeletonComponent />}>
      <Component {...props} />
    </Suspense>
  ));
};