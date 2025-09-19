import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";

const questions = [
  { id: 1, question: "What is the morse code for the letter 'A'?", answer: ".-" },
  { id: 2, question: "What is the morse code for the letter 'S'?", answer: "..." },
  { id: 3, question: "What is the morse code for the letter 'O'?", answer: "---" },
  { id: 4, question: "What is the morse code for 'SOS'?", answer: "...---..." },
  { id: 5, question: "What is the morse code for the number '1'?", answer: ".----" }
];

const Results = () => {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const answers = localStorage.getItem("competitionAnswers");
    if (!answers) {
      navigate("/competition");
      return;
    }

    const parsedAnswers = JSON.parse(answers);
    setUserAnswers(parsedAnswers);

    // Calculate score
    let correctAnswers = 0;
    parsedAnswers.forEach((answer: string, index: number) => {
      if (answer === questions[index].answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  }, [navigate]);

  const handleRetakeCompetition = () => {
    localStorage.removeItem("competitionAnswers");
    navigate("/competition");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("competitionAnswers");
    navigate("/");
  };

  const scorePercentage = (score / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="terminal-border mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-primary morse-glow" />
              </div>
              <CardTitle className="text-3xl font-display text-primary">
                Competition Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-mono text-primary morse-glow">
                {score}/{questions.length}
              </div>
              <div className="text-xl text-muted-foreground">
                Score: {scorePercentage.toFixed(0)}%
              </div>
              <Badge 
                variant={scorePercentage >= 80 ? "default" : scorePercentage >= 60 ? "secondary" : "destructive"}
                className="text-lg px-4 py-2 font-mono"
              >
                {scorePercentage >= 80 ? "EXCELLENT" : scorePercentage >= 60 ? "GOOD" : "NEEDS IMPROVEMENT"}
              </Badge>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Detailed Results
            </h2>
            
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.answer;
              
              return (
                <Card key={question.id} className="terminal-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-display">
                        Question {question.id}
                      </CardTitle>
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="font-mono text-muted-foreground">
                      {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          Your Answer:
                        </span>
                        <div className={`font-mono text-lg p-2 rounded ${
                          isCorrect ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10'
                        }`}>
                          {userAnswer || "No answer"}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">
                          Correct Answer:
                        </span>
                        <div className="font-mono text-lg p-2 rounded text-primary bg-primary/10">
                          {question.answer}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRetakeCompetition}
              size="lg"
              className="font-mono morse-glow"
            >
              RETAKE COMPETITION
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="font-mono terminal-border"
            >
              LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;