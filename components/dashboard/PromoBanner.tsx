"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";

export function PromoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-highlight-green rounded-xl p-5 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground flex-shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Complete your setup
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Connect ERA receipts to unlock claim reconciliation and revenue forecasting.
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}
