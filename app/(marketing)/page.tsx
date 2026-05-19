import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTABanner, Footer } from "@/components/landing/CTABanner";

export const metadata: Metadata = {
  title: "CodeReview AI — AI-Powered Code Review Assistant",
  description:
    "Get instant AI-powered code reviews. Detect bugs, security vulnerabilities, and performance issues with GPT-4o. Trusted by 50,000+ developers.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
