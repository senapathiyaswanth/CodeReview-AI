"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/lib/demo-data";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-yellow-400 tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Loved by developers{" "}
            <span className="gradient-text">worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of engineers who ship better code every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="glass border-white/10 p-6 h-full flex flex-col hover:border-white/20 hover:shadow-xl transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                {/* Review */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                  &ldquo;{t.review}&rdquo;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                      {t.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.role} @ {t.company}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
