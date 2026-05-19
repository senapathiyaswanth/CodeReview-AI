"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Bug, Trash2, BookmarkCheck, Bookmark, Search, Filter, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { DEMO_SAVED_REVIEWS } from "@/lib/demo-data";
import { toast } from "sonner";

export default function HistoryPage() {
  const { reviews, saveReview, deleteReview, toggleSaveReview } = useAppStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (reviews.length === 0) {
      DEMO_SAVED_REVIEWS.forEach((r) => saveReview(r));
    }
  }, []);

  const displayReviews = (reviews.length > 0 ? reviews : DEMO_SAVED_REVIEWS).filter(
    (r) => r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.language.toLowerCase().includes(search.toLowerCase())
  );

  const scoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-400";
    if (score >= 60) return "bg-yellow-500/20 text-yellow-400";
    if (score >= 40) return "bg-orange-500/20 text-orange-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Review History</h2>
            <p className="text-muted-foreground text-sm mt-1">{displayReviews.length} code reviews</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="history-search"
            type="search"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 glass border-white/10"
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-3">
            {displayReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${scoreColor(review.score)}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                <Card className="glass border-white/10 p-4 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-3">
                    {/* Score */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${scoreColor(review.score)}`}>
                      {review.score}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-sm">{review.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground px-1.5 py-0">
                              {review.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-white/5"
                            onClick={() => { toggleSaveReview(review.id); toast.success(review.isSaved ? "Unsaved" : "Saved!"); }}
                            aria-label={review.isSaved ? "Unsave" : "Save"}
                          >
                            {review.isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => { deleteReview(review.id); toast.success("Review deleted"); }}
                            aria-label="Delete review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bug className="w-3 h-3" />
                          {review.result.metrics.issueCount} issues
                        </span>
                        {review.result.metrics.criticalCount > 0 && (
                          <span className="text-red-400">{review.result.metrics.criticalCount} critical</span>
                        )}
                        <span>{review.result.metrics.linesOfCode} lines</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {displayReviews.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-foreground">No reviews yet</p>
            <p className="text-sm mt-1">Start a new code review to see your history here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
