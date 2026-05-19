"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bug,
  Shield,
  Zap,
  Lightbulb,
  Code2,
  FileText,
  Download,
  Share2,
  Copy,
  Bookmark,
  BookmarkCheck,
  CheckCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ReviewResult, ReviewIssue, Severity, ReviewTab } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Loading editor...</div>,
});

const DiffViewerComp = dynamic(
  () => import("react-diff-viewer-continued").then((m) => m.default),
  { ssr: false, loading: () => <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Loading diff...</div> }
);

interface ReviewOutputProps {
  result: ReviewResult;
}

const severityConfig: Record<Severity, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "CRITICAL" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "HIGH" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "MEDIUM" },
  low: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "LOW" },
  info: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "INFO" },
};

const scoreColor = (score: number) => {
  if (score >= 80) return { text: "text-green-400", ring: "stroke-green-400", label: "Excellent" };
  if (score >= 60) return { text: "text-yellow-400", ring: "stroke-yellow-400", label: "Fair" };
  if (score >= 40) return { text: "text-orange-400", ring: "stroke-orange-400", label: "Poor" };
  return { text: "text-red-400", ring: "stroke-red-400", label: "Critical" };
};

function IssueCard({ issue }: { issue: ReviewIssue }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = severityConfig[issue.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
    >
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <Badge
          variant="outline"
          className={`shrink-0 text-xs px-2 py-0 ${cfg.color} ${cfg.border}`}
        >
          {cfg.label}
        </Badge>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{issue.title}</div>
          {issue.line && (
            <div className="text-xs text-muted-foreground mt-0.5">Line {issue.line}{issue.endLine && issue.endLine !== issue.line ? `–${issue.endLine}` : ""}</div>
          )}
        </div>
        <span className={`text-xs text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="px-4 pb-4 space-y-3 border-t border-white/5"
        >
          <p className="text-sm text-muted-foreground mt-3">{issue.message}</p>
          {issue.codeSnippet && (
            <pre className="text-xs bg-black/30 rounded-lg p-3 font-mono overflow-x-auto scrollbar-thin text-red-300">
              {issue.codeSnippet}
            </pre>
          )}
          {issue.fix && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
              <div className="text-xs font-semibold text-green-400 mb-1">💡 Fix:</div>
              <p className="text-xs text-muted-foreground">{issue.fix}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function IssueList({ issues, emptyLabel }: { issues: ReviewIssue[]; emptyLabel: string }) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
          <CheckCheck className="w-6 h-6 text-green-400" />
        </div>
        <p className="font-medium text-foreground">No {emptyLabel} found!</p>
        <p className="text-sm mt-1">Your code passed this check.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

export function ReviewOutput({ result }: ReviewOutputProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("summary");
  const [copiedRefactored, setCopiedRefactored] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toggleSaveReview } = useAppStore();

  const sc = scoreColor(result.score);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  const copyRefactored = useCallback(async () => {
    if (result.refactoredCode) {
      await navigator.clipboard.writeText(result.refactoredCode);
      setCopiedRefactored(true);
      setTimeout(() => setCopiedRefactored(false), 2000);
      toast.success("Refactored code copied!");
    }
  }, [result.refactoredCode]);

  const exportPDF = useCallback(async () => {
    toast.info("Generating PDF report...");
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text("CodeReview AI Report", 20, 20);
      doc.setFontSize(12);
      doc.text(`Language: ${result.language}`, 20, 35);
      doc.text(`AI Score: ${result.score}/100`, 20, 45);
      doc.text(`Date: ${new Date(result.createdAt).toLocaleString()}`, 20, 55);
      doc.text(`Lines of Code: ${result.metrics.linesOfCode}`, 20, 65);
      
      doc.setFontSize(14);
      doc.text("Summary", 20, 80);
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(result.summary, 170);
      doc.text(summaryLines, 20, 90);
      
      let yPos = 90 + summaryLines.length * 7 + 10;
      
      if (result.bugs.length > 0) {
        doc.setFontSize(14);
        doc.text(`Bugs (${result.bugs.length})`, 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        result.bugs.slice(0, 5).forEach((bug) => {
          if (yPos > 270) { doc.addPage(); yPos = 20; }
          doc.text(`• [${bug.severity.toUpperCase()}] ${bug.title}`, 20, yPos);
          yPos += 7;
          const msgLines = doc.splitTextToSize(`  ${bug.message}`, 170);
          doc.text(msgLines, 20, yPos);
          yPos += msgLines.length * 5 + 5;
        });
      }

      doc.save(`codereview-report-${Date.now()}.pdf`);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("PDF generation failed");
    }
  }, [result]);

  const tabs = [
    { id: "summary", label: "Summary", icon: FileText, count: null },
    { id: "bugs", label: "Bugs", icon: Bug, count: result.bugs.length },
    { id: "security", label: "Security", icon: Shield, count: result.security.length },
    { id: "performance", label: "Performance", icon: Zap, count: result.performance.length },
    { id: "suggestions", label: "Suggestions", icon: Lightbulb, count: result.suggestions.length },
    { id: "refactored", label: "Refactored", icon: Code2, count: null },
  ] as const;

  return (
    <Card className="glass border-white/10 flex flex-col h-full min-h-[600px]">
      {/* Header with Score */}
      <div className="p-4 border-b border-white/10 flex items-center gap-4">
        {/* SVG Score Ring */}
        <div className="relative shrink-0">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={sc.ring}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${sc.text}`}>{result.score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${sc.text}`}>{sc.label} Code</span>
            <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">
              {result.language}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span>🔴 Critical: {result.metrics.criticalCount}</span>
            <span>🟠 High: {result.metrics.highCount}</span>
            <span>🟡 Medium: {result.metrics.mediumCount}</span>
            <span>📄 Lines: {result.metrics.linesOfCode}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/5"
            onClick={() => { setIsSaved(!isSaved); toast.success(isSaved ? "Unsaved" : "Saved!"); }}
            aria-label="Save review"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-blue-400" /> : <Bookmark className="w-4 h-4" />}
          </Button>
          <Button
            id="export-pdf"
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/5"
            onClick={exportPDF}
            aria-label="Export PDF"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/5"
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            aria-label="Share review"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReviewTab)} className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-white/10 px-2 pt-2 shrink-0 overflow-x-auto">
          <TabsList className="bg-transparent gap-0 h-auto flex flex-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                id={`review-tab-${tab.id}`}
                className="h-9 px-3 text-xs font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent whitespace-nowrap"
              >
                <tab.icon className="w-3.5 h-3.5 mr-1.5" />
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <Badge
                    className={`ml-1.5 text-xs px-1.5 py-0 ${
                      tab.id === "bugs" && result.metrics.criticalCount > 0
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : tab.id === "security"
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        : "bg-white/10 text-muted-foreground border-white/10"
                    }`}
                  >
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="summary" className="mt-0 space-y-4">
              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
                <h3 className="font-medium mb-2 text-sm">AI Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
                <h3 className="font-medium mb-3 text-sm">Complexity Analysis</h3>
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      result.complexity.level === "low" ? "text-green-400 border-green-500/30" :
                      result.complexity.level === "medium" ? "text-yellow-400 border-yellow-500/30" :
                      "text-red-400 border-red-500/30"
                    }`}
                  >
                    {result.complexity.level} complexity
                  </Badge>
                  <span className="text-sm text-muted-foreground">Score: {result.complexity.score}/100</span>
                </div>
                <p className="text-sm text-muted-foreground">{result.complexity.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Lines of Code", value: result.metrics.linesOfCode, icon: "📄" },
                  { label: "Total Issues", value: result.metrics.issueCount, icon: "⚠️" },
                  { label: "Critical", value: result.metrics.criticalCount, icon: "🔴" },
                  { label: "High Priority", value: result.metrics.highCount, icon: "🟠" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="rounded-xl bg-white/[0.03] border border-white/8 p-3 text-center">
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bugs" className="mt-0">
              <IssueList issues={result.bugs} emptyLabel="bugs" />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <IssueList issues={result.security} emptyLabel="security vulnerabilities" />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <IssueList issues={result.performance} emptyLabel="performance issues" />
            </TabsContent>

            <TabsContent value="suggestions" className="mt-0">
              <IssueList issues={result.suggestions} emptyLabel="suggestions" />
            </TabsContent>

            <TabsContent value="refactored" className="mt-0 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">AI-Refactored Code</h3>
                <Button
                  id="copy-refactored"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={copyRefactored}
                >
                  {copiedRefactored ? (
                    <><CheckCheck className="w-3 h-3 text-green-400" /> Copied!</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy Code</>
                  )}
                </Button>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10 h-80">
                <MonacoEditor
                  height="320px"
                  language={result.language}
                  value={result.refactoredCode || ""}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 12,
                    fontFamily: "'Geist Mono', monospace",
                    wordWrap: "on",
                    padding: { top: 8 },
                  }}
                />
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-3">Diff View</h4>
                <div className="rounded-xl overflow-hidden border border-white/10 text-xs">
                  <DiffViewerComp
                    oldValue={result.originalCode}
                    newValue={result.refactoredCode || ""}
                    splitView={false}
                    useDarkTheme={true}
                    hideLineNumbers={false}
                    styles={{
                      variables: {
                        dark: {
                          diffViewerBackground: "oklch(0.12 0.018 260)",
                          addedBackground: "oklch(0.20 0.05 160 / 50%)",
                          removedBackground: "oklch(0.20 0.05 22 / 50%)",
                          wordAddedBackground: "oklch(0.28 0.07 160 / 60%)",
                          wordRemovedBackground: "oklch(0.28 0.07 22 / 60%)",
                          diffViewerColor: "oklch(0.80 0.005 260)",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
