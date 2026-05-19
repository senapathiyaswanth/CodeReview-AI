// ============================================================
// All TypeScript types and interfaces for CodeReview AI
// ============================================================

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "c"
  | "go"
  | "rust"
  | "php"
  | "html"
  | "css"
  | "sql"
  | "bash"
  | "json"
  | "yaml"
  | "markdown";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type ReviewStatus = "idle" | "analyzing" | "streaming" | "complete" | "error";

// ── Review Issue Types ────────────────────────────────────────
export interface ReviewIssue {
  id: string;
  line?: number;
  endLine?: number;
  severity: Severity;
  title: string;
  message: string;
  fix?: string;
  codeSnippet?: string;
}

export interface ReviewResult {
  id: string;
  score: number;
  summary: string;
  language: Language;
  originalCode: string;
  refactoredCode?: string;
  bugs: ReviewIssue[];
  security: ReviewIssue[];
  performance: ReviewIssue[];
  suggestions: ReviewIssue[];
  complexity: {
    level: "low" | "medium" | "high" | "very-high";
    score: number;
    description: string;
  };
  metrics: {
    linesOfCode: number;
    issueCount: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
  createdAt: string;
  duration?: number; // ms
}

// ── Saved Review (persisted) ──────────────────────────────────
export interface SavedReview {
  id: string;
  title: string;
  language: Language;
  score: number;
  result: ReviewResult;
  isSaved: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Code Snippet ──────────────────────────────────────────────
export interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  language: Language;
  code: string;
  tags: string[];
  createdAt: string;
}

// ── Chat Message ──────────────────────────────────────────────
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  codeContext?: string;
  language?: Language;
  createdAt: string;
  updatedAt: string;
}

// ── User / Auth ───────────────────────────────────────────────
export interface UserSettings {
  theme: "dark" | "light" | "system";
  openaiApiKey?: string;
  defaultLanguage: Language;
  autoDetectLanguage: boolean;
  streamingEnabled: boolean;
  notifications: {
    reviewComplete: boolean;
    weeklyReport: boolean;
    tips: boolean;
  };
  editor: {
    fontSize: number;
    tabSize: number;
    minimap: boolean;
    wordWrap: boolean;
  };
}

// ── Analytics ─────────────────────────────────────────────────
export interface AnalyticsData {
  totalReviews: number;
  averageScore: number;
  totalIssuesFound: number;
  mostCommonBugType: string;
  reviewsByDay: Array<{ date: string; count: number; avgScore: number }>;
  scoreHistory: Array<{ date: string; score: number }>;
  languageDistribution: Array<{ language: string; count: number; percentage: number }>;
  issueTypeBreakdown: Array<{ type: string; count: number }>;
  weeklyActivity: Array<{ week: string; reviews: number; issues: number }>;
  improvements: number; // % improvement over last period
}

// ── API Request / Response ────────────────────────────────────
export interface ReviewRequest {
  code: string;
  language: Language;
  filename?: string;
}

export interface ReviewApiResponse {
  success: boolean;
  result?: ReviewResult;
  error?: string;
}

export interface ChatApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ── UI State ──────────────────────────────────────────────────
export type ReviewTab = "bugs" | "security" | "performance" | "suggestions" | "refactored" | "summary";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  timestamp: string;
}

// ── Landing / Marketing ───────────────────────────────────────
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceYearly: number;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  review: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// ── Language config helper ────────────────────────────────────
export const LANGUAGE_CONFIG: Record<Language, { label: string; monacoId: string; icon: string; color: string }> = {
  javascript: { label: "JavaScript", monacoId: "javascript", icon: "JS", color: "#F7DF1E" },
  typescript: { label: "TypeScript", monacoId: "typescript", icon: "TS", color: "#3178C6" },
  python: { label: "Python", monacoId: "python", icon: "PY", color: "#3776AB" },
  java: { label: "Java", monacoId: "java", icon: "JV", color: "#ED8B00" },
  cpp: { label: "C++", monacoId: "cpp", icon: "C++", color: "#00599C" },
  c: { label: "C", monacoId: "c", icon: "C", color: "#A8B9CC" },
  go: { label: "Go", monacoId: "go", icon: "GO", color: "#00ADD8" },
  rust: { label: "Rust", monacoId: "rust", icon: "RS", color: "#CE422B" },
  php: { label: "PHP", monacoId: "php", icon: "PHP", color: "#777BB4" },
  html: { label: "HTML", monacoId: "html", icon: "HTML", color: "#E34F26" },
  css: { label: "CSS", monacoId: "css", icon: "CSS", color: "#1572B6" },
  sql: { label: "SQL", monacoId: "sql", icon: "SQL", color: "#4479A1" },
  bash: { label: "Bash", monacoId: "shell", icon: "SH", color: "#4EAA25" },
  json: { label: "JSON", monacoId: "json", icon: "JSON", color: "#F0C33C" },
  yaml: { label: "YAML", monacoId: "yaml", icon: "YAML", color: "#CB171E" },
  markdown: { label: "Markdown", monacoId: "markdown", icon: "MD", color: "#083FA1" },
};
