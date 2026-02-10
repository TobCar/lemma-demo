import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { ClaimTransaction, claimsToMatch, ClaimToMatch } from "@/data/claims";
import { cn } from "@/lib/utils";

interface ManualMatchDrawerProps {
  transaction: ClaimTransaction | null;
  open: boolean;
  onClose: () => void;
}

export function ManualMatchDrawer({ transaction, open, onClose }: ManualMatchDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<ClaimToMatch | null>(null);

  if (!transaction) return null;

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const filteredClaims = claimsToMatch.filter((claim) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      claim.claimId.toLowerCase().includes(query) ||
      claim.patientId.toLowerCase().includes(query) ||
      claim.amount.toString().includes(query)
    );
  });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="text-xl font-semibold">Manual Match</SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Unmatched Transaction */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">Unmatched Transaction</p>
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payor</span>
                <span className="text-sm font-medium text-foreground">{transaction.payor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm text-foreground">{transaction.date}, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Search Claims */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Search Claims to Match</p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by claim ID, patient ID, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            {/* Claims List */}
            <div className="space-y-2">
              {filteredClaims.map((claim) => (
                <button
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className={cn(
                    "w-full p-4 rounded-lg text-left transition-colors flex items-center justify-between",
                    selectedClaim?.id === claim.id
                      ? "bg-accent/10 border border-accent"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{claim.claimId}</p>
                      <p className="text-xs text-muted-foreground">Patient ID: {claim.patientId}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(claim.amount)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
