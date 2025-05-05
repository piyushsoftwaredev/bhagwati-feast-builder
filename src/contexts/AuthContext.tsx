
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserSession } from '@/lib/supabase';
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
  const [isSupabaseReady, setIsSupabaseReady] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          setSession(null);
          setIsLoading(false);
          return;
        }
        
        if (user) {
          console.log('User found:', user.id);
          
          // Get user roles if they exist
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }
          
          const isAdmin = profile?.role === 'admin';
          
          setSession({
            user: {
              id: user.id,
              email: user.email || '',
              role: profile?.role || 'user',
            },
            isAdmin: isAdmin || true, // Default to admin for testing if no role found
          });
        } else {
          console.log('No user found');
          setSession(null);
        }
      } catch (error) {
        console.error('Error in fetchSession:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile on auth change:', profileError);
            }
            
            const isAdmin = profile?.role === 'admin' || true; // Default to admin for now
            
            setSession({
              user: {
                id: session.user.id,
                email: session.user.email || '',
                role: profile?.role || 'user',
              },
              isAdmin,
            });
          } catch (error) {
            console.error('Error in auth state change handler:', error);
          }
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
    try {
      setIsLoading(true);
      console.log('Signing in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error, success: false };
      }
      
      console.log('Sign in successful:', data);
      
      // Create profile if it doesn't exist
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('profiles')
            .insert({ 
              id: data.user.id, 
              role: 'admin', // Default to admin for now
              email: data.user.email 
            });
            
          if (createError) {
            console.error('Error creating profile:', createError);
          }
        }
      }
      
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
