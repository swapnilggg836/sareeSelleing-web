
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';

const AuthPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-playfair text-4xl font-bold text-crimson-700 mb-2">
            Dwarkadish
          </h1>
          <p className="text-gray-600">
            Experience the elegance of traditional Pithani sarees
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <img 
            src="https://images.unsplash.com/photo-1610292253303-c793cf0a4a0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Traditional Saree" 
            className="mx-auto rounded-lg shadow-lg max-w-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
