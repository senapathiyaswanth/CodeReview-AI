import { NextRequest, NextResponse } from "next/server";
import { parseReviewResponse } from "@/lib/openai";
import { DEMO_REVIEW_RESULT } from "@/lib/demo-data";
import { Language, ReviewResult } from "@/types";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: "Code and language are required" },
        { status: 400 }
      );
    }

    // Demo mode: return mock data with a simulated delay
    if (DEMO_MODE || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo") {
      await new Promise((r) => setTimeout(r, 2500)); // Simulate AI processing
      const result: ReviewResult = {
        ...DEMO_REVIEW_RESULT,
        id: `review_${Date.now()}`,
        language: language as Language,
        originalCode: code,
        createdAt: new Date().toISOString(),
        duration: 2500,
        metrics: {
          linesOfCode: code.split("\n").length,
          issueCount: DEMO_REVIEW_RESULT.metrics.issueCount,
          criticalCount: DEMO_REVIEW_RESULT.metrics.criticalCount,
          highCount: DEMO_REVIEW_RESULT.metrics.highCount,
          mediumCount: DEMO_REVIEW_RESULT.metrics.mediumCount,
          lowCount: DEMO_REVIEW_RESULT.metrics.lowCount,
        },
      };
      return NextResponse.json({ success: true, result });
    }

    // Real OpenAI API call
    const { OpenAI } = await import("openai");
    const { buildReviewPrompt } = await import("@/lib/openai");
    
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const start = Date.now();

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer. Always respond with valid JSON only, no markdown fences or extra text.",
        },
        {
          role: "user",
          content: buildReviewPrompt(code, language as Language),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "{}";
    const result = parseReviewResponse(raw, code, language as Language);
    result.duration = Date.now() - start;

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze code",
      },
      { status: 500 }
    );
  }
}
