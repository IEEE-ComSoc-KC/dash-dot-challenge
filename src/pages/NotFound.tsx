import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
            <CardTitle className="text-primary font-display text-6xl sm:text-8xl mb-4">
              404
            </CardTitle>
            <p className="text-muted-foreground font-mono text-lg sm:text-xl">
              TRANSMISSION NOT FOUND
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground font-mono text-sm sm:text-base leading-relaxed">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/">
              <Button 
                className="w-full morse-glow hover:morse-glow font-mono font-semibold text-sm sm:text-base"
                size="lg"
              >
                🏠 RETURN TO BASE
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
