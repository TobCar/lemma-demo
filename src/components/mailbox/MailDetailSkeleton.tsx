import { cn } from "@/lib/utils";

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
      {["Status", "Sent By", "Received Date", "Tracking Number"].map(
        (label) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{label}</span>
            <SkeletonLine className="h-4 w-28" />
          </div>
        ),
      )}
    </div>
  );
}

export function MailDetailSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center sm:text-left px-6 py-5 border-b border-border">
        <div>
          <SkeletonLine className="h-6 w-28" />
          <div className="mt-1">
            <SkeletonLine className="h-4 w-44" />
          </div>
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
            <SkeletonLine className="h-12 w-12 rounded-lg mb-3" />
            <SkeletonLine className="h-4 w-32" />
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Details</p>
          <div className="bg-secondary/30 rounded-lg p-4">
            <DetailsRowsSkeleton />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-6 flex gap-3">
        <SkeletonLine className="flex-1 h-10 rounded-md" />
        <SkeletonLine className="flex-1 h-10 rounded-md" />
      </div>
    </>
  );
}
