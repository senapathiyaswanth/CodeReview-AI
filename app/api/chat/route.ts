import { NextRequest, NextResponse } from "next/server";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const DEMO_RESPONSES = [
  "That's a great question! Looking at your code, the SQL injection vulnerability on line 2 occurs because user input is directly interpolated into the query string. An attacker could input `'; DROP TABLE users; --` which would execute as SQL. The fix is to use parameterized queries where the database driver handles escaping.",
  "The hardcoded JWT secret `'secret123'` is dangerous because it can be found in your source code repository, error messages, or logs. Anyone with access to this secret can forge valid tokens and impersonate any user. You should use a long random string stored in an environment variable like `process.env.JWT_SECRET`.",
  "For the `processItems` function, the `for` loop with `var` and `push()` is the least efficient approach. Modern JavaScript engines optimize `Array.prototype.filter()` and `Array.prototype.map()` much better. Also, `var` has function scope (not block scope) which can cause bugs. Using `const items.filter(...).map(...)` is both faster and more readable.",
];

export async function POST(req: NextRequest) {
  try {
    const { messages, codeContext, language } = await req.json();

    if (!messages?.length) {
      return NextResponse.json({ success: false, error: "Messages required" }, { status: 400 });
    }

    // Demo mode
    if (DEMO_MODE || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo") {
      await new Promise((r) => setTimeout(r, 1200));
      const randomResponse = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      return NextResponse.json({ success: true, message: randomResponse });
    }

    // Real OpenAI
    const { OpenAI } = await import("openai");
    const { buildChatPrompt } = await import("@/lib/openai");
    
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        { role: "system", content: buildChatPrompt("", codeContext, language) },
        ...messages,
      ],
    });

    const message = response.choices[0]?.message?.content || "I couldn't generate a response.";
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
