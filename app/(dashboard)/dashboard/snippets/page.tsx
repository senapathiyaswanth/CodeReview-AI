"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Plus, Trash2, Search, Copy, CheckCheck, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { DEMO_SNIPPETS } from "@/lib/demo-data";
import { CodeSnippet, LANGUAGE_CONFIG } from "@/types";
import { toast } from "sonner";

export default function SnippetsPage() {
  const { snippets, addSnippet, deleteSnippet } = useAppStore();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (snippets.length === 0) {
      DEMO_SNIPPETS.forEach((s) => addSnippet(s));
    }
  }, []);

  const displaySnippets = (snippets.length > 0 ? snippets : DEMO_SNIPPETS).filter(
    (s) => s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.language.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const copySnippet = async (snippet: CodeSnippet) => {
    await navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Saved Snippets</h2>
            <p className="text-muted-foreground text-sm mt-1">{displaySnippets.length} snippets saved</p>
          </div>
          <Button
            id="add-snippet"
            onClick={() => {
              const snippet: CodeSnippet = {
                id: `snip_${Date.now()}`,
                title: "New Snippet",
                description: "Add your code here",
                language: "typescript",
                code: "// Your code here\n",
                tags: [],
                createdAt: new Date().toISOString(),
              };
              addSnippet(snippet);
              toast.success("Snippet created!");
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Snippet
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="snippets-search"
            placeholder="Search snippets, tags, languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 glass border-white/10"
          />
        </div>

        <div className="grid gap-4">
          {displaySnippets.map((snippet, i) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="glass border-white/10 overflow-hidden hover:border-white/20 transition-all">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{snippet.title}</div>
                    {snippet.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{snippet.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground px-1.5 py-0">
                      {LANGUAGE_CONFIG[snippet.language]?.label || snippet.language}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-white/5"
                      onClick={() => copySnippet(snippet)}
                      aria-label="Copy snippet"
                    >
                      {copiedId === snippet.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => { deleteSnippet(snippet.id); toast.success("Snippet deleted"); }}
                      aria-label="Delete snippet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Code */}
                <pre className="p-4 text-xs font-mono overflow-x-auto scrollbar-thin text-muted-foreground leading-relaxed max-h-40">
                  <code>{snippet.code}</code>
                </pre>

                {/* Footer */}
                {snippet.tags.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/10 flex gap-1.5 flex-wrap">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-white/10 text-muted-foreground px-1.5 py-0">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {displaySnippets.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-foreground">No snippets yet</p>
            <p className="text-sm mt-1">Save code snippets from your reviews to find them here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
