"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Shield, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const floatingBadges = [
  { icon: Shield, label: "Security Scan", color: "text-red-400", bg: "bg-red-500/10", x: "-5%", y: "20%", delay: 0 },
  { icon: Zap, label: "Performance", color: "text-yellow-400", bg: "bg-yellow-500/10", x: "88%", y: "25%", delay: 0.3 },
  { icon: Sparkles, label: "AI Powered", color: "text-purple-400", bg: "bg-purple-500/10", x: "80%", y: "65%", delay: 0.6 },
  { icon: Star, label: "Score: 94/100", color: "text-blue-400", bg: "bg-blue-500/10", x: "2%", y: "68%", delay: 0.9 },
];

const TRUSTED_COMPANIES = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "GitHub"];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        
        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-blob"
          style={{
            y,
            background: "radial-gradient(circle, oklch(0.62 0.28 290), transparent)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 animate-blob"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.22 252), transparent)",
            filter: "blur(60px)",
            animationDelay: "2s",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-10 animate-blob"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.18 210), transparent)",
            filter: "blur(60px)",
            animationDelay: "4s",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.94 0.005 260) 1px, transparent 1px), linear-gradient(90deg, oklch(0.94 0.005 260) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Badges */}
      {floatingBadges.map((badge) => (
        <motion.div
          key={badge.label}
          className="absolute hidden lg:flex items-center gap-2 glass px-3 py-2 rounded-full text-sm font-medium animate-float"
          style={{ left: badge.x, top: badge.y, animationDelay: `${badge.delay * 1.5}s` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: badge.delay + 0.8, duration: 0.5 }}
        >
          <div className={`w-6 h-6 rounded-full ${badge.bg} flex items-center justify-center`}>
            <badge.icon className={`w-3 h-3 ${badge.color}`} />
          </div>
          <span className="text-muted-foreground">{badge.label}</span>
        </motion.div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <Badge
            variant="outline"
            className="glass border-purple-500/30 text-purple-300 px-4 py-1.5 text-sm font-medium gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by GPT-4o — The most advanced code AI
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
        >
          AI Code Reviews{" "}
          <span className="gradient-text">
            Instant & Actionable
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Paste your code and get a comprehensive review in seconds. Detect bugs,
          security vulnerabilities, performance issues, and receive AI-generated fixes
          powered by GPT-4o.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link href="/sign-up">
            <Button
              id="hero-start-reviewing"
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-xl shadow-blue-500/25 font-semibold text-base group"
            >
              Start Reviewing
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              id="hero-try-demo"
              variant="outline"
              size="lg"
              className="h-12 px-8 glass border-white/20 hover:bg-white/10 font-semibold text-base group"
            >
              <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              Try Demo
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {[
            { value: "50K+", label: "Reviews Done" },
            { value: "98%", label: "Accuracy Rate" },
            { value: "< 10s", label: "Average Time" },
            { value: "16+", label: "Languages" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by engineers at world-class companies
          </p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {TRUSTED_COMPANIES.map((company) => (
              <span
                key={company}
                className="text-muted-foreground/50 font-semibold text-sm tracking-wider hover:text-muted-foreground transition-colors"
              >
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hero Code Preview */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="relative z-10 max-w-4xl w-full mx-auto px-4 mt-12"
      >
        <div className="gradient-border rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
          <div className="glass p-4">
            {/* Editor header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-mono">auth-service.ts</span>
              <div className="ml-auto">
                <Badge variant="outline" className="text-xs text-red-400 border-red-500/30 bg-red-500/10">
                  3 Critical Issues Found
                </Badge>
              </div>
            </div>
            {/* Code preview */}
            <pre className="text-xs sm:text-sm font-mono overflow-x-auto text-left scrollbar-thin">
              <code>
                <span className="text-muted-foreground">1  </span>
                <span className="text-blue-400">{"async function "}</span>
                <span className="text-yellow-300">{"authenticate"}</span>
                <span className="text-foreground">{"(username, password) {"}</span>
                {"\n"}
                <span className="text-muted-foreground">2  </span>
                <span className="bg-red-500/20 px-1 rounded">
                  <span className="text-blue-400">{"  const query = "}</span>
                  <span className="text-green-300">{"`SELECT * FROM users WHERE username = '${username}'`"}</span>
                </span>
                {"\n"}
                <span className="text-muted-foreground">3  </span>
                <span className="text-muted-foreground">{"  // ..."}</span>
                {"\n"}
                <span className="text-muted-foreground">4  </span>
                <span className="bg-red-500/20 px-1 rounded">
                  <span className="text-blue-400">{"  const token = jwt.sign"}</span>
                  <span className="text-foreground">{"(user, "}</span>
                  <span className="text-green-300">{`"secret123"`}</span>
                  <span className="text-foreground">{")"}</span>
                </span>
                {"\n"}
                <span className="text-muted-foreground">5  </span>
                <span className="text-foreground">{"}"}</span>
              </code>
            </pre>
            {/* AI Output preview */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              {[
                { sev: "CRITICAL", color: "text-red-400 bg-red-500/10 border-red-500/30", msg: "SQL Injection vulnerability detected on line 2" },
                { sev: "HIGH", color: "text-orange-400 bg-orange-500/10 border-orange-500/30", msg: "Hardcoded JWT secret exposes authentication system" },
                { sev: "INFO", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", msg: "Refactored code with parameterized queries generated" },
              ].map((item) => (
                <div key={item.msg} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className={`text-xs shrink-0 ${item.color}`}>
                    {item.sev}
                  </Badge>
                  <span className="text-muted-foreground">{item.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Score indicator */}
        <div className="absolute -right-4 top-1/3 hidden lg:flex flex-col items-center gap-1">
          <div className="glass rounded-xl px-3 py-4 text-center glow-blue">
            <div className="text-2xl font-bold text-red-400">42</div>
            <div className="text-xs text-muted-foreground">AI Score</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
