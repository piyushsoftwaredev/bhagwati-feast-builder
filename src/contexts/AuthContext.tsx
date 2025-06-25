
import { createContext, useContext, useState } from 'react';
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
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Demo login attempt with:', email);
      
      // Demo login for static site
      if (email === 'demo@example.com' && password === 'demo123') {
        console.log('Using demo login');
        
        const demoUser = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          role: 'admin',
        };
        
        setSession({
          user: demoUser,
          isAdmin: true,
        });
        
        sonnerToast.success('Demo login successful');
        return { error: null, success: true };
      }
      
      sonnerToast.error('Invalid credentials. Use demo@example.com / demo123');
      return { error: { message: 'Invalid credentials' }, success: false };
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
