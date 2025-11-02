import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Radar, Pause, Square, Minimize2, CheckCircle, Circle, Clock } from "lucide-react";

interface ScanInProgressProps {
  onNavigate: (screen: "main-dashboard" | "scan-report" | "home") => void;
}

export function ScanInProgress({ onNavigate }: ScanInProgressProps) {
  const [progress, setProgress] = useState(0);
  const [flowsAnalyzed, setFlowsAnalyzed] = useState(0);
  const [domainsInspected, setDomainsInspected] = useState(0);
  const [findings, setFindings] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const phases = [
    "Capture packets",
    "Parse IP/TCP/UDP/DNS", 
    "Match Indicators",
    "Summarize findings"
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 5, 100);
        
        // Update metrics based on progress
        setFlowsAnalyzed(Math.floor(newProgress * 12.84));
        setDomainsInspected(Math.floor(newProgress * 8.5));
        setFindings(newProgress > 60 ? Math.floor(Math.random() * 3) : 0);
        
        // Update current phase
        const newPhase = Math.floor((newProgress / 100) * phases.length);
        setCurrentPhase(Math.min(newPhase, phases.length - 1));
        
        // Add log entries
        if (Math.random() > 0.7) {
          const time = new Date().toLocaleTimeString();
          const entries = [
            `[${time}] Captured new flow: TLS to example.com`,
            `[${time}] DNS A answer: api.service.com → 203.0.113.42`,
            `[${time}] Analyzing packet: TCP 443 → 192.168.1.100`,
            `[${time}] Domain lookup: cdn.example.org`,
            `[${time}] Flow inspection: HTTPS to secure.api.com`,
            `[${time}] DNS query intercepted: tracker.ads.com`
          ];
          
          setLogEntries(prev => [
            ...prev.slice(-10), // Keep only last 10 entries
            entries[Math.floor(Math.random() * entries.length)]
          ]);
        }

        // Auto-complete after reaching 100%
        if (newProgress >= 100) {
          setTimeout(() => {
            onNavigate("scan-report");
          }, 1500);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPaused, phases.length, onNavigate]);

  const handleStopAndView = () => {
    onNavigate("scan-report");
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleMinimize = () => {
    onNavigate("main-dashboard");
  };

  const getPhaseIcon = (index: number) => {
    if (index < currentPhase) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (index === currentPhase && progress < 100) {
      return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
    } else {
      return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Radar className="w-6 h-6 md:w-8 md:h-8 text-primary animate-spin" />
          <h1 className="text-2xl md:text-3xl font-medium text-foreground">Scanning...</h1>
        </div>
        <p className="text-muted-foreground">Analyzing network activity via on-device VPN</p>
      </div>

      {/* Progress Card */}
      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Scan Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="h-2 md:h-3" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Flows analyzed</p>
                <p className="text-lg md:text-xl font-medium">{flowsAnalyzed}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Domains inspected</p>
                <p className="text-lg md:text-xl font-medium">{domainsInspected}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Findings</p>
                <p className="text-lg md:text-xl font-medium">{findings}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Progress</p>
                <p className="text-lg md:text-xl font-medium">{Math.round(progress)}%</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              This may take 10 - 15 minutes.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Scan Phases Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Scan Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phases.map((phase, index) => (
                <div key={index} className="flex items-center gap-3">
                  {getPhaseIcon(index)}
                  <span className={`text-sm ${
                    index <= currentPhase ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {phase}
                  </span>
                  {index === currentPhase && progress < 100 && (
                    <Badge variant="secondary" className="ml-auto">Running</Badge>
                  )}
                  {index < currentPhase && (
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">Done</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Findings Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Findings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Malicious Domains</span>
                <Badge variant={findings > 0 ? "destructive" : "secondary"}>
                  {findings > 0 ? Math.floor(findings / 2) : 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Suspicious IPs</span>
                <Badge variant={findings > 1 ? "destructive" : "secondary"}>
                  {findings > 1 ? 1 : 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Detected IOCs</span>
                <Badge variant={findings > 0 ? "destructive" : "secondary"}>
                  {findings}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Log Card */}
      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Live Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32 md:h-48 w-full">
            <div className="space-y-1 font-mono text-xs">
              {logEntries.length === 0 ? (
                <p className="text-muted-foreground">Waiting for activity...</p>
              ) : (
                logEntries.map((entry, index) => (
                  <div key={index} className="text-foreground">
                    {entry}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
        <Button variant="outline" onClick={handlePause} className="flex-1 sm:flex-none">
          <Pause className="w-4 h-4 mr-2" />
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={handleStopAndView} className="flex-1 bg-primary text-primary-foreground">
          <Square className="w-4 h-4 mr-2" />
          Stop & View Report
        </Button>
        <Button variant="outline" onClick={handleMinimize} className="flex-1 sm:flex-none">
          <Minimize2 className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Engine: Real-time • Last event: {logEntries.length > 0 ? 'Just now' : '—'}
        </p>
      </div>
    </div>
  );
}