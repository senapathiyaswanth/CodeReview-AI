"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Play,
  Upload,
  FileCode,
  ChevronDown,
  Loader2,
  Sparkles,
  RotateCcw,
  Copy,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { ReviewResult, Language, LANGUAGE_CONFIG } from "@/types";
import { ReviewOutput } from "@/components/review/ReviewOutput";
import { DEMO_CODE } from "@/lib/demo-data";

// Dynamic import to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Loading editor...
    </div>
  ),
});

export default function ReviewPage() {
  const [code, setCode] = useState(DEMO_CODE.typescript);
  const [language, setLanguage] = useState<Language>("typescript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveReview } = useAppStore();

  const analyze = useCallback(async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze");
      return;
    }
    setIsAnalyzing(true);
    setReviewResult(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setReviewResult(data.result);
      toast.success("Code review complete!", {
        description: `AI Score: ${data.result.score}/100`,
      });

      // Auto-save to history
      saveReview({
        id: data.result.id,
        title: `${LANGUAGE_CONFIG[language].label} Review`,
        language,
        score: data.result.score,
        result: data.result,
        isSaved: false,
        tags: [language],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      toast.error("Review failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, language, saveReview]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);

      // Auto-detect language from extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      const extMap: Record<string, Language> = {
        ts: "typescript",
        tsx: "typescript",
        js: "javascript",
        jsx: "javascript",
        py: "python",
        java: "java",
        cpp: "cpp",
        cc: "cpp",
        c: "c",
        go: "go",
        rs: "rust",
        php: "php",
        html: "html",
        css: "css",
        sql: "sql",
        sh: "bash",
        json: "json",
        yaml: "yaml",
        yml: "yaml",
        md: "markdown",
      };
      if (ext && extMap[ext]) {
        setLanguage(extMap[ext]);
        toast.success(`Detected language: ${LANGUAGE_CONFIG[extMap[ext]].label}`);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleCopyCode = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(DEMO_CODE.typescript);
    setLanguage("typescript");
    setReviewResult(null);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Code Review
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Paste your code or upload a file to get an instant AI-powered review.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              id="review-reset"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="glass border-white/10 hover:bg-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
            <Button
              id="review-upload"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="glass border-white/10 hover:bg-white/5"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".ts,.tsx,.js,.jsx,.py,.java,.cpp,.c,.go,.rs,.php,.html,.css,.sql,.sh,.json,.yaml,.yml,.md"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>
        </div>

        <div className={`grid gap-6 ${reviewResult ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
          {/* Editor Panel */}
          <Card
            className={`glass border-white/10 overflow-hidden flex flex-col ${
              isDragging ? "border-blue-500/50 bg-blue-500/5" : ""
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {/* Editor Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger
                  id="language-select"
                  className="h-7 w-36 text-xs bg-white/5 border-white/10 ml-2"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  {(Object.entries(LANGUAGE_CONFIG) as [Language, typeof LANGUAGE_CONFIG[Language]][]).map(([key, cfg]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {code.split("\n").length} lines
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopyCode}
                  aria-label="Copy code"
                >
                  {copied ? (
                    <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="h-[500px] monaco-editor-container">
              {isDragging ? (
                <div className="flex items-center justify-center h-full gap-3 text-blue-400">
                  <FileCode className="w-8 h-8" />
                  <span className="text-lg font-medium">Drop your file here</span>
                </div>
              ) : (
                <MonacoEditor
                  height="100%"
                  language={LANGUAGE_CONFIG[language].monacoId}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'Geist Mono', 'Fira Code', monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    renderLineHighlight: "all",
                    cursorStyle: "line",
                    automaticLayout: true,
                    wordWrap: "on",
                    padding: { top: 12, bottom: 12 },
                    scrollbar: {
                      verticalScrollbarSize: 6,
                      horizontalScrollbarSize: 6,
                    },
                    tabSize: 2,
                    smoothScrolling: true,
                  }}
                />
              )}
            </div>

            {/* Analyze Button */}
            <div className="p-4 border-t border-white/10 shrink-0">
              <Button
                id="analyze-code-button"
                onClick={analyze}
                disabled={isAnalyzing || !code.trim()}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white border-0 shadow-lg shadow-blue-500/25 font-semibold text-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with GPT-4o...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Code
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3"
                >
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>AI analyzing your code...</span>
                    <span>GPT-4o</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["Scanning for bugs", "Checking security", "Analyzing performance", "Generating fixes"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Review Output */}
          <AnimatePresence>
            {reviewResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <ReviewOutput result={reviewResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!reviewResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-6 text-muted-foreground text-sm"
          >
            ✨ Your AI review results will appear here after analysis
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
