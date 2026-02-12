import { Suspense } from "react";
import { MailboxList } from "@/components/mailbox/MailboxList";

export default function MailboxDefault() {
  return (
    <Suspense>
      <MailboxList />
    </Suspense>
  );
}
