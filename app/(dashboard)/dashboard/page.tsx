"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  TrendingUp,
  Shield,
  Zap,
  Plus,
  ArrowRight,
  Clock,
  Bug,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/useAppStore";
import { DEMO_SAVED_REVIEWS, DEMO_ANALYTICS } from "@/lib/demo-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statCards = [
  {
    label: "Total Reviews",
    value: "47",
    change: "+12 this week",
    trend: "up",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Average Score",
    value: "68",
    change: "+5 from last week",
    trend: "up",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Issues Found",
    value: "312",
    change: "Across all reviews",
    trend: "neutral",
    icon: Bug,
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Security Alerts",
    value: "89",
    change: "23 critical",
    trend: "down",
    icon: Shield,
    color: "from-red-500 to-rose-500",
    bg: "bg-red-500/10",
  },
];

const severityColors: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
};

export default function DashboardPage() {
  const { reviews, saveReview } = useAppStore();

  // Seed demo data if empty
  useEffect(() => {
    if (reviews.length === 0) {
      DEMO_SAVED_REVIEWS.forEach((r) => saveReview(r));
    }
  }, []);

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 5) : DEMO_SAVED_REVIEWS.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden p-6 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, oklch(0.18 0.05 260), oklch(0.16 0.06 290))",
          border: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <div
          className="absolute right-0 top-0 w-64 h-full opacity-10"
          style={{
            background: "radial-gradient(circle at right, oklch(0.62 0.28 290), transparent)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, <span className="gradient-text">Demo User</span> 👋
          </h2>
          <p className="text-muted-foreground text-sm">
            You&apos;ve reviewed 47 files this month. Your code quality is improving!
          </p>
        </div>
        <Link href="/dashboard/review">
          <Button
            id="dashboard-new-review"
            className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Review
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="glass border-white/10 p-5 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 bg-gradient-to-br ${stat.color} [background-clip:text] [-webkit-background-clip:text]`} style={{ color: "transparent", background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`, WebkitBackgroundClip: "text" }} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.change}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts + Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Code Quality Trend</h3>
                <p className="text-sm text-muted-foreground">AI score over the last 14 days</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23% improvement
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={DEMO_ANALYTICS.scoreHistory}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.70 0.22 260)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.70 0.22 260)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.60 0.01 260)" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.60 0.01 260)" }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.14 0.018 260)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.70 0.22 260)"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass border-white/10 p-6">
            <h3 className="font-semibold text-lg mb-2">Languages</h3>
            <p className="text-sm text-muted-foreground mb-5">Your review distribution</p>
            <div className="space-y-4">
              {DEMO_ANALYTICS.languageDistribution.map((lang) => (
                <div key={lang.language}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{lang.language}</span>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <Progress value={lang.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="glass border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Recent Reviews</h3>
              <p className="text-sm text-muted-foreground">Your latest code analysis history</p>
            </div>
            <Link href="/dashboard/history">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {displayReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
              >
                {/* Score Circle */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                  review.score >= 80 ? "bg-green-500/20 text-green-400" :
                  review.score >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                  review.score >= 40 ? "bg-orange-500/20 text-orange-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {review.score}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{review.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground px-1.5 py-0">
                      {review.language}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Issues count */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {review.result.metrics.criticalCount > 0 && (
                    <span className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {review.result.metrics.criticalCount}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bug className="w-3.5 h-3.5" />
                    {review.result.metrics.issueCount}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
