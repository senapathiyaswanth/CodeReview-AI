"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { useAppStore } from "@/store/useAppStore";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav />
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto scrollbar-thin"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
