
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Booking = lazy(() => import("./pages/Booking"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create QueryClient instance with caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhagwati-gold mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhagwati-gold mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session || !session.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhagwati-gold mx-auto"></div>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // Initialize theme from local storage or database
  useEffect(() => {
    // Load theme settings (CSS variables) from localStorage if available
    const applyTheme = () => {
      try {
        const storedTheme = localStorage.getItem('theme-settings');
        if (storedTheme) {
          const theme = JSON.parse(storedTheme);
          
          // Apply theme variables
          const root = document.documentElement;
          if (theme.primaryColor) {
            root.style.setProperty('--color-primary', theme.primaryColor);
            root.style.setProperty('--bhagwati-maroon', theme.primaryColor);
          }
          
          if (theme.secondaryColor) {
            root.style.setProperty('--color-secondary', theme.secondaryColor);
            root.style.setProperty('--bhagwati-gold', theme.secondaryColor);
          }
          
          if (theme.fontFamily) {
            root.style.setProperty('--font-family', theme.fontFamily);
          }
          
          // Apply custom CSS if present
          if (theme.customCss) {
            let styleElement = document.getElementById('theme-custom-css');
            if (!styleElement) {
              styleElement = document.createElement('style');
              styleElement.id = 'theme-custom-css';
              document.head.appendChild(styleElement);
            }
            styleElement.textContent = theme.customCss;
          }
        }
      } catch (error) {
        console.error('Error applying theme from cache:', error);
      }
    };
    
    // Apply theme immediately
    applyTheme();
    
    // Set up error boundary for the entire app
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      // You could add more sophisticated error handling here
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/booking" element={<Booking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
