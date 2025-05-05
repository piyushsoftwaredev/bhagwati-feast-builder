
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error, success } = await signIn(email, password);
      
      if (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Failed",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          duration: 3000,
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
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
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-bhagwati-maroon hover:bg-bhagwati-maroon/90" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
