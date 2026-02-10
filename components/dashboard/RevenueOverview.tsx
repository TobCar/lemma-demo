"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function RevenueOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <p className="section-label mb-4">Revenue Overview</p>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Deposited */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Deposited</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Total revenue received and deposited from paid claims
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-2xl font-semibold text-foreground">$1,458,840</p>
        </div>

        {/* Expected */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Expected</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Pending revenue from approved claims yet to be deposited
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-info">
            Available when connected with ERA receipts
          </p>
        </div>
      </div>
    </motion.div>
  );
}
