import type { Metadata } from "next";
import Link from "next/link";
import { Code2 } from "lucide-react";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.18 210), transparent)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, oklch(0.62 0.28 290), transparent)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">CodeReview AI</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">Start reviewing code for free today</p>
        </div>

        <div className="glass gradient-border rounded-2xl p-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="first-name">First name</label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="last-name">Last name</label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email-signup">Email</label>
              <input
                id="email-signup"
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password-signup">Password</label>
              <input
                id="password-signup"
                type="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
            <Link href="/dashboard" className="block w-full">
              <button
                id="sign-up-button"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
              >
                Create Account — It&apos;s Free
              </button>
            </Link>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
