"use client";

import { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, ClipboardList, Settings } from "lucide-react";
import { MailItem, MailType } from "@/data/mailbox";
import { cn } from "@/lib/utils";

interface MailDetailProps {
  mail: MailItem | null;
  open: boolean;
  onClose: () => void;
}

const getTypeIcon = (type: MailType) => {
  switch (type) {
    case "Check":
    case "Refund":
      return DollarSign;
    case "EOB":
      return FileText;
    case "Medical Records":
      return ClipboardList;
    case "Other":
      return Settings;
    default:
      return FileText;
  }
};

export function MailDetail({ mail, open, onClose }: MailDetailProps) {
  // Render the sheet immediately; show skeletons while `mail` is loading.
  const TypeIcon = mail ? getTypeIcon(mail.type) : FileText;
  const isPaymentType = mail
    ? mail.type === "Check" || mail.type === "Refund"
    : false;

  const formatCurrency = (value?: number) =>
    value == null
      ? "—"
      : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div>
            <SheetTitle className="text-xl font-semibold">
              {mail ? mail.type : <SkeletonLine className="h-6 w-28" />}
            </SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {mail ? (
                <>Received {mail.receivedDate}</>
              ) : (
                <SkeletonLine className="h-4 w-44" />
              )}
            </p>
          </div>
        </SheetHeader>

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
              <p className="text-xs text-muted-foreground">
                {mail ? mail.type : "—"}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Details</p>
            <Suspense fallback={<DetailsRowsSkeleton />}>
              <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                {mail ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
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
                      <span className="text-sm text-muted-foreground">
                        Sent By
                      </span>
                      <span className="text-sm text-foreground">
                        {mail.sentBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Received Date
                      </span>
                      <span className="text-sm text-foreground">
                        {mail.receivedDate.replace(", ", " ")} at{" "}
                        {mail.receivedTime}
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
                  </>
                ) : (
                  <DetailsRowsSkeleton />
                )}
              </div>
            </Suspense>
          </div>

          {/* Type-specific Information */}
          {mail && isPaymentType && mail.checkNumber && (
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
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
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

          {mail && !isPaymentType && mail.description && (
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
            Download
          </Button>
          <Button variant="outline" className="flex-1">
            Share
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded bg-secondary/30 relative overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 animate-pulse" />
    </div>
  );
}

function DetailsRowsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Status</span>
        <SkeletonLine className="h-4 w-20" />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Sent By</span>
        <SkeletonLine className="h-4 w-28" />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Received Date</span>
        <SkeletonLine className="h-4 w-36" />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Tracking Number</span>
        <SkeletonLine className="h-4 w-32" />
      </div>
    </div>
  );
}
