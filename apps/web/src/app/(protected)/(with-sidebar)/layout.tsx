import { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Suspense>
          <Sidebar />
        </Suspense>
        <div className="ml-60">
          <main className="p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
