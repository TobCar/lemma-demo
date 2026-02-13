"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentDetail } from "@/components/insurance/PaymentDetail";
import { insurancePayments, InsurancePayment } from "@/data/insurancePayments";
import { cn } from "@/lib/utils";
import {
  TablePagination,
  usePagination
} from "@/components/ui/tablePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdownMenu";

type FilterType = "All" | "EFT" | "Wire" | "Check";

const filterTypes: FilterType[] = ["All", "EFT", "Wire", "Check"];

export default function InsurancePaymentsPage() {
  const [selectedPayment, setSelectedPayment] =
    useState<InsurancePayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [selectedPayor, setSelectedPayor] = useState<string>("All Payors");
  const handleRowClick = (payment: InsurancePayment) => {
    setSelectedPayment(payment);
    setDetailOpen(true);
  };

  const uniquePayors = [
    "All Payors",
    ...new Set(insurancePayments.map((p) => p.payor))
  ];

  const filteredPayments = insurancePayments.filter((p) => {
    // Filter by type
    const typeMatch = (() => {
      if (activeFilter === "All") return true;
      if (activeFilter === "EFT") return p.paymentMethod === "ACH (EFT)";
      if (activeFilter === "Wire") return p.paymentMethod === "WIRE";
      if (activeFilter === "Check") return p.paymentMethod === "CHECK";
      return true;
    })();

    // Filter by payor
    const payorMatch =
      selectedPayor === "All Payors" || p.payor === selectedPayor;

    return typeMatch && payorMatch;
  });

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    totalItems,
    itemsPerPage
  } = usePagination(filteredPayments, 10);

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
              Insurance Payments
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Insurance payments with transaction reference numbers
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
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
        <div className="grid grid-cols-[140px_1fr_140px_140px_1fr_140px] gap-4 px-6 py-4 border-b border-border">
          <div className="text-xs font-normal text-muted-foreground">
            Settlement Date
          </div>
          <div className="text-xs font-normal text-muted-foreground">Payor</div>
          <div className="text-xs font-normal text-muted-foreground">
            Payor ID
          </div>
          <div className="text-xs font-normal text-muted-foreground">
            Payment Method
          </div>
          <div className="text-xs font-normal text-muted-foreground">
            Payment Reference
          </div>
          <div className="text-xs font-normal text-muted-foreground text-right">
            Amount
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {paginatedItems.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.03 * index }}
              onClick={() => handleRowClick(payment)}
              className="grid grid-cols-[140px_1fr_140px_140px_1fr_140px] gap-4 px-6 py-4 hover:bg-secondary/50 cursor-pointer transition-colors"
            >
              <div className="text-sm text-muted-foreground">
                {payment.settlementDate}
              </div>
              <div className="text-sm font-medium text-foreground">
                {payment.payor}
              </div>
              <div className="text-sm text-muted-foreground">
                {payment.payorId}
              </div>
              <div className="text-sm text-muted-foreground">
                {payment.paymentMethod}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-muted-foreground">
                  {payment.referenceType}
                </span>
                <br />
                <span className="text-foreground">
                  {payment.paymentReference}
                </span>
              </div>
              <div className="text-sm font-medium text-foreground text-right tabular-nums">
                $
                {payment.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2
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

      {/* Payment Detail Sheet */}
      <PaymentDetail
        payment={selectedPayment}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
