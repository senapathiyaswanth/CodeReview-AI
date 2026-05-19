"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/review": "New Review",
  "/dashboard/history": "Review History",
  "/dashboard/snippets": "Saved Snippets",
  "/dashboard/chat": "AI Assistant",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export function TopNav() {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 flex items-center gap-4 px-4 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
      {/* Page Title */}
      <h1 className="font-semibold text-lg hidden sm:block">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id="topnav-search"
          type="search"
          placeholder="Search reviews, snippets..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 focus:border-primary/50 h-9 text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono hidden sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* New Review CTA */}
        <Link href="/dashboard/review">
          <Button
            id="topnav-new-review"
            size="sm"
            className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 text-xs hidden sm:flex"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Review
          </Button>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button
          id="topnav-notifications"
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 gap-2 px-2 hover:bg-white/5">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                  DU
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">Demo User</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 glass border-white/10">
            <DropdownMenuLabel>
              <div>
                <div className="font-medium">Demo User</div>
                <div className="text-xs text-muted-foreground">demo@codereview.ai</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/analytics" className="w-full">Analytics</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem>
              <Link href="/" className="text-red-400 w-full">Sign Out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
