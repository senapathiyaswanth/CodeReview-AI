// ============================================================
// Zustand global store for CodeReview AI
// Persists reviews, snippets, settings, and chat sessions
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  SavedReview,
  CodeSnippet,
  UserSettings,
  ChatSession,
  ChatMessage,
  ReviewResult,
  Language,
} from "@/types";

// ── Default Settings ──────────────────────────────────────────
const defaultSettings: UserSettings = {
  theme: "dark",
  defaultLanguage: "typescript",
  autoDetectLanguage: true,
  streamingEnabled: true,
  notifications: {
    reviewComplete: true,
    weeklyReport: true,
    tips: false,
  },
  editor: {
    fontSize: 14,
    tabSize: 2,
    minimap: true,
    wordWrap: true,
  },
};

// ── Store Interface ───────────────────────────────────────────
interface AppState {
  // Reviews
  reviews: SavedReview[];
  currentReview: ReviewResult | null;
  isAnalyzing: boolean;

  // Snippets
  snippets: CodeSnippet[];

  // Chat
  chatSessions: ChatSession[];
  activeChatId: string | null;

  // Settings
  settings: UserSettings;

  // UI
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;

  // ── Actions ─────────────────────────────────────────────────
  // Review actions
  setCurrentReview: (review: ReviewResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  saveReview: (review: SavedReview) => void;
  deleteReview: (id: string) => void;
  toggleSaveReview: (id: string) => void;

  // Snippet actions
  addSnippet: (snippet: CodeSnippet) => void;
  deleteSnippet: (id: string) => void;
  updateSnippet: (id: string, updates: Partial<CodeSnippet>) => void;

  // Chat actions
  createChatSession: (codeContext?: string, language?: Language) => string;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateLastMessage: (sessionId: string, content: string) => void;
  deleteChatSession: (id: string) => void;
  setActiveChatId: (id: string | null) => void;

  // Settings actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;

  // UI actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

// ── Store Implementation ──────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────
      reviews: [],
      currentReview: null,
      isAnalyzing: false,
      snippets: [],
      chatSessions: [],
      activeChatId: null,
      settings: defaultSettings,
      sidebarOpen: true,
      commandPaletteOpen: false,

      // ── Review Actions ─────────────────────────────────────
      setCurrentReview: (review) => set({ currentReview: review }),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

      saveReview: (review) =>
        set((state) => ({
          reviews: [review, ...state.reviews.filter((r) => r.id !== review.id)],
        })),

      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),

      toggleSaveReview: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, isSaved: !r.isSaved } : r
          ),
        })),

      // ── Snippet Actions ────────────────────────────────────
      addSnippet: (snippet) =>
        set((state) => ({
          snippets: [snippet, ...state.snippets],
        })),

      deleteSnippet: (id) =>
        set((state) => ({
          snippets: state.snippets.filter((s) => s.id !== id),
        })),

      updateSnippet: (id, updates) =>
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      // ── Chat Actions ───────────────────────────────────────
      createChatSession: (codeContext, language) => {
        const id = `chat_${Date.now()}`;
        const session: ChatSession = {
          id,
          title: "New Chat",
          messages: [],
          codeContext,
          language,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          chatSessions: [session, ...state.chatSessions],
          activeChatId: id,
        }));
        return id;
      },

      addMessage: (sessionId, message) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [...s.messages, message],
                  updatedAt: new Date().toISOString(),
                  title:
                    s.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 50)
                      : s.title,
                }
              : s
          ),
        })),

      updateLastMessage: (sessionId, content) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map((m, i) =>
                    i === s.messages.length - 1
                      ? { ...m, content, isStreaming: false }
                      : m
                  ),
                }
              : s
          ),
        })),

      deleteChatSession: (id) =>
        set((state) => ({
          chatSessions: state.chatSessions.filter((s) => s.id !== id),
          activeChatId:
            state.activeChatId === id ? null : state.activeChatId,
        })),

      setActiveChatId: (id) => set({ activeChatId: id }),

      // ── Settings Actions ───────────────────────────────────
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      resetSettings: () => set({ settings: defaultSettings }),

      // ── UI Actions ─────────────────────────────────────────
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: "codereview-ai-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reviews: state.reviews,
        snippets: state.snippets,
        chatSessions: state.chatSessions,
        settings: state.settings,
      }),
    }
  )
);
