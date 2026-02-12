"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, ChevronRight, Download, FileOutput } from "lucide-react";
import { Transaction } from "@/data/transactions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface TransactionDetailProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetail({ transaction, open, onClose }: TransactionDetailProps) {
  const [metadataOpen, setMetadataOpen] = useState(false);

  if (!transaction) return null;

  const isCredit = transaction.amount > 0;
  const transactionType = isCredit ? `${transaction.type} Credit` : `${transaction.type} Debit`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div>
            <SheetTitle className="text-xl font-semibold">Transaction Details</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">{transactionType}</p>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction Type</span>
                <span className="text-sm font-medium text-foreground">{transactionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-foreground">{transaction.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className={cn(
                  "text-sm font-semibold",
                  isCredit ? "text-success" : "text-foreground"
                )}>
                  ${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Currency</span>
                <span className="text-sm font-medium text-foreground">USD</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Timing Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Timing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Settlement Date</span>
                <span className="text-sm text-foreground">{transaction.settlementDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posting Date</span>
                <span className="text-sm text-foreground">{transaction.postingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Funds Available Date</span>
                <span className="text-sm text-foreground">{transaction.fundsAvailableDate}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payer Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Payer
            </h3>
            <p className="text-sm font-medium text-foreground">{transaction.payer}</p>
          </div>

          <Separator className="my-6" />

          {/* Receiving Account Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Receiving Account
            </h3>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Deposited To</span>
              <span className="text-sm font-medium text-foreground">{transaction.depositedTo}</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ACH Reference Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              {transaction.type} Reference
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trace Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">{transaction.traceNumber}</span>
                  <button
                    onClick={() => copyToClipboard(transaction.traceNumber, "Trace Number")}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Addenda Text</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">{transaction.addendaText}</span>
                  <button
                    onClick={() => copyToClipboard(transaction.addendaText, "Addenda Text")}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Technical Metadata Section */}
          <Collapsible open={metadataOpen} onOpenChange={setMetadataOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-secondary/50 -mx-2 px-2 rounded-lg transition-colors">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Technical Metadata
              </h3>
              <ChevronRight className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                metadataOpen && "rotate-90"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-foreground">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Channel</span>
                  <span className="text-foreground">{transaction.type}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 space-y-3">
          <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
            <Download className="h-4 w-4 mr-2" />
            Download Documents
          </Button>
          <Button variant="outline" className="w-full">
            <FileOutput className="h-4 w-4 mr-2" />
            Export Transaction
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
