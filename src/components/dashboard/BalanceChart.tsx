"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const chartData = [
  { date: "1/1", value: 1200000 },
  { date: "1/5", value: 1350000 },
  { date: "1/8", value: 1380000 },
  { date: "1/12", value: 1520000 },
  { date: "1/15", value: 1580000 },
  { date: "1/19", value: 1720000 },
  { date: "1/22", value: 1680000 },
  { date: "1/26", value: 1847230 },
];

const timeFilters = ["1W", "1M", "3M", "YTD", "ALL"] as const;

const recentTransactions = [
  { id: "1", title: "Blue Cross Blue Shield", description: "Claims Payment - Batch #45892", amount: 15680.50, date: "Jan 19", type: "credit" as const },
  { id: "2", title: "Payroll Services Inc", description: "Biweekly Payroll - 15 Employees", amount: -28450.00, date: "Jan 19", type: "debit" as const },
  { id: "3", title: "UnitedHealthcare", description: "Wire Transfer - Claims Settlement", amount: 45230.75, date: "Jan 18", type: "credit" as const },
  { id: "4", title: "Blue Cross Blue Shield", description: "Medical Claims Payment - Check", amount: 8420.75, date: "Jan 18", type: "credit" as const },
  { id: "5", title: "Aetna", description: "EFT Payment - Claims Batch #12044", amount: 22310.00, date: "Jan 17", type: "credit" as const },
  { id: "6", title: "Office Supplies Co", description: "Monthly Supply Order", amount: -1245.80, date: "Jan 17", type: "debit" as const },
  { id: "7", title: "Humana", description: "Claims Settlement - Wire", amount: 31890.25, date: "Jan 16", type: "credit" as const },
  { id: "8", title: "Medicare", description: "ERA Payment - Batch #78231", amount: 67450.00, date: "Jan 16", type: "credit" as const },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-foreground px-3 py-2 shadow-lg">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-background">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function BalanceChart() {
  const [activeFilter, setActiveFilter] = useState<string>("1M");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      {/* Header */}
      <p className="section-label mb-3">Lemma Balance</p>
      <div className="flex items-baseline gap-3 mb-1">
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          $1,847,230
        </p>
        <span className="text-sm text-success font-medium">
          +$124,580.40 (7.2%)
        </span>
      </div>

      {/* Chart */}
      <div className="h-52 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={formatCurrency}
              width={50}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time Period Filters */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {timeFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
              activeFilter === filter
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Latest Transactions */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Latest Transactions</p>
          <Link href="/transactions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <div className="space-y-0">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-3 px-1 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
                  tx.type === "credit"
                    ? "bg-success/10 text-success"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {tx.type === "credit" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.title}</p>
                <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-medium tabular-nums",
                  tx.type === "credit" ? "text-success" : "text-foreground"
                )}>
                  {tx.type === "credit" ? "+" : ""}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
