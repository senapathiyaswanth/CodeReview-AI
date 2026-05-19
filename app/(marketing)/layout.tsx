import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";

export const metadata: Metadata = {
  title: "CodeReview AI — AI-Powered Code Review Assistant",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
