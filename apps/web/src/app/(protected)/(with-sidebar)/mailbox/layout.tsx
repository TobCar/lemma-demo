import { Suspense } from "react";
import { MailboxList } from "@/components/mailbox/MailboxList";

export default function MailboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense>
        <MailboxList />
      </Suspense>
      {children}
    </>
  );
}
