import type { Metadata } from "next";
import Link from "next/link";
import { Code2 } from "lucide-react";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, oklch(0.62 0.28 290), transparent)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.22 252), transparent)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">CodeReview AI</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Demo Auth Card */}
        <div className="glass gradient-border rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                defaultValue="demo@codereview.ai"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <Link href="/dashboard" className="block w-full">
              <button
                id="sign-in-button"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
              >
                Sign In
              </button>
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Demo mode — click Sign In to enter the dashboard
            </p>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up free
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
