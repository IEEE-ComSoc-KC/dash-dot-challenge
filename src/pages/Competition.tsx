import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Hardcoded questions for demo
const questions = [
  {
    id: 1,
    question: "What is the morse code for the letter 'A'?",
    answer: ".-"
  },
  {
    id: 2,
    question: "What is the morse code for the letter 'S'?",
    answer: "..."
  },
  {
    id: 3,
    question: "What is the morse code for the letter 'O'?",
    answer: "---"
  },
  {
    id: 4,
    question: "What is the morse code for 'SOS'?",
    answer: "...---..."
  },
  {
    id: 5,
    question: "What is the morse code for the number '1'?",
    answer: ".----"
  }
];

const Competition = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [morseInput, setMorseInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addDot = () => {
    setMorseInput(prev => prev + ".");
  };

  const addDash = () => {
    setMorseInput(prev => prev + "-");
  };

  const clearInput = () => {
    setMorseInput("");
  };

  const handleSubmit = () => {
    if (!morseInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a morse code answer",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = [...answers, morseInput];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setMorseInput("");
      toast({
        title: "Answer Submitted",
        description: `Question ${currentQuestion + 1} completed`,
      });
    } else {
      // Competition finished
      localStorage.setItem("competitionAnswers", JSON.stringify(newAnswers));
      navigate("/results");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary font-mono">
                Question {currentQuestion + 1} of {questions.length}
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
                Question #{questions[currentQuestion].id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-mono leading-relaxed">
                {questions[currentQuestion].question}
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