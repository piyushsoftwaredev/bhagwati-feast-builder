
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if already logged in
  useEffect(() => {
    if (session && session.user) {
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [session, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    // Set a timeout to avoid the UI being stuck in loading state
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setErrorMessage("Login is taking too long. Please try again.");
        sonnerToast.error("Login timed out. Please try again.");
      }
    }, 10000); // 10 seconds timeout
    
    try {
      console.log('Attempting login with:', email);
      const { error, success } = await signIn(email, password);
      
      clearTimeout(timeout); // Clear timeout on success/error
      
      if (error) {
        console.error("Authentication error:", error);
        setErrorMessage(error.message || "Invalid email or password");
        toast({
          title: "Authentication Failed",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          duration: 3000,
        });
        sonnerToast.success("Login successful!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      clearTimeout(timeout); // Clear timeout on exception
      console.error("Unexpected error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      toast({
        title: "Something went wrong",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demo/development - provide default login
  const fillDefaultCredentials = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 jali-bg opacity-10 z-0"></div>
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <a href="/" className="flex items-center justify-center">
            <span className="text-bhagwati-maroon font-bold text-xl">Shree</span>
            <span className="text-bhagwati-gold font-bold text-2xl mx-1">BHAGWATI</span>
            <span className="text-bhagwati-maroon font-bold text-xl">Caterers</span>
          </a>
        </div>
        
        <Card className="border-bhagwati-gold/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-bhagwati-maroon">Sign in</CardTitle>
            <CardDescription className="text-center">Enter your email and password to access the admin dashboard</CardDescription>
          </CardHeader>
          
          {errorMessage && (
            <div className="px-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 mt-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-bhagwati-maroon hover:bg-bhagwati-maroon/90" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : "Sign in"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full text-sm" 
                onClick={fillDefaultCredentials}
              >
                Use Demo Login
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>For demo access, use the credentials above.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
