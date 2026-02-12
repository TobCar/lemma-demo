"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const dailyRevenue = [
  { day: "1", amount: 3120 },
  { day: "2", amount: 4280 },
  { day: "3", amount: 3740 },
  { day: "4", amount: 4900 },
  { day: "5", amount: 4450 },
  { day: "6", amount: 5340 },
  { day: "7", amount: 4630 },
  { day: "8", amount: 6050 },
  { day: "9", amount: 6680 },
  { day: "10", amount: 6230 },
  { day: "11", amount: 7300 },
  { day: "12", amount: 6950 },
];

const maxRevenue = Math.max(...dailyRevenue.map((d) => d.amount));

export function SpendingWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-card rounded-xl border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <p className="section-label">Revenue This Month</p>
        <Link href="/transactions">
          <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
      </div>

      {/* Amount */}
      <div className="px-5 pb-4">
        <p className="text-xs text-muted-foreground mb-1">Received this month</p>
        <p className="text-2xl font-semibold text-foreground tabular-nums">$89,361</p>
      </div>

      {/* Mini Bar Chart with Tooltips */}
      <div className="px-5 pb-5">
        <div className="h-20 flex items-end gap-1">
          {dailyRevenue.map((d) => (
            <Tooltip key={d.day}>
              <TooltipTrigger asChild>
                <div
                  className="flex-1 bg-accent/15 rounded-sm hover:bg-accent/30 transition-colors cursor-pointer"
                  style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p className="font-medium">Jan {d.day}</p>
                <p className="tabular-nums">${d.amount.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
