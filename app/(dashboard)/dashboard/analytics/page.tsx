"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Bug, Shield, Zap, Code2 } from "lucide-react";
import { DEMO_ANALYTICS } from "@/lib/demo-data";
import { motion as m } from "framer-motion";

const COLORS = [
  "oklch(0.70 0.22 260)",
  "oklch(0.72 0.28 300)",
  "oklch(0.76 0.18 210)",
  "oklch(0.70 0.24 340)",
  "oklch(0.74 0.20 160)",
];

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.14 0.018 260)",
    border: "1px solid oklch(1 0 0 / 10%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "oklch(0.94 0.005 260)",
  },
};

const statCards = [
  { label: "Total Reviews", value: DEMO_ANALYTICS.totalReviews, icon: Code2, change: "+12 this week", trend: "up", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
  { label: "Average Score", value: `${DEMO_ANALYTICS.averageScore}/100`, icon: TrendingUp, change: `+${DEMO_ANALYTICS.improvements}% improvement`, trend: "up", color: "from-green-500 to-emerald-500", bg: "bg-green-500/10" },
  { label: "Issues Found", value: DEMO_ANALYTICS.totalIssuesFound, icon: Bug, change: "Across all reviews", trend: "neutral", color: "from-orange-500 to-red-500", bg: "bg-orange-500/10" },
  { label: "Most Common Bug", value: "SQL Injection", icon: Shield, change: "Security category", trend: "neutral", color: "from-red-500 to-rose-500", bg: "bg-red-500/10" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-1">Analytics</h2>
        <p className="text-muted-foreground text-sm mb-6">Your code quality metrics and trends</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass border-white/10 p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="w-3 h-3 text-green-400" />}
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score trend */}
          <Card className="glass border-white/10 p-6">
            <h3 className="font-semibold mb-1">Code Quality Trend</h3>
            <p className="text-xs text-muted-foreground mb-4">AI score over the last 14 days</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={DEMO_ANALYTICS.scoreHistory}>
                <defs>
                  <linearGradient id="scoreGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.70 0.22 260)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.70 0.22 260)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.60 0.01 260)" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.60 0.01 260)" }} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.70 0.22 260)" strokeWidth={2} fill="url(#scoreGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Issue Breakdown */}
          <Card className="glass border-white/10 p-6">
            <h3 className="font-semibold mb-1">Issues by Type</h3>
            <p className="text-xs text-muted-foreground mb-4">Distribution of detected issues</p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={DEMO_ANALYTICS.issueTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="type"
                    paddingAngle={3}
                  >
                    {DEMO_ANALYTICS.issueTypeBreakdown.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(val, name) => [val, name]} />
                  <Legend
                    formatter={(value) => <span style={{ color: "oklch(0.60 0.01 260)", fontSize: 11 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <Card className="glass border-white/10 p-6">
            <h3 className="font-semibold mb-1">Weekly Activity</h3>
            <p className="text-xs text-muted-foreground mb-4">Reviews and issues per week</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DEMO_ANALYTICS.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "oklch(0.60 0.01 260)" }} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.01 260)" }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="reviews" fill="oklch(0.70 0.22 260)" radius={[4, 4, 0, 0]} name="Reviews" />
                <Bar dataKey="issues" fill="oklch(0.72 0.28 300)" radius={[4, 4, 0, 0]} name="Issues" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Language Distribution */}
          <Card className="glass border-white/10 p-6">
            <h3 className="font-semibold mb-1">Language Distribution</h3>
            <p className="text-xs text-muted-foreground mb-5">Reviews by programming language</p>
            <div className="space-y-4">
              {DEMO_ANALYTICS.languageDistribution.map((lang, i) => (
                <div key={lang.language}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-muted-foreground">{lang.count} reviews ({lang.percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
