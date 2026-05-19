// ============================================================
// Demo / mock data for CodeReview AI
// Used when NEXT_PUBLIC_DEMO_MODE=true or no OpenAI key
// ============================================================

import { ReviewResult, SavedReview, AnalyticsData, CodeSnippet } from "@/types";

// ── Sample code snippets ──────────────────────────────────────
export const DEMO_CODE = {
  typescript: `// User authentication service
async function authenticateUser(username: string, password: string) {
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  const result = await db.query(query);
  
  if (result.rows.length > 0) {
    const user = result.rows[0];
    const token = jwt.sign(user, 'secret123');
    return { success: true, token, user };
  }
  
  return { success: false };
}

// Fetch user data
async function getUserData(userId) {
  const response = await fetch('https://api.example.com/users/' + userId);
  const data = response.json();
  return data;
}

// Process items  
function processItems(items) {
  let result = [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].active == true) {
      result.push({
        id: items[i].id,
        name: items[i].name,
        data: JSON.parse(items[i].data)
      });
    }
  }
  return result;
}`,

  python: `import pickle
import os

def load_user_data(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)  # Security risk!

def calculate_total(items):
    total = 0
    for item in items:
        total = total + item['price'] * item['quantity']
    return total

def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = " + str(user_id))
    return cursor.fetchone()

class DataProcessor:
    def __init__(self):
        self.data = []
        
    def add_item(self, item):
        self.data.append(item)
    
    def process(self):
        results = []
        for i in range(len(self.data)):
            item = self.data[i]
            result = {}
            result['id'] = item['id']
            result['value'] = item['value'] * 2
            results.append(result)
        return results`,
};

// ── Demo Review Result ────────────────────────────────────────
export const DEMO_REVIEW_RESULT: ReviewResult = {
  id: "demo_review_001",
  score: 42,
  summary:
    "This code has critical security vulnerabilities including SQL injection and insecure JWT signing, along with several performance issues and code quality problems. Immediate attention required on the security issues before this can be considered production-ready.",
  language: "typescript",
  originalCode: DEMO_CODE.typescript,
  refactoredCode: `// Secure user authentication service
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './database';

interface AuthResult {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password'>;
  error?: string;
}

async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  try {
    // Use parameterized query to prevent SQL injection
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const user = result.rows[0];
    
    // Use bcrypt to securely compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Use environment variable for JWT secret
    const { password: _, ...safeUser } = user;
    const token = jwt.sign(
      { id: safeUser.id, username: safeUser.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    return { success: true, token, user: safeUser };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Fetch user data with proper error handling and await
async function getUserData(userId: string): Promise<User | null> {
  const response = await fetch(\`\${process.env.API_URL}/users/\${encodeURIComponent(userId)}\`);
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch user: \${response.statusText}\`);
  }
  
  return response.json(); // Properly awaited
}

// Optimized item processing using modern JS
interface Item {
  id: string;
  name: string;
  data: string;
  active: boolean;
}

function processItems(items: Item[]) {
  return items
    .filter(item => item.active)
    .map(item => ({
      id: item.id,
      name: item.name,
      data: JSON.parse(item.data) as unknown,
    }));
}`,
  bugs: [
    {
      id: "bug_001",
      line: 3,
      endLine: 3,
      severity: "critical",
      title: "SQL Injection Vulnerability",
      message:
        "String concatenation used to build SQL query. This allows attackers to manipulate the query and access or destroy your database.",
      fix: "Use parameterized queries: db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, passwordHash])",
      codeSnippet: "const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`",
    },
    {
      id: "bug_002",
      line: 10,
      endLine: 10,
      severity: "high",
      title: "Hardcoded JWT Secret",
      message:
        "JWT is signed with the hardcoded string 'secret123'. This exposes your application to token forgery attacks.",
      fix: "Use process.env.JWT_SECRET and ensure it is a long, random, cryptographically secure string stored in environment variables.",
      codeSnippet: "const token = jwt.sign(user, 'secret123');",
    },
    {
      id: "bug_003",
      line: 19,
      endLine: 19,
      severity: "high",
      title: "Missing await on async operation",
      message:
        "response.json() is a Promise but the await keyword is missing. This will return a Promise object instead of the actual data.",
      fix: "Add await: const data = await response.json();",
      codeSnippet: "const data = response.json();",
    },
  ],
  security: [
    {
      id: "sec_001",
      line: 3,
      severity: "critical",
      title: "SQL Injection",
      message:
        "The query string directly interpolates user input without sanitization, creating a critical SQL injection vulnerability.",
      fix: "Always use parameterized queries or an ORM that handles escaping.",
    },
    {
      id: "sec_002",
      line: 10,
      severity: "high",
      title: "Insecure JWT Secret",
      message:
        "Hardcoded secrets in source code can be exposed through version control history, error messages, or code leaks.",
      fix: "Store secrets in environment variables and access via process.env.",
    },
    {
      id: "sec_003",
      line: 11,
      severity: "medium",
      title: "Full User Object in JWT",
      message:
        "The entire user object (including password hash) is being signed into the JWT payload. Sensitive data should never be stored in JWT.",
      fix: "Only include non-sensitive identifiers like userId and role in the JWT payload.",
    },
  ],
  performance: [
    {
      id: "perf_001",
      line: 23,
      severity: "medium",
      title: "Inefficient Loop with Array Push",
      message:
        "Using a for loop with push() is less efficient than using filter() and map() which are optimized by modern JS engines.",
      fix: "Replace with: return items.filter(item => item.active === true).map(item => ({ ... }))",
    },
    {
      id: "perf_002",
      line: 25,
      severity: "low",
      title: "Loose Equality Check",
      message:
        "Using == instead of === can cause unexpected type coercions and is slightly slower due to type conversion.",
      fix: "Use strict equality: item.active === true",
    },
  ],
  suggestions: [
    {
      id: "sug_001",
      line: 14,
      severity: "medium",
      title: "Missing TypeScript Types",
      message:
        "The getUserData function parameter has no type annotation. TypeScript's type safety benefits are lost without proper typing.",
      fix: "Add type: async function getUserData(userId: string): Promise<User>",
    },
    {
      id: "sug_002",
      line: 22,
      severity: "low",
      title: "Use const Instead of var",
      message: "var has function scope and can lead to unexpected behavior. Use let or const instead.",
      fix: "Change 'var i = 0' to 'let i = 0' or better yet use a for...of loop.",
    },
    {
      id: "sug_003",
      line: 1,
      severity: "info",
      title: "No Error Handling",
      message:
        "None of these functions have try/catch error handling. Errors will propagate as unhandled promise rejections.",
      fix: "Wrap async operations in try/catch and handle errors gracefully.",
    },
  ],
  complexity: {
    level: "medium",
    score: 45,
    description:
      "The code has moderate complexity with 3 functions performing distinct tasks. The main complexity comes from the loop logic in processItems which could be simplified.",
  },
  metrics: {
    linesOfCode: 35,
    issueCount: 9,
    criticalCount: 2,
    highCount: 3,
    mediumCount: 3,
    lowCount: 1,
  },
  createdAt: new Date().toISOString(),
  duration: 3200,
};

