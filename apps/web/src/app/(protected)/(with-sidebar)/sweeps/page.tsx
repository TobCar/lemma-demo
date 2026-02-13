"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRuleDrawer } from "@/components/sweeps/CreateRuleDrawer";
import { sweepRules, recentSweeps } from "@/data/cashSweeps";
import { Badge } from "@/components/ui/badge";
import {
  TablePagination,
  usePagination
} from "@/components/ui/tablePagination";
import { cn } from "@/lib/utils";

export default function CashSweepsPage() {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const activeRulesCount = sweepRules.filter((r) => r.isActive).length;

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    totalItems,
    itemsPerPage
  } = usePagination(recentSweeps, 10);

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Auto Cash Sweep
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              You have {activeRulesCount} active auto transfer rule
              {activeRulesCount !== 1 ? "s" : ""}.
            </p>
          </div>
          <Button
            onClick={() => setCreateDrawerOpen(true)}
            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="h-4 w-4" />
            Create rule
          </Button>
        </div>
      </motion.div>

      {/* Active Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        {sweepRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-card rounded-xl border border-border shadow-soft p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                  <div className="h-3 w-3 rounded-full bg-background" />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{rule.frequency}</span>, if
                    the balance of{" "}
                    <span className="font-semibold">
                      {rule.destinationAccount} {rule.destinationAccountId}
                    </span>{" "}
                    {rule.condition} ${rule.threshold}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    └ Transfer funds from{" "}
                    <span className="font-semibold text-foreground">
                      {rule.sourceAccount} {rule.sourceAccountId}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Next transfer: {rule.nextTransfer} • Last modified by you{" "}
                    {rule.lastModified}
                  </p>
                </div>
              </div>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recent Sweeps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Sweeps
        </h2>

        <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[140px_150px_160px_160px_160px_120px] gap-4 px-6 py-4 border-b border-border">
            <div className="text-xs font-normal text-muted-foreground">
              Date
            </div>
            <div className="text-xs font-normal text-muted-foreground">
              Amount
            </div>
            <div className="text-xs font-normal text-muted-foreground">
              From
            </div>
            <div className="text-xs font-normal text-muted-foreground">To</div>
            <div className="text-xs font-normal text-muted-foreground">
              Method
            </div>
            <div className="text-xs font-normal text-muted-foreground">
              Status
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {paginatedItems.map((sweep, index) => (
              <motion.div
                key={sweep.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.03 * index }}
                className="grid grid-cols-[140px_150px_160px_160px_160px_120px] gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="text-sm text-muted-foreground">
                  {sweep.date}
                </div>
                <div className="text-sm font-semibold text-foreground tabular-nums">
                  {formatCurrency(sweep.amount)}
                </div>
                <div className="text-sm text-category-teal">
                  {sweep.from} {sweep.fromId}
                </div>
                <div className="text-sm text-category-blue">
                  {sweep.to} {sweep.toId}
                </div>
                <div className="text-sm text-muted-foreground">
                  {sweep.method}
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-medium text-xs",
                      sweep.status === "completed"
                        ? "bg-success/10 text-success"
                        : sweep.status === "pending"
                          ? "bg-highlight-amber text-category-amber"
                          : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {sweep.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </motion.div>

      {/* Create Rule Drawer */}
      <CreateRuleDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
      />
    </>
  );
}
