import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithGoogle, user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/competition");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 font-display morse-glow">
            MORSE CODE
          </h1>
          <p className="text-2xl text-primary font-mono">
            ... --- ... 
          </p>
          <p className="text-muted-foreground mt-4">
            Online Competition Platform
          </p>
        </div>

        <Card className="terminal-border">
          <CardHeader className="text-center">
            <CardTitle className="text-primary font-display">Access Terminal</CardTitle>
            <CardDescription>
              Enter your credentials to join the competition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center text-muted-foreground">
                Sign in with your Google account to join the competition
              </div>
              
              <Button 
                onClick={handleGoogleLogin}
                className="w-full morse-glow hover:morse-glow font-mono font-semibold"
                size="lg"
              >
                🚀 CONNECT WITH GOOGLE
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-muted-foreground text-sm">
          <p>Competition Status: <span className="text-primary">ACTIVE</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;