// ── Demo Saved Reviews ────────────────────────────────────────
export const DEMO_SAVED_REVIEWS: SavedReview[] = [
  {
    id: "saved_001",
    title: "Auth Service Review",
    language: "typescript",
    score: 42,
    result: DEMO_REVIEW_RESULT,
    isSaved: true,
    tags: ["security", "authentication"],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "saved_002",
    title: "React Dashboard Component",
    language: "typescript",
    score: 78,
    result: { ...DEMO_REVIEW_RESULT, id: "saved_002", score: 78, bugs: [], security: DEMO_REVIEW_RESULT.security.slice(0, 1) },
    isSaved: false,
    tags: ["react", "ui"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "saved_003",
    title: "Python Data Processor",
    language: "python",
    score: 55,
    result: { ...DEMO_REVIEW_RESULT, id: "saved_003", score: 55, language: "python" },
    isSaved: true,
    tags: ["python", "data"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "saved_004",
    title: "API Route Handler",
    language: "typescript",
    score: 88,
    result: { ...DEMO_REVIEW_RESULT, id: "saved_004", score: 88, bugs: [], security: [], performance: DEMO_REVIEW_RESULT.performance.slice(0, 1) },
    isSaved: false,
    tags: ["api", "nextjs"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "saved_005",
    title: "Database Query Functions",
    language: "typescript",
    score: 33,
    result: { ...DEMO_REVIEW_RESULT, id: "saved_005", score: 33 },
    isSaved: true,
    tags: ["database", "sql"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

// ── Demo Snippets ─────────────────────────────────────────────
export const DEMO_SNIPPETS: CodeSnippet[] = [
  {
    id: "snip_001",
    title: "Secure API Fetch Wrapper",
    description: "Type-safe fetch with error handling and retry logic",
    language: "typescript",
    code: `async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${getToken()}\`,
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${await response.text()}\`);
  }
  
  return response.json();
}`,
    tags: ["typescript", "fetch", "utility"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "snip_002",
    title: "Debounce Hook",
    description: "React hook for debouncing values",
    language: "typescript",
    code: `import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}`,
    tags: ["react", "hooks", "utility"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// ── Demo Analytics ────────────────────────────────────────────
export const DEMO_ANALYTICS: AnalyticsData = {
  totalReviews: 47,
  averageScore: 68,
  totalIssuesFound: 312,
  mostCommonBugType: "SQL Injection",
  improvements: 23,
  reviewsByDay: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: Math.floor(Math.random() * 8) + 1,
    avgScore: Math.floor(Math.random() * 30) + 55,
  })),
  scoreHistory: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: Math.floor(Math.random() * 25) + 55,
  })),
  languageDistribution: [
    { language: "TypeScript", count: 22, percentage: 47 },
    { language: "Python", count: 12, percentage: 26 },
    { language: "JavaScript", count: 8, percentage: 17 },
    { language: "Go", count: 3, percentage: 6 },
    { language: "Rust", count: 2, percentage: 4 },
  ],
  issueTypeBreakdown: [
    { type: "Security", count: 89 },
    { type: "Bugs", count: 112 },
    { type: "Performance", count: 67 },
    { type: "Style", count: 44 },
  ],
  weeklyActivity: Array.from({ length: 8 }, (_, i) => ({
    week: `Week ${i + 1}`,
    reviews: Math.floor(Math.random() * 12) + 3,
    issues: Math.floor(Math.random() * 40) + 10,
  })),
};

// ── Testimonials ──────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sarah Chen",
    role: "Senior Engineer",
    company: "Stripe",
    avatar: "SC",
    rating: 5,
    review: "CodeReview AI caught 3 critical SQL injection vulnerabilities in our codebase that our manual reviews missed. It's like having a senior security engineer on call 24/7.",
  },
  {
    id: "t2",
    name: "Marcus Johnson",
    role: "Lead Developer",
    company: "Vercel",
    avatar: "MJ",
    rating: 5,
    review: "The refactored code suggestions are genuinely impressive. It doesn't just find bugs — it shows you exactly how to fix them with production-quality code.",
  },
  {
    id: "t3",
    name: "Priya Patel",
    role: "CTO",
    company: "DevFlow",
    avatar: "PP",
    rating: 5,
    review: "We've integrated CodeReview AI into our PR workflow. Code quality scores are up 40% team-wide in just 2 months. Absolutely game-changing.",
  },
  {
    id: "t4",
    name: "Alex Rivera",
    role: "Staff Engineer",
    company: "Linear",
    avatar: "AR",
    rating: 5,
    review: "The performance analysis alone is worth the subscription. Found N+1 query issues we'd been living with for years. The ROI is insane.",
  },
];

// ── FAQ ───────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    id: "faq1",
    question: "What programming languages does CodeReview AI support?",
    answer: "CodeReview AI supports 16+ languages including TypeScript, JavaScript, Python, Java, C++, Go, Rust, PHP, HTML/CSS, SQL, Bash, JSON, YAML, and more. We're constantly adding new languages.",
  },
  {
    id: "faq2",
    question: "How accurate is the AI code review?",
    answer: "Our AI is powered by GPT-4o, the most capable code understanding model available. It catches real bugs, security vulnerabilities, and performance issues with high accuracy. Think of it as a senior engineer doing a thorough code review.",
  },
  {
    id: "faq3",
    question: "Is my code stored or used for training?",
    answer: "No. Your code is never stored permanently and is not used for AI training. Each review is processed in real-time and discarded after the session. Your intellectual property stays yours.",
  },
  {
    id: "faq4",
    question: "Can I use my own OpenAI API key?",
    answer: "Yes! Pro and Team plans allow you to bring your own OpenAI API key, giving you full control over costs and model selection.",
  },
  {
    id: "faq5",
    question: "Is there a free plan?",
    answer: "Yes, our free plan includes 5 code reviews per month with access to bug detection and basic suggestions. No credit card required.",
  },
  {
    id: "faq6",
    question: "Can I integrate CodeReview AI into my CI/CD pipeline?",
    answer: "Absolutely. Our API and GitHub App integration (coming soon on Team plan) allows you to automate code reviews on every pull request.",
  },
];

// ── Pricing ───────────────────────────────────────────────────
export const PRICING_TIERS = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    priceYearly: 0,
    description: "Perfect for individuals exploring AI code review",
    features: [
      "5 code reviews / month",
      "Bug detection",
      "Basic suggestions",
      "All languages supported",
      "Review history (7 days)",
    ],
    highlighted: false,
    cta: "Start Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    priceYearly: 15,
    description: "For professional developers who ship quality code",
    features: [
      "Unlimited code reviews",
      "Full AI review suite",
      "Security vulnerability scanning",
      "Performance analysis",
      "AI-generated refactored code",
      "PDF export",
      "Review history (unlimited)",
      "AI chat assistant",
      "BYO OpenAI key",
    ],
    highlighted: true,
    cta: "Start Pro Trial",
  },
  {
    id: "team",
    name: "Team",
    price: 49,
    priceYearly: 39,
    description: "For engineering teams that care about code quality",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared review history",
      "Team analytics dashboard",
      "GitHub PR integration",
      "Priority support",
      "Custom AI prompts",
      "SSO / SAML",
    ],
    highlighted: false,
    cta: "Start Team Trial",
  },
];
