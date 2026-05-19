"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Code2, Globe, X, Link2 } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background: "linear-gradient(135deg, oklch(0.20 0.05 260), oklch(0.18 0.06 290))",
            border: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          {/* Bg blobs */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, oklch(0.62 0.28 290), transparent)",
              filter: "blur(60px)",
              transform: "translate(-30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, oklch(0.58 0.22 252), transparent)",
              filter: "blur(60px)",
              transform: "translate(30%, 30%)",
            }}
          />

          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Start shipping{" "}
              <span className="gradient-text">bug-free code</span>{" "}
              today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 50,000+ developers who trust CodeReview AI. No credit card required for the free plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  id="cta-banner-start"
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-xl shadow-blue-500/30 font-semibold text-base group"
                >
                  Start for Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  id="cta-banner-demo"
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 glass border-white/20 hover:bg-white/10 font-semibold text-base"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Developers: ["Documentation", "API Reference", "GitHub", "Status"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">CodeReview AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              AI-powered code review for developers who care about code quality, security, and performance.
            </p>
            <div className="flex gap-3">
              {[Globe, X, Link2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 CodeReview AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for developers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
