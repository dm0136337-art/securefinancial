import { Suspense } from "react";

import { FinancialDemo } from "@/components/financial-demo";

async function LoginPageWithReason({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  return <FinancialDemo page="login" redirectReason={reason} />;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  return (
    <Suspense fallback={<FinancialDemo page="login" />}>
      <LoginPageWithReason searchParams={searchParams} />
    </Suspense>
  );
}
