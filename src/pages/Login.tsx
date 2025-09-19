import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    // Simulate login - in real app, this would make an API call
    localStorage.setItem("user", username);
    toast({
      title: "Login Successful",
      description: `Welcome, ${username}!`,
    });
    navigate("/competition");
  };

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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-primary">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="terminal-border font-mono"
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="terminal-border font-mono"
                  placeholder="Enter password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full morse-glow hover:morse-glow font-mono font-semibold"
                size="lg"
              >
                CONNECT
              </Button>
            </form>
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