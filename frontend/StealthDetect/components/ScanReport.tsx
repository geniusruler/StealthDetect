import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { FileDown, ArrowLeft, Clock, Activity, AlertTriangle, Shield, Home, BarChart3, Menu, X } from "lucide-react";

interface ScanReportProps {
  onNavigate: (screen: "main-dashboard" | "home") => void;
}

export function ScanReport({ onNavigate }: ScanReportProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBackToDashboard = () => {
    onNavigate("main-dashboard");
  };

  const handleExport = () => {
    // Handle export functionality
    console.log("Exporting report...");
  };

  const findings = [
    {
      severity: "High",
      type: "Domain",
      indicator: "bad.example",
      action: "Detected"
    },
    {
      severity: "Medium", 
      type: "IP",
      indicator: "203.0.113.42",
      action: "Monitored"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">{severity}</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{severity}</Badge>;
      case 'low':
        return <Badge variant="secondary">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'detected':
        return <Badge variant="destructive">{action}</Badge>;
      case 'monitored':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{action}</Badge>;
      case 'allowed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{action}</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex relative">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:sticky top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border 
        flex flex-col z-50 transition-transform duration-300 ease-in-out
      `}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-sidebar-primary" />
              <h2 className="font-medium text-sidebar-foreground">StealthDetect</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => {
                onNavigate("home");
                setSidebarOpen(false);
              }}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                handleBackToDashboard();
                setSidebarOpen(false);
              }}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                handleExport();
                setSidebarOpen(false);
              }}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <FileDown className="w-4 h-4" />
              Export
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground hover:bg-accent"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-medium text-foreground">Scan Report</h1>
          <div className="w-9" />
        </div>

        <div className="h-full overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header - Hidden on mobile since it's in the mobile header */}
            <div className="mb-6 md:mb-8 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <h1 className="text-2xl md:text-3xl font-medium text-foreground">Scan Report</h1>
              </div>
              <p className="text-muted-foreground">Completed at 10:07</p>
            </div>

            {/* Summary Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Duration</p>
                      <p className="text-sm md:text-lg font-medium">02:35</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Flows analyzed</p>
                      <p className="text-sm md:text-lg font-medium">1,284</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Findings</p>
                      <p className="text-sm md:text-lg font-medium">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Actions taken</p>
                      <p className="text-sm md:text-lg font-medium">2 detected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Findings Table */}
            <Card className="mb-6 md:mb-8">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Findings</CardTitle>
              </CardHeader>
              <CardContent>
                {findings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Severity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Indicator</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {findings.map((finding, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {getSeverityBadge(finding.severity)}
                            </TableCell>
                            <TableCell>{finding.type}</TableCell>
                            <TableCell className="font-mono text-sm">{finding.indicator}</TableCell>
                            <TableCell>
                              {getActionBadge(finding.action)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Threats Detected</h3>
                    <p className="text-muted-foreground">
                      Your device appears to be clean. No malicious network activity was found during this scan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Network Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">DNS Queries</span>
                      <span className="text-sm font-medium">847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HTTPS Connections</span>
                      <span className="text-sm font-medium">423</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unique Domains</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Suspicious Patterns</span>
                      <span className="text-sm font-medium text-orange-600">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Protection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Real-time monitoring active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">DNS filtering enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Threat database up to date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-sm">2 threats detected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}