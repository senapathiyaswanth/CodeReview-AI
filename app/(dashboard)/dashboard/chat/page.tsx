"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Trash2, MessageSquare, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { ChatMessage } from "@/types";
import { toast } from "sonner";

const STARTER_PROMPTS = [
  "Explain what SQL injection is and how to prevent it",
  "What are the most common security vulnerabilities in web apps?",
  "How can I improve the performance of my React components?",
  "What's the difference between authentication and authorization?",
];

export default function ChatPage() {
  const { chatSessions, activeChatId, createChatSession, addMessage, deleteChatSession, setActiveChatId } = useAppStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = chatSessions.find((s) => s.id === activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    let sessionId = activeChatId;
    if (!sessionId) {
      sessionId = createChatSession();
    }

    const userMessage: ChatMessage = {
      // eslint-disable-next-line react-hooks/purity
      id: `msg_${Date.now()}`,
      role: "user",
      content,
       
      timestamp: new Date().toISOString(),
    };
    addMessage(sessionId, userMessage);
    setInput("");
    setIsLoading(true);

    try {
      const session = chatSessions.find((s) => s.id === sessionId);
      const messages = [...(session?.messages || []), userMessage].map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        // eslint-disable-next-line react-hooks/purity
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: data.success ? data.message : "Sorry, I encountered an error. Please try again.",
         
        timestamp: new Date().toISOString(),
      };
      addMessage(sessionId, assistantMessage);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar: Chat Sessions */}
      <div className="w-64 border-r border-border flex flex-col hidden lg:flex">
        <div className="p-3 border-b border-border">
          <Button
            id="new-chat"
            onClick={() => createChatSession()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 h-9 text-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  session.id === activeChatId ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-muted-foreground"
                }`}
                onClick={() => setActiveChatId(session.id)}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-xs flex-1 truncate">{session.title || "New Chat"}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                  onClick={(e) => { e.stopPropagation(); deleteChatSession(session.id); }}
                  aria-label="Delete chat"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            {chatSessions.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-8">No chats yet</div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeSession ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">AI Code Assistant</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Ask me anything about your code — bugs, best practices, security, performance, or general programming questions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="text-left text-sm glass border border-white/10 hover:border-white/20 rounded-xl p-3 transition-all hover:bg-white/5"
                  onClick={() => { createChatSession(); sendMessage(prompt); }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                <AnimatePresence>
                  {activeSession.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-sm"
                            : "glass border border-white/10 rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className={`text-xs mt-1 ${message.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="glass border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/60"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                  placeholder="Ask about your code..."
                  className="flex-1 glass border-white/10 focus:border-primary/50"
                  disabled={isLoading}
                />
                <Button
                  id="chat-send"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                  size="icon"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
