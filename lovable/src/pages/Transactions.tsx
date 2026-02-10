import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { TransactionDetail } from "@/components/transactions/TransactionDetail";
import { transactions, Transaction } from "@/data/transactions";
import { cn } from "@/lib/utils";
import { TablePagination, usePagination } from "@/components/ui/table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterType = "All" | "EFT" | "Wire" | "Check" | "ACH";

const filterTypes: FilterType[] = ["All", "EFT", "Wire", "Check"];

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailOpen(true);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "EFT") return t.type === "ACH" || t.type === "EFT";
    return t.type === activeFilter.toUpperCase();
  });

  const { currentPage, totalPages, paginatedItems, goToPage, totalItems, itemsPerPage } = 
    usePagination(filteredTransactions, 10);

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your payments
            </p>
          </div>
          <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Date
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background">
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem>Custom range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                activeFilter === type
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card rounded-xl border border-border shadow-soft overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[100px_1fr_1fr_120px_150px] gap-4 px-6 py-4 border-b border-border bg-secondary/30">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Date
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Payer
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Description
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Type
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
            Amount
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
              className="grid grid-cols-[100px_1fr_1fr_120px_150px] gap-4 px-6 py-4 hover:bg-secondary/50 cursor-pointer transition-colors"
            >
              <div className="text-sm text-muted-foreground">{transaction.date}</div>
              <div className="text-sm font-medium text-foreground">{transaction.payer}</div>
              <div className="text-sm text-muted-foreground truncate">
                {transaction.description}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase">
                {transaction.type}
              </div>
              <div
                className={cn(
                  "text-sm font-medium text-right tabular-nums",
                  transaction.amount > 0 ? "text-success" : "text-foreground"
                )}
              >
                {transaction.amount > 0 ? "+" : ""}$
                {Math.abs(transaction.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
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

      {/* Transaction Detail Sheet */}
      <TransactionDetail
        transaction={selectedTransaction}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Transactions;
