import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mailItems } from "@/data/mailbox";
import { getTypeIcon, formatCurrency } from "./mail-utils";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

export async function MailDetailBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Mock data lookup — replace with Supabase query later
  const mail = mailItems.find((m) => m.id === id);
  if (!mail) notFound();

  const TypeIcon = getTypeIcon(mail.type);
  const isPaymentType = mail.type === "Check" || mail.type === "Refund";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center sm:text-left px-6 py-5 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{mail.type}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Received {mail.receivedDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Document Preview */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">
            Document Preview
          </p>
          <div className="aspect-[4/5] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-secondary/20">
            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-3">
              <TypeIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Document preview</p>
            <p className="text-xs text-muted-foreground">{mail.type}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Details</p>
          <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  mail.status === "PENDING"
                    ? "text-category-amber"
                    : "text-success",
                )}
              >
                {mail.status === "PENDING" ? "Pending" : "Processed"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Sent By</span>
              <span className="text-sm text-foreground">{mail.sentBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Received Date
              </span>
              <span className="text-sm text-foreground">
                {mail.receivedDate.replace(", ", " ")} at {mail.receivedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Tracking Number
              </span>
              <span className="text-sm text-foreground">
                {mail.trackingNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Type-specific Information */}
        {isPaymentType && mail.checkNumber && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              {mail.type} Information
            </p>
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Check Number
                </span>
                <span className="text-sm text-foreground">
                  {mail.checkNumber}
                </span>
              </div>
              {mail.amount != null && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(mail.amount)}
                  </span>
                </div>
              )}
              {mail.description && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    Description
                  </span>
                  <span className="text-sm text-foreground text-right max-w-[60%]">
                    {mail.description}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {!isPaymentType && mail.description && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Document Information
            </p>
            <div className="bg-secondary/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">
                  Description
                </span>
                <span className="text-sm text-foreground text-right max-w-[60%]">
                  {mail.description}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-6 flex gap-3">
        <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </>
  );
}
