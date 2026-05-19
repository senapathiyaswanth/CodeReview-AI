"use client";

import { motion } from "framer-motion";
import { Bug, Shield, Zap, BookOpen, GitBranch, BarChart3, MessageSquare, FileCode } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Bug,
    title: "Bug Detection",
    description: "Pinpoints null pointer dereferences, infinite loops, logical errors, and off-by-one errors with line-level precision.",
    color: "from-red-500 to-rose-600",
    glow: "shadow-red-500/20",
    gradient: "bg-gradient-to-br from-red-500/10 to-rose-500/5",
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description: "Detects SQL injection, XSS, CSRF, insecure dependencies, hardcoded secrets, and OWASP Top 10 vulnerabilities.",
    color: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/20",
    gradient: "bg-gradient-to-br from-orange-500/10 to-amber-500/5",
  },
  {
    icon: Zap,
    title: "Performance Insights",
    description: "Identifies N+1 queries, memory leaks, unnecessary re-renders, blocking operations, and algorithm complexity issues.",
    color: "from-yellow-500 to-orange-500",
    glow: "shadow-yellow-500/20",
    gradient: "bg-gradient-to-br from-yellow-500/10 to-orange-500/5",
  },
  {
    icon: FileCode,
    title: "Refactored Code",
    description: "Get a complete, production-ready refactored version of your code with all issues fixed and best practices applied.",
    color: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/20",
    gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
  },
  {
    icon: BookOpen,
    title: "Best Practices",
    description: "Language-specific recommendations aligned with community standards, style guides, and modern development patterns.",
    color: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/20",
    gradient: "bg-gradient-to-br from-green-500/10 to-emerald-500/5",
  },
  {
    icon: BarChart3,
    title: "Code Quality Score",
    description: "An AI-generated 0-100 score with detailed breakdown across security, performance, readability, and maintainability.",
    color: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/20",
    gradient: "bg-gradient-to-br from-purple-500/10 to-violet-500/5",
  },
  {
    icon: GitBranch,
    title: "Diff Viewer",
    description: "Side-by-side comparison of your original code vs the AI-refactored version with line-level highlighting.",
    color: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
    gradient: "bg-gradient-to-br from-pink-500/10 to-rose-500/5",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Ask follow-up questions about your code review. The AI explains issues, suggests alternatives, and teaches concepts.",
    color: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    gradient: "bg-gradient-to-br from-indigo-500/10 to-blue-500/5",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-purple-400 tracking-wider uppercase mb-4 block">
            Powered by GPT-4o
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything you need for{" "}
            <span className="gradient-text">perfect code</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop shipping code with hidden bugs. Our AI performs the thorough review
            that every PR deserves but rarely gets.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card
                className={`group relative p-6 h-full glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden ${feature.glow} hover:shadow-xl`}
              >
                {/* BG gradient on hover */}
                <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
