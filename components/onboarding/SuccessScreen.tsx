import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SuccessScreen() {
  return (
    <div className="bg-background justify-center p-8">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Title */}
        <h1 className="text-[28px] font-medium text-foreground tracking-tight mb-2">
          Application Submitted
        </h1>
        <p className="text-[15px] text-muted-foreground mb-8">
          Your business verification is now in progress.
        </p>

        {/* Status card */}
        <div className="bg-muted/30 border border-border rounded-lg p-5 mb-8 text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-[15px] mb-1">
                Verification Pending
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                We're reviewing your information. This typically takes 1-2
                business days. We'll notify you via email once your account is
                ready.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-muted/30 border border-border rounded-lg p-5 text-left mb-8">
          <h3 className="font-medium text-foreground text-[14px] mb-4">
            What happens next?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-medium text-primary-foreground">
                  1
                </span>
              </div>
              <span className="text-[14px] text-muted-foreground">
                Our compliance team reviews your submitted documents
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-medium text-primary-foreground">
                  2
                </span>
              </div>
              <span className="text-[14px] text-muted-foreground">
                We verify beneficial owner information
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-medium text-primary-foreground">
                  3
                </span>
              </div>
              <span className="text-[14px] text-muted-foreground">
                Your Lemma account will be activated and ready to use
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="btn-secondary w-full h-12"
            asChild
          >
            <Link href="/">
              Explore the Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
