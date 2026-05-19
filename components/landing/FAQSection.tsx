"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/demo-data";

export function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-green-400 tracking-wider uppercase mb-4 block">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Common{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about CodeReview AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="glass border-white/10 rounded-xl overflow-hidden px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
