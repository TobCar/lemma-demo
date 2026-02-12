"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";
import { Account } from "@/data/accounts";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface AccountDetailProps {
  account: Account | null;
  open: boolean;
  onClose: () => void;
}

export function AccountDetail({ account, open, onClose }: AccountDetailProps) {
  if (!account) return null;

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div>
            <SheetTitle className="text-xl font-semibold">{account.assignedTo}</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">Payment Bucket</p>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Current Balance */}
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Current Balance
            </p>
            <p className="text-3xl font-semibold text-foreground">{formatCurrency(account.balance)}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">
                {account.balanceChange}% this month
              </span>
            </div>
          </div>

          {/* Balance Trend Chart */}
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Balance Trend (30 Days)
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={account.balanceTrend}>
                  <defs>
                    <linearGradient id="accountGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={formatYAxis}
                    width={45}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium">
                            {formatCurrency(payload[0].value as number)}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#accountGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Statistics */}
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Statistics
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Monthly Volume</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(account.monthlyVolume)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Transaction Count</p>
                <p className="text-lg font-semibold text-foreground">{account.transactionCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Transaction</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(account.avgTransaction)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-lg font-semibold text-foreground">{account.status}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Account Details */}
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Account Details
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account Number</span>
                <span className="text-sm text-foreground">{account.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Routing Number</span>
                <span className="text-sm text-foreground">{account.routingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created Date</span>
                <span className="text-sm text-foreground">{account.createdDate}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Recent Transactions */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Recent Transactions
            </p>
            <div className="space-y-4">
              {account.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className="text-sm font-medium text-success">
                    +{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 space-y-3">
          <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
            View All Transactions
          </Button>
          <Button variant="outline" className="w-full">
            Export Report
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
