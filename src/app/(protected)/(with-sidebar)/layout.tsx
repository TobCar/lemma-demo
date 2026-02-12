import { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Suspense needed: usePathname() is a dynamic API that Next.js
            requires inside a Suspense boundary for partial prerendering */}
        <Suspense>
          <Sidebar />
        </Suspense>
        <div className="ml-60">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
