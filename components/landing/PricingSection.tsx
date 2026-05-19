"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PRICING_TIERS } from "@/lib/demo-data";
import Link from "next/link";

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-blue-400 tracking-wider uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple,{" "}
            <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free. Upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <Switch
              id="billing-toggle"
              checked={yearly}
              onCheckedChange={setYearly}
            />
            <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                Save 20%
              </Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className={`relative p-8 h-full flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "gradient-border bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-2xl shadow-blue-500/20 scale-105"
                    : "glass border-white/10 hover:border-white/20 hover:shadow-xl"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1 text-xs font-semibold">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Tier Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">
                      ${yearly ? tier.priceYearly : tier.price}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-muted-foreground mb-1">/mo</span>
                    )}
                  </div>
                  {yearly && tier.price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed annually (${tier.priceYearly * 12}/year)
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-blue-400" : "text-green-400"}`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/sign-up">
                  <Button
                    id={`pricing-cta-${tier.id}`}
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-blue-500/25"
                        : "variant-outline"
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
