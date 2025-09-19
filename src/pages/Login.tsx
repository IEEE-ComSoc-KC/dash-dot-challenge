import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithPassword, signUpWithPassword, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/competition");
    }
  }, [user, navigate]);

  const handleAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && !name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter your name to create an account.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignUp) {
        const result = await signUpWithPassword(email, password, name.trim());
        if (result.needsConfirmation) {
          toast({
            title: "Account Created Successfully",
            description: "Please check your email and click the confirmation link to complete your registration. Then you can sign in with your credentials.",
            duration: 8000,
          });
          // Switch to sign-in mode after successful signup
          setIsSignUp(false);
        } else {
          toast({
            title: "Account Created",
            description: "Your account has been created successfully.",
          });
        }
      } else {
        await signInWithPassword(email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (isSignUp) {
        errorMessage = "Failed to create account. Please try again.";
      } else {
        // Handle specific sign-in errors
        if (error.message?.includes('confirmation')) {
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        } else if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else {
          errorMessage = "Unable to sign in. Please check your email and password.";
        }
      }
      
      toast({
        title: isSignUp ? "Sign Up Failed" : "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
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
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2 font-display morse-glow">
            MORSE CODE
          </h1>
          <p className="text-xl sm:text-2xl text-primary font-mono">
            ... --- ... 
          </p>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Online Competition Platform
          </p>
        </div>

        <Card className="terminal-border">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-primary font-display text-lg sm:text-xl">
              Access Terminal
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isSignUp 
                ? "Enter your name, email and password to create an account" 
                : "Enter your email and password to join the competition"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary font-mono text-sm sm:text-base">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="terminal-border font-mono text-sm sm:text-base"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary font-mono text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="terminal-border font-mono text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary font-mono text-sm sm:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="terminal-border font-mono text-sm sm:text-base"
                />
              </div>
              
              <Button 
                onClick={handleAuth}
                className="w-full morse-glow hover:morse-glow font-mono font-semibold text-sm sm:text-base"
                size="lg"
              >
                {isSignUp ? "🚀 CREATE ACCOUNT" : "🔑 ACCESS SYSTEM"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setName(""); // Clear name when switching modes
                  }}
                  className="text-muted-foreground hover:text-primary font-mono text-xs sm:text-sm underline"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in" 
                    : "Need an account? Sign up"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4 sm:mt-6 text-muted-foreground text-xs sm:text-sm">
          <p>Competition Status: <span className="text-primary">ACTIVE</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;