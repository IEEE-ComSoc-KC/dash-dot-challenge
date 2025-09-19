import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

interface Question {
  id: string;
  question_number: number;
  question_text: string;
  correct_answer: string;
}

const Competition = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [morseInput, setMorseInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadQuestions();
  }, [user, navigate]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("question_number");

      if (error) throw error;
      
      setQuestions(data || []);
      setQuestionStartTime(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    }
  };

  const addDot = () => {
    setMorseInput(prev => prev + ".");
  };

  const addDash = () => {
    setMorseInput(prev => prev + "-");
  };

  const clearInput = () => {
    setMorseInput("");
  };

  const handleSubmit = async () => {
    if (!morseInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a morse code answer",
        variant: "destructive",
      });
      return;
    }

    if (!questionStartTime || !user) return;

    const currentQuestion = questions[currentQuestionIndex];
    const endTime = new Date();
    const timeTakenSeconds = Math.floor((endTime.getTime() - questionStartTime.getTime()) / 1000);
    const isCorrect = morseInput === currentQuestion.correct_answer;

    try {
      const { error } = await supabase
        .from("user_answers")
        .insert({
          user_id: user.id,
          question_id: currentQuestion.id,
          user_answer: morseInput,
          is_correct: isCorrect,
          time_taken_seconds: timeTakenSeconds,
        });

      if (error) throw error;

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setMorseInput("");
        setQuestionStartTime(new Date());
        toast({
          title: "Answer Submitted",
          description: `Question ${currentQuestionIndex + 1} completed`,
        });
      } else {
        // Competition finished
        navigate("/results");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-primary font-mono">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-primary font-mono">No questions available</div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary font-mono">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-muted-foreground font-mono">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="terminal-border mb-8">
            <CardHeader>
              <CardTitle className="text-primary font-display text-xl">
                Question #{currentQuestion.question_number}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-mono leading-relaxed">
                {currentQuestion.question_text}
              </p>
            </CardContent>
          </Card>

          {/* Morse Input Section */}
          <Card className="terminal-border">
            <CardHeader>
              <CardTitle className="text-primary font-display">
                Morse Code Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display Input */}
              <div className="p-4 bg-muted rounded-lg border terminal-border">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground block mb-2">
                    YOUR MORSE CODE
                  </span>
                  <div className="text-3xl font-mono text-morse-glow min-h-[40px] flex items-center justify-center">
                    {morseInput || "..."}
                  </div>
                </div>
              </div>

              {/* Input Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={addDot}
                  size="lg"
                  variant="outline"
                  className="h-16 text-2xl font-mono terminal-border hover:bg-morse-dot hover:text-background"
                >
                  •
                  <span className="ml-2 text-sm">DOT</span>
                </Button>
                <Button
                  onClick={addDash}
                  size="lg"
                  variant="outline"
                  className="h-16 text-2xl font-mono terminal-border hover:bg-morse-dash hover:text-background"
                >
                  ─
                  <span className="ml-2 text-sm">DASH</span>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={clearInput}
                  variant="destructive"
                  className="flex-1 font-mono"
                  disabled={!morseInput}
                >
                  CLEAR
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 font-mono morse-glow"
                  disabled={!morseInput}
                >
                  SUBMIT
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Competition;