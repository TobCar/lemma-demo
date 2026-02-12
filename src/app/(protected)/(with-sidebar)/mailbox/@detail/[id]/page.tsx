import { Suspense } from "react";
import { MailDetailShell } from "@/components/mailbox/MailDetailShell";
import { MailDetailBody } from "@/components/mailbox/MailDetailBody";
import { MailDetailSkeleton } from "@/components/mailbox/MailDetailSkeleton";

export default async function MailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <MailDetailShell>
      <Suspense fallback={<MailDetailSkeleton />}>
        <MailDetailBody id={id} />
      </Suspense>
    </MailDetailShell>
  );
}
