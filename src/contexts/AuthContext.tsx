
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

type UserData = {
  id: string;
  email: string;
  role?: string;
};

type UserSession = {
  user: UserData | null;
  isAdmin: boolean;
};

type AuthContextType = {
  session: UserSession | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(true);
  const { toast } = useToast();

  // Initialize auth state with optimized session handling
  useEffect(() => {
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase auth
          setTimeout(() => {
            const userData = {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              role: 'admin', // Default to admin for demo
            };
            
            setSession({
              user: userData,
              isAdmin: true,
            });
            setIsLoading(false);
          }, 0);
        } else {
          setSession(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const checkExistingSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: 'admin', // Default to admin for demo
          };
          
          setSession({
            user: userData,
            isAdmin: true,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Signing in with:', email);
      
      // Always allow demo login for testing
      if (email === 'demo@example.com' && password === 'demo123') {
        console.log('Using demo login');
        
        // Set a demo session manually with a 30-min timeout
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          role: 'admin',
        };
        
        setSession({
          user: demoUser,
          isAdmin: true,
        });
        
        // Store demo session in localStorage for persistence
        localStorage.setItem('demoSession', JSON.stringify({
          user: demoUser,
          expires: Date.now() + (30 * 60 * 1000) // 30 minutes
        }));
        
        sonnerToast.success('Demo login successful');
        return { error: null, success: true };
      }
      
      // Try actual login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // If using demo-like credentials but in wrong format, suggest correct format
        if (email.toLowerCase().includes('demo') && password.includes('demo')) {
          sonnerToast.error('Did you mean to use demo@example.com / demo123?');
        }
        
        return { error, success: false };
      }
      
      console.log('Sign in successful:', data);
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error, success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out');
      
      // Clear demo session if exists
      localStorage.removeItem('demoSession');
      
      await supabase.auth.signOut();
      setSession(null);
      sonnerToast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      sonnerToast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    session,
    isLoading,
    isSupabaseReady,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
