import { useState } from "react";
import { User, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Hardcoded leaderboard data
const leaderboardData = [
  { rank: 1, username: "MorseExpert", score: 100, time: "2:34" },
  { rank: 2, username: "CodeMaster", score: 95, time: "3:12" },
  { rank: 3, username: "DitDahPro", score: 90, time: "2:56" },
  { rank: 4, username: "RadioOperator", score: 85, time: "4:23" },
  { rank: 5, username: "TelegraphKing", score: 80, time: "3:45" },
  { rank: 6, username: "SignalGenius", score: 75, time: "5:12" },
  { rank: 7, username: "WirelessWiz", score: 70, time: "4:34" },
  { rank: 8, username: "MorseNinja", score: 65, time: "6:23" },
  { rank: 9, username: "CodeBreaker", score: 60, time: "5:45" },
  { rank: 10, username: "DotDashLord", score: 55, time: "7:12" }
];

const Navbar = () => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const currentUser = localStorage.getItem("user") || "Anonymous";

  return (
    <nav className="border-b terminal-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-primary font-display">
              MORSE
            </div>
            <div className="text-primary font-mono text-sm">
              ... --- ...
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-mono">{currentUser}</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="pb-4">
          <Collapsible open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between terminal-border font-mono"
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>LEADERBOARD</span>
                </div>
                {isLeaderboardOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <Card className="terminal-border">
                <CardHeader>
                  <CardTitle className="text-primary font-display flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Top 10 Participants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboardData.map((participant) => (
                      <div
                        key={participant.rank}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border terminal-border"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold ${
                            participant.rank <= 3 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {participant.rank}
                          </div>
                          <span className="font-mono">{participant.username}</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="font-mono">{participant.score}%</span>
                          <span className="font-mono">{participant.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;