"use client";

import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function MailDetailShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Sheet open onOpenChange={() => router.push("/mailbox")}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetTitle className="sr-only">Mail Detail</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  );
}
