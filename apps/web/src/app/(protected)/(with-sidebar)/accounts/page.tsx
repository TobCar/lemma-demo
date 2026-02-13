"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountDetail } from "@/components/accounts/AccountDetail";
import { accounts, Account } from "@/data/accounts";
import {
  TablePagination,
  usePagination
} from "@/components/ui/tablePagination";

export default function AccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleRowClick = (account: Account) => {
    setSelectedAccount(account);
    setDetailOpen(true);
  };

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    totalItems,
    itemsPerPage
  } = usePagination(accounts, 10);

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
            <h1 className="text-2xl font-semibold text-foreground">Accounts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Virtual accounts and lockboxes for payment management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Account
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card rounded-xl border border-border shadow-soft overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_140px_180px_150px_100px] gap-4 px-6 py-4 border-b border-border">
          <div className="text-xs font-normal text-muted-foreground">
            Account Name
          </div>
          <div className="text-xs font-normal text-muted-foreground">
            Identifier
          </div>
          <div className="text-xs font-normal text-muted-foreground">Type</div>
          <div className="text-xs font-normal text-muted-foreground">
            Assigned to
          </div>
          <div className="text-xs font-normal text-muted-foreground text-right">
            Balance
          </div>
          <div className="text-xs font-normal text-muted-foreground text-right">
            Status
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {paginatedItems.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.03 * index }}
              onClick={() => handleRowClick(account)}
              className="grid grid-cols-[1fr_120px_140px_180px_150px_100px] gap-4 px-6 py-4 hover:bg-secondary/50 cursor-pointer transition-colors"
            >
              <div className="text-sm font-medium text-foreground">
                {account.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {account.identifier}
              </div>
              <div className="text-sm text-muted-foreground">
                {account.type}
              </div>
              <div className="text-sm text-category-blue">
                {account.assignedTo}
              </div>
              <div className="text-sm font-semibold text-foreground text-right tabular-nums">
                {formatCurrency(account.balance)}
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {account.status}
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

      {/* Account Detail Sheet */}
      <AccountDetail
        account={selectedAccount}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
