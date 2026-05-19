// ============================================================
// OpenAI integration + prompt engineering for CodeReview AI
// ============================================================

import OpenAI from "openai";
import { Language, ReviewResult, ReviewIssue, Severity } from "@/types";

// ── Client (server-side only) ─────────────────────────────────
function getClient(apiKey?: string): OpenAI {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("No OpenAI API key configured");
  }
  return new OpenAI({ apiKey: key });
}

// ── Prompt Builder ────────────────────────────────────────────
export function buildReviewPrompt(code: string, language: Language): string {
  return `You are an expert code reviewer. Analyze the following ${language} code and return a comprehensive review as valid JSON.

## Instructions:
- Be thorough and specific
- Provide actionable feedback
- Suggest concrete fixes
- Reference specific line numbers when possible
- Generate an improved/refactored version of the code
- Score the code from 0-100 based on overall quality

## Code to review:
\`\`\`${language}
${code}
\`\`\`

## Required JSON Response Format:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall summary>",
  "refactoredCode": "<complete refactored/improved version of the code>",
  "bugs": [
    {
      "id": "<unique-id>",
      "line": <line number or null>,
      "endLine": <end line or null>,
      "severity": "<critical|high|medium|low|info>",
      "title": "<short title>",
      "message": "<detailed description>",
      "fix": "<how to fix it>",
      "codeSnippet": "<relevant code snippet>"
    }
  ],
  "security": [/* same structure as bugs */],
  "performance": [/* same structure as bugs */],
  "suggestions": [/* same structure as bugs */],
  "complexity": {
    "level": "<low|medium|high|very-high>",
    "score": <number 0-100>,
    "description": "<description of complexity>"
  }
}

Return ONLY the JSON object, no markdown, no explanation.`;
}

export function buildChatPrompt(userMessage: string, codeContext?: string, language?: Language): string {
  let systemPrompt = `You are an expert AI coding assistant specialized in code review, debugging, and optimization. 
You provide clear, actionable advice and code examples.
Format your responses using markdown for better readability.`;

  if (codeContext) {
    systemPrompt += `\n\nCode context (${language || "unknown"} code being reviewed):\n\`\`\`${language || ""}\n${codeContext.slice(0, 2000)}\n\`\`\``;
  }

  return systemPrompt;
}

// ── Parse AI Response ─────────────────────────────────────────
export function parseReviewResponse(
  raw: string,
  originalCode: string,
  language: Language
): ReviewResult {
  let parsed: Record<string, unknown>;
  
  try {
    // Strip any markdown code fences if present
    const cleaned = raw
      .replace(/^```json\n?/gm, "")
      .replace(/^```\n?/gm, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  const bugs = (parsed.bugs as Record<string, unknown>[] || []).map(normalizeIssue);
  const security = (parsed.security as Record<string, unknown>[] || []).map(normalizeIssue);
  const performance = (parsed.performance as Record<string, unknown>[] || []).map(normalizeIssue);
  const suggestions = (parsed.suggestions as Record<string, unknown>[] || []).map(normalizeIssue);

  const allIssues = [...bugs, ...security, ...performance, ...suggestions];
  const metrics = {
    linesOfCode: originalCode.split("\n").length,
    issueCount: allIssues.length,
    criticalCount: allIssues.filter((i) => i.severity === "critical").length,
    highCount: allIssues.filter((i) => i.severity === "high").length,
    mediumCount: allIssues.filter((i) => i.severity === "medium").length,
    lowCount: allIssues.filter((i) => i.severity === "low" || i.severity === "info").length,
  };

  return {
    id: `review_${Date.now()}`,
    score: typeof parsed.score === "number" ? Math.max(0, Math.min(100, parsed.score)) : 70,
    summary: String(parsed.summary || "Review complete."),
    language,
    originalCode,
    refactoredCode: String(parsed.refactoredCode || originalCode),
    bugs,
    security,
    performance,
    suggestions,
    complexity: {
      level: (parsed.complexity as Record<string, unknown>)?.level as "low" | "medium" | "high" | "very-high" || "medium",
      score: Number((parsed.complexity as Record<string, unknown>)?.score || 50),
      description: String((parsed.complexity as Record<string, unknown>)?.description || ""),
    },
    metrics,
    createdAt: new Date().toISOString(),
  };
}

function normalizeIssue(raw: Record<string, unknown>): ReviewIssue {
  return {
    id: String(raw.id || `issue_${Math.random().toString(36).slice(2)}`),
    line: raw.line ? Number(raw.line) : undefined,
    endLine: raw.endLine ? Number(raw.endLine) : undefined,
    severity: validateSeverity(String(raw.severity || "info")),
    title: String(raw.title || "Issue found"),
    message: String(raw.message || ""),
    fix: raw.fix ? String(raw.fix) : undefined,
    codeSnippet: raw.codeSnippet ? String(raw.codeSnippet) : undefined,
  };
}

function validateSeverity(s: string): Severity {
  const valid: Severity[] = ["critical", "high", "medium", "low", "info"];
  return valid.includes(s as Severity) ? (s as Severity) : "info";
}

// ── Streaming Review ──────────────────────────────────────────
export async function streamReview(
  code: string,
  language: Language,
  apiKey?: string
): Promise<ReadableStream<Uint8Array>> {
  const client = getClient(apiKey);

  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    stream: true,
    temperature: 0.1, // Low temperature for consistent structured output
    messages: [
      {
        role: "system",
        content:
          "You are an expert code reviewer. Always respond with valid JSON only, no markdown fences.",
      },
      {
        role: "user",
        content: buildReviewPrompt(code, language),
      },
    ],
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let fullText = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        fullText += delta;
        controller.enqueue(encoder.encode(delta));
      }
      // Signal completion with a special marker
      controller.enqueue(encoder.encode("\n[DONE]"));
      controller.close();
    },
  });
}

// ── Non-streaming Review (for demo/fallback) ──────────────────
export async function requestReview(
  code: string,
  language: Language,
  apiKey?: string
): Promise<ReviewResult> {
  const client = getClient(apiKey);
  const start = Date.now();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "You are an expert code reviewer. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: buildReviewPrompt(code, language),
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || "{}";
  const result = parseReviewResponse(raw, code, language);
  result.duration = Date.now() - start;
  return result;
}

// ── Chat Completion ───────────────────────────────────────────
export async function* streamChat(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  codeContext?: string,
  language?: Language,
  apiKey?: string
): AsyncGenerator<string> {
  const client = getClient(apiKey);

  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: buildChatPrompt("", codeContext, language),
      },
      ...messages,
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || "";
    if (delta) yield delta;
  }
}
