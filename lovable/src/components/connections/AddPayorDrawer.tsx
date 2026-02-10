import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddPayorDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AddPayorDrawer({ open, onClose }: AddPayorDrawerProps) {
  const [payorName, setPayorName] = useState("");
  const [connectionMethod, setConnectionMethod] = useState<"self" | "delegate">("self");

  const handleClose = () => {
    setPayorName("");
    setConnectionMethod("self");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div>
            <SheetTitle className="text-xl font-semibold">Add New Payor</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Connect a new insurance payer to your Lemma account
            </p>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Payor Name
            </label>
            <Input
              placeholder="e.g., Aetna, Blue Cross Blue Shield"
              value={payorName}
              onChange={(e) => setPayorName(e.target.value)}
              className="bg-background"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              How would you like to connect?
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setConnectionMethod("self")}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all border-2",
                  connectionMethod === "self"
                    ? "border-foreground bg-secondary/30"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      connectionMethod === "self" ? "border-foreground" : "border-muted-foreground"
                    )}
                  >
                    {connectionMethod === "self" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">I'll connect myself</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      I have the payer portal credentials and will submit the ERA enrollment and
                      account update forms
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setConnectionMethod("delegate")}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all border-2",
                  connectionMethod === "delegate"
                    ? "border-foreground bg-secondary/30"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      connectionMethod === "delegate" ? "border-foreground" : "border-muted-foreground"
                    )}
                  >
                    {connectionMethod === "delegate" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Delegate to Lemma</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Lemma will handle the entire connection process including ERA enrollment,
                      virtual account updates, and lockbox setup
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!payorName}
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            Add Payor
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
