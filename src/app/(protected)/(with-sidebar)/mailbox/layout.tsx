import { Suspense } from "react";

export default function MailboxLayout({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense>{detail}</Suspense>
    </>
  );
}
