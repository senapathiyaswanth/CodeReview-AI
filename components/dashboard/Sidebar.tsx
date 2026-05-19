"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  History,
  Bookmark,
  Lightbulb,
  Settings,
  MessageSquare,
  BarChart3,
  Code2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/review", icon: Plus, label: "New Review", badge: "New" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/snippets", icon: Bookmark, label: "Snippets" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Assistant" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col border-r border-border bg-sidebar h-screen overflow-hidden"
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-border shrink-0", !sidebarOpen && "justify-center")}>
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-sm gradient-text whitespace-nowrap overflow-hidden"
              >
                CodeReview AI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                  !sidebarOpen && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {sidebarOpen && item.badge && (
                  <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <Button
          id="sidebar-toggle"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full h-9 hover:bg-white/5"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
