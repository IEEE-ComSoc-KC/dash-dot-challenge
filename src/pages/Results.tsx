import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

interface UserAnswer {
  question_number: number;
  user_answer: string;
  is_correct: boolean;
  timestamp: number;
}

interface UserProgress {
  currentQuestionIndex: number;
  answers: { [questionId: number]: { answer: string; isCorrect: boolean; timestamp: number } };
  completedQuestions: number[];
}

// Question data for displaying results
const QUESTIONS = [
  { id: 1, question_number: 1, text: "Bitrate" },
  { id: 2, question_number: 2, text: "Encryption" },
  { id: 3, question_number: 3, text: "Synchronous" },
  { id: 4, question_number: 4, text: "Redundancy" },
  { id: 5, question_number: 5, text: "Cryptotelephony" }
];

const Results = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const getUserProgressKey = () => `morse_competition_progress_${user?.id || 'anonymous'}`;

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadResults();
  }, [user, navigate]);

  const loadResults = () => {
    try {
      const saved = localStorage.getItem(getUserProgressKey());
      if (!saved) {
        // No data found, redirect to competition
        navigate("/competition");
        return;
      }

      const progress: UserProgress = JSON.parse(saved);
      const answers: UserAnswer[] = [];

      // Convert stored answers to display format
      QUESTIONS.forEach(question => {
        const answer = progress.answers[question.id];
        if (answer) {
          answers.push({
            question_number: question.question_number,
            user_answer: answer.answer,
            is_correct: answer.isCorrect,
            timestamp: answer.timestamp
          });
        }
      });

      setUserAnswers(answers);
      
      const correctCount = answers.filter(a => a.is_correct).length;
      setScore((correctCount / QUESTIONS.length) * 100);
      
      // Calculate total time based on timestamps
      if (answers.length > 1) {
        const firstTimestamp = Math.min(...answers.map(a => a.timestamp));
        const lastTimestamp = Math.max(...answers.map(a => a.timestamp));
        const totalTimeSeconds = Math.floor((lastTimestamp - firstTimestamp) / 1000);
        setTotalTime(totalTimeSeconds);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading results:", error);
      navigate("/competition");
    }
  };

  const handleRetry = () => {
    // Clear localStorage data
    localStorage.removeItem(getUserProgressKey());
    navigate("/competition");
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
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
                  Questions Completed: {userAnswers.length} / {QUESTIONS.length}
                </div>
                {totalTime > 0 && (
                  <div className="text-xs sm:text-sm text-muted-foreground font-mono mb-2">
                    Total Time: {totalTime}s
                  </div>
                )}
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
                {QUESTIONS.map((question) => {
                  const answer = userAnswers.find(a => a.question_number === question.question_number);
                  return (
                    <div key={question.question_number} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-muted/50 rounded terminal-border space-y-1 sm:space-y-0">
                      <span className="font-mono text-primary text-sm sm:text-base">
                        Q{question.question_number} ({question.text}):
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                        {answer ? (
                          <>
                            <span className="font-mono text-morse-glow text-sm sm:text-base break-all">
                              {answer.user_answer}
                            </span>
                            <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
                              <span className={`px-2 py-1 rounded ${answer.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {answer.is_correct ? '✓' : '✗'}
                              </span>
                              <span className="text-muted-foreground">
                                {formatTime(answer.timestamp)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Not attempted
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Analysis */}
          {userAnswers.length > 0 && (
            <Card className="terminal-border mb-6 sm:mb-8">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-primary font-display text-lg sm:text-xl">
                  PERFORMANCE ANALYSIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400 font-mono">
                      {userAnswers.filter(a => a.is_correct).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400 font-mono">
                      {userAnswers.filter(a => !a.is_correct).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Incorrect</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleRetry}
              className="font-mono morse-glow text-sm sm:text-base px-6 sm:px-8"
              size="lg"
            >
              RETRY MISSION
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="font-mono text-sm sm:text-base px-6 sm:px-8"
              size="lg"
            >
              MAIN MENU
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;