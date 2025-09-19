import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

interface UserAnswer {
  question_number: number;
  user_answer: string;
  is_correct: boolean;
  time_taken_seconds: number;
}

const Results = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadResults();
  }, [user, navigate]);

  const loadResults = async () => {
    try {
      const { data, error } = await supabase
        .from("user_answers")
        .select(`
          user_answer,
          is_correct,
          time_taken_seconds,
          questions!inner(question_number)
        `)
        .eq("user_id", user?.id)
        .order("questions(question_number)");

      if (error) throw error;

      const answers = data?.map((answer: any) => ({
        question_number: answer.questions.question_number,
        user_answer: answer.user_answer,
        is_correct: answer.is_correct,
        time_taken_seconds: answer.time_taken_seconds,
      })) || [];

      setUserAnswers(answers);
      
      const correctCount = answers.filter(a => a.is_correct).length;
      const totalTimeSeconds = answers.reduce((sum, a) => sum + a.time_taken_seconds, 0);
      
      setScore((correctCount / 5) * 100); // 5 total questions
      setTotalTime(totalTimeSeconds);
      setLoading(false);
    } catch (error) {
      console.error("Error loading results:", error);
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    try {
      // Delete previous answers
      await supabase
        .from("user_answers")
        .delete()
        .eq("user_id", user?.id);
      
      navigate("/competition");
    } catch (error) {
      console.error("Error clearing previous answers:", error);
      navigate("/competition");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-primary font-mono">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 font-display morse-glow">
              MISSION COMPLETE
            </h1>
            <p className="text-muted-foreground font-mono text-sm sm:text-base">
              Competition results transmitted
            </p>
          </div>

          {/* Score Card */}
          <Card className="terminal-border mb-6 sm:mb-8">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-primary font-display text-lg sm:text-xl">
                FINAL SCORE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl sm:text-6xl font-bold text-morse-glow font-mono">
                  {Math.round(score)}%
                </div>
                <div className="text-lg sm:text-xl text-primary font-mono">
                  ACCURACY RATING
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-mono mb-2">
                  Total Time: {totalTime}s
                </div>
                <Progress value={score} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Answer Summary */}
          <Card className="terminal-border mb-6 sm:mb-8">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-primary font-display text-lg sm:text-xl">
                TRANSMISSION LOG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userAnswers.map((answer) => (
                  <div key={answer.question_number} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-muted/50 rounded terminal-border space-y-1 sm:space-y-0">
                    <span className="font-mono text-primary text-sm sm:text-base">
                      Q{answer.question_number}:
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="font-mono text-morse-glow text-sm sm:text-base break-all">
                        {answer.user_answer}
                      </span>
                      <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
                        <span className={`px-2 py-1 rounded ${answer.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {answer.is_correct ? '✓' : '✗'}
                        </span>
                        <span className="text-muted-foreground">
                          {answer.time_taken_seconds}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleRetry}
              className="font-mono morse-glow text-sm sm:text-base px-6 sm:px-8"
              size="lg"
            >
              RETRY MISSION
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;