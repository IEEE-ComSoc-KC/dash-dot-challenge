import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // First, check if there are confirmation parameters in the URL
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token_hash && type) {
        try {
          // Instead of manually verifying OTP, let's verify using the token_hash
          // This is the proper way to handle email confirmation links
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('Confirmation error:', error);
            setError(error.message);
            toast({
              title: "Confirmation Failed",
              description: "The confirmation link is invalid or has expired. Please try signing up again.",
              variant: "destructive",
            });
          } else if (data.session) {
            // If we get a session, the user is confirmed and logged in
            setConfirmed(true);
            toast({
              title: "Email Confirmed!",
              description: "Your email has been confirmed successfully. Redirecting to competition...",
            });
            
            // Redirect to competition after a short delay
            setTimeout(() => {
              navigate("/competition");
            }, 2000);
          }
        } catch (error) {
          console.error('Unexpected error during confirmation:', error);
          setError("An unexpected error occurred during confirmation.");
          toast({
            title: "Confirmation Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // If no confirmation parameters, check if user is already logged in
        // This handles the case where the session was already created
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          setConfirmed(true);
          toast({
            title: "Already Confirmed!",
            description: "Your email is already confirmed. Redirecting to competition...",
          });
          
          // Redirect to competition after a short delay
          setTimeout(() => {
            navigate("/competition");
          }, 2000);
        } else {
          setError("Invalid confirmation link.");
          toast({
            title: "Invalid Link",
            description: "This confirmation link appears to be invalid.",
            variant: "destructive",
          });
        }
      }

      setLoading(false);
    };

    // Only run the confirmation logic if we're not still loading auth state
    if (!authLoading) {
      handleEmailConfirmation();
    }
  }, [searchParams, toast, navigate, authLoading]);

  // If user is already authenticated, redirect them to competition
  useEffect(() => {
    if (user && !loading) {
      setConfirmed(true);
      toast({
        title: "Already Authenticated!",
        description: "You are already logged in. Redirecting to competition...",
      });
      
      setTimeout(() => {
        navigate("/competition");
      }, 1500);
    }
  }, [user, loading, navigate, toast]);

  const handleContinue = () => {
    if (confirmed) {
      navigate("/competition");
    } else {
      navigate("/");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-mono">Confirming your email...</div>
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
              {confirmed ? "Email Confirmed!" : "Confirmation Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {confirmed ? (
              <>
                <p className="text-muted-foreground font-mono text-sm sm:text-base leading-relaxed">
                  Your email has been successfully confirmed! You are now logged in and will be redirected to the competition shortly.
                </p>
                <Button 
                  onClick={handleContinue}
                  className="w-full morse-glow hover:morse-glow font-mono font-semibold text-sm sm:text-base"
                  size="lg"
                >
                  � ENTER COMPETITION
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground font-mono text-sm sm:text-base leading-relaxed">
                  {error || "There was a problem confirming your email. Please try signing up again or contact support if the problem persists."}
                </p>
                <Button 
                  onClick={handleContinue}
                  className="w-full morse-glow hover:morse-glow font-mono font-semibold text-sm sm:text-base"
                  size="lg"
                >
                  🔄 RETURN TO LOGIN
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Confirm;