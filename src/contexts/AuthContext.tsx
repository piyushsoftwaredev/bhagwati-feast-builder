
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserSession } from '@/lib/supabase';

type AuthContextType = {
  session: UserSession | null;
  isLoading: boolean;
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

  useEffect(() => {
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
  }, []);

  const signIn = async (email: string, password: string) => {
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
