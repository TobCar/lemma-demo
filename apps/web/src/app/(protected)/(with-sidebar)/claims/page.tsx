"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManualMatchDrawer } from "@/components/claims/ManualMatchDrawer";
import {
  TablePagination,
  usePagination
} from "@/components/ui/tablePagination";
import {
  claimTransactions,
  ClaimTransaction,
  getClaimStats,
  PaymentType,
  MatchStatus
} from "@/data/claims";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdownMenu";

export default function ClaimReconciliationPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<ClaimTransaction | null>(null);
  const [matchDrawerOpen, setMatchDrawerOpen] = useState(false);
  const [selectedPayor, setSelectedPayor] = useState<string>("All Payors");
  const [selectedType, setSelectedType] = useState<PaymentType | "All Types">(
    "All Types"
  );
  const [selectedStatus, setSelectedStatus] = useState<
    MatchStatus | "All Status"
  >("All Status");

  const stats = getClaimStats();

  const uniquePayors = [
    "All Payors",
    ...new Set(claimTransactions.map((t) => t.payor))
  ];
  const typeOptions: (PaymentType | "All Types")[] = [
    "All Types",
    "ACH",
    "CHECK",
    "WIRE"
  ];
  const statusOptions: (MatchStatus | "All Status")[] = [
    "All Status",
    "Matched",
    "Needs Match"
  ];

  const handleRowClick = (transaction: ClaimTransaction) => {
    if (transaction.matchStatus === "Needs Match") {
      setSelectedTransaction(transaction);
      setMatchDrawerOpen(true);
    }
  };

  const filteredTransactions = claimTransactions.filter((t) => {
    const payorMatch =
      selectedPayor === "All Payors" || t.payor === selectedPayor;
    const typeMatch = selectedType === "All Types" || t.type === selectedType;
    const statusMatch =
      selectedStatus === "All Status" || t.matchStatus === selectedStatus;
    return payorMatch && typeMatch && statusMatch;
  });

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    totalItems,
    itemsPerPage
  } = usePagination(filteredTransactions, 10);

  const formatCurrency = (value: number, showDecimals = true) =>
    showDecimals
      ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : `$${Math.round(value).toLocaleString()}`;

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
              Claim Reconciliation
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Match received payments with submitted claims
            </p>
          </div>
          <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="bg-card rounded-xl border border-border shadow-soft p-5">
          <p className="text-xs text-category-teal font-medium uppercase tracking-wider mb-2">
            Revenue Received
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(stats.totalReceived, false)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Total deposited amount · {stats.totalTransactions} transactions
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-soft p-5">
          <p className="text-xs text-category-blue font-medium uppercase tracking-wider mb-2">
            Revenue Matched
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(stats.totalMatched, false)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.matchPercentage}% of transactions matched ·{" "}
            {stats.matchedCount} matched
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-center gap-3 mb-6"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[140px] justify-between"
            >
              {selectedPayor}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-background">
            {uniquePayors.map((payor) => (
              <DropdownMenuItem
                key={payor}
                onClick={() => setSelectedPayor(payor)}
              >
                {payor}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[120px] justify-between"
            >
              {selectedType}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-background">
            {typeOptions.map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[120px] justify-between"
            >
              {selectedStatus}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-background">
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card rounded-xl border border-border shadow-soft overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[80px_180px_1fr_80px_120px_120px] gap-4 px-6 py-4 border-b border-border">
          <div className="text-xs font-normal text-muted-foreground">Date</div>
          <div className="text-xs font-normal text-muted-foreground">Payor</div>
          <div className="text-xs font-normal text-muted-foreground">
            Description
          </div>
          <div className="text-xs font-normal text-muted-foreground">Type</div>
          <div className="text-xs font-normal text-muted-foreground text-right">
            Amount
          </div>
          <div className="text-xs font-normal text-muted-foreground">
            Match Status
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {paginatedItems.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.03 * index }}
              onClick={() => handleRowClick(transaction)}
              className={cn(
                "grid grid-cols-[80px_180px_1fr_80px_120px_120px] gap-4 px-6 py-4 transition-colors",
                transaction.matchStatus === "Needs Match"
                  ? "hover:bg-secondary/50 cursor-pointer"
                  : ""
              )}
            >
              <div className="text-sm text-muted-foreground">
                {transaction.date}
              </div>
              <div className="text-sm font-medium text-foreground">
                {transaction.payor}
              </div>
              <div className="text-sm text-muted-foreground">
                {transaction.description}
              </div>
              <div className="text-xs text-muted-foreground uppercase">
                {transaction.type}
              </div>
              <div className="text-sm font-medium text-foreground text-right tabular-nums">
                {formatCurrency(transaction.amount)}
              </div>
              <div className="flex items-center gap-1.5">
                {transaction.matchStatus === "Matched" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">Matched</span>
                  </>
                ) : (
                  <span className="text-sm text-category-coral font-medium">
                    Needs Match
                  </span>
                )}
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
      </motion.div>

      {/* Manual Match Drawer */}
      <ManualMatchDrawer
        transaction={selectedTransaction}
        open={matchDrawerOpen}
        onClose={() => setMatchDrawerOpen(false)}
      />
    </>
  );
}
