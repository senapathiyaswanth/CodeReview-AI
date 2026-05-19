# 🤖 CodeReview AI

> **AI-powered code review platform** — Get instant, comprehensive code analysis powered by GPT-4o. Detect bugs, security vulnerabilities, performance issues, and receive a fully refactored version of your code.

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![OpenAI GPT-4o](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)

---

## ✨ Features

- **AI Code Review** — Powered by GPT-4o, analyzes bugs, security, performance, and readability
- **Security Scanning** — OWASP Top 10, SQL injection, XSS, hardcoded secrets detection
- **Performance Analysis** — N+1 queries, memory leaks, algorithm complexity
- **Refactored Code** — AI generates a complete improved version of your code
- **Analytics Dashboard** — Quality trends, language stats, weekly activity charts
- **AI Chat Assistant** — Ask follow-up questions about your code
- **Monaco Editor** — VS Code-quality code editing with syntax highlighting
- **File Upload** — Drag and drop file uploads with auto language detection
- **PDF Export** — Download full review reports
- **Dark/Light Mode** — Premium dark theme by default
- **Fully Responsive** — Works on desktop, tablet, and mobile

---

## Quick Start

### Prerequisites

- Node.js 18+

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` — by default it runs in demo mode with no API key needed.

### 3. Start the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Demo Mode

The app ships with `NEXT_PUBLIC_DEMO_MODE=true` enabled by default.

In demo mode, AI reviews return realistic mock results with no OpenAI API key needed.

To use real GPT-4o reviews:
1. Get an API key from platform.openai.com
2. Set `NEXT_PUBLIC_DEMO_MODE=false` in `.env.local`
3. Set `OPENAI_API_KEY=sk-your-key`

---

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4 + shadcn/ui
- Animations: Framer Motion
- Code Editor: Monaco Editor
- AI: OpenAI GPT-4o
- State: Zustand with localStorage persistence
- Charts: Recharts

---

## Pages

| Page | Route |
|---|---|
| Landing | / |
| Sign In | /sign-in |
| Sign Up | /sign-up |
| Dashboard | /dashboard |
| New Review | /dashboard/review |
| History | /dashboard/history |
| Snippets | /dashboard/snippets |
| AI Chat | /dashboard/chat |
| Analytics | /dashboard/analytics |
| Settings | /dashboard/settings |

---

## Deployment

```bash
npm run build
vercel deploy
```

Add `OPENAI_API_KEY` and set `NEXT_PUBLIC_DEMO_MODE=false` in Vercel dashboard for production.
