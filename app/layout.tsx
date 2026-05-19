import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeReview AI — AI-Powered Code Review Assistant",
    template: "%s | CodeReview AI",
  },
  description:
    "Get instant, AI-powered code reviews. Detect bugs, security vulnerabilities, performance issues, and get refactored code suggestions powered by GPT-4o.",
  keywords: [
    "code review",
    "AI code review",
    "code quality",
    "bug detection",
    "security analysis",
    "GPT-4",
    "developer tools",
  ],
  authors: [{ name: "CodeReview AI Team" }],
  creator: "CodeReview AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "CodeReview AI — AI-Powered Code Review Assistant",
    description:
      "Get instant, AI-powered code reviews. Detect bugs, security vulnerabilities, and performance issues with GPT-4o.",
    siteName: "CodeReview AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeReview AI — AI-Powered Code Review Assistant",
    description: "Get instant, AI-powered code reviews powered by GPT-4o.",
    creator: "@codereviewai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "oklch(0.14 0.018 260)",
                  color: "oklch(0.94 0.005 260)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
