
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserSession, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseConfigured = isSupabaseConfigured();
    setIsSupabaseReady(supabaseConfigured);
    
    if (!supabaseConfigured) {
      console.warn("Supabase is not properly configured. Some features may not work.");
      toast({
        title: "Supabase Connection Issue",
        description: "Backend services are not available. Please contact support.",
        variant: "destructive",
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user roles if they exist
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          const isAdmin = profile?.role === 'admin';
          
          setSession({
            user: {
              id: user.id,
              email: user.email || '',
              role: profile?.role || 'user',
            },
            isAdmin,
          });
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const isAdmin = profile?.role === 'admin';
          
          setSession({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              role: profile?.role || 'user',
            },
            isAdmin,
          });
        } else {
          setSession(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      return { 
        error: new Error("Backend services are not available"), 
        success: false 
      };
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error, success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseReady) return;

    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isSupabaseReady,
        signIn,
        signOut,
      }}
    >
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
