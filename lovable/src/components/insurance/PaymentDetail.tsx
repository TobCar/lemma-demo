import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InsurancePayment } from "@/data/insurancePayments";
import { Separator } from "@/components/ui/separator";

interface PaymentDetailProps {
  payment: InsurancePayment | null;
  open: boolean;
  onClose: () => void;
}

export function PaymentDetail({ payment, open, onClose }: PaymentDetailProps) {
  if (!payment) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div>
            <SheetTitle className="text-xl font-semibold">Payment Details</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">{payment.paymentMethod}</p>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Settlement Date</span>
                <span className="text-sm text-foreground">{payment.settlementDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-semibold text-success">
                  ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="text-sm text-foreground">{payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction Reference Number (TRN)</span>
                <span className="text-sm text-foreground">{payment.paymentReference}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payer Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Payer
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payer Name</span>
                <span className="text-sm text-foreground">{payment.payor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payer ID</span>
                <span className="text-sm text-foreground">{payment.payorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Company Name</span>
                <span className="text-sm text-foreground">{payment.companyName}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Financial Breakdown Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Financial Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Billed Amount</span>
                <span className="text-sm text-foreground">
                  ${payment.billedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Allowed Amount</span>
                <span className="text-sm text-foreground">
                  ${payment.allowedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paid Amount</span>
                <span className="text-sm font-semibold text-success">
                  ${payment.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Provider Section */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Provider
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Provider Name</span>
                <span className="text-sm text-foreground">{payment.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">NPI</span>
                <span className="text-sm text-foreground">{payment.npi}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
