import { Suspense } from "react";
import { MailDetailShell } from "@/components/mailbox/MailDetailShell";
import { MailDetailBody } from "@/components/mailbox/MailDetailBody";
import { MailDetailSkeleton } from "@/components/mailbox/MailDetailSkeleton";

export default function MailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <MailDetailShell>
      <Suspense fallback={<MailDetailSkeleton />}>
        <MailDetailBody params={params} />
      </Suspense>
    </MailDetailShell>
  );
}
