"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TrustBadges } from "@/components/TrustBadges";
import { MerchantBranding } from "@/components/MerchantBranding";
import { ErrorCard, type ErrorType } from "@/components/ErrorCard";
import { usePayment } from "@/hooks/usePayment";

export default function ErrorPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: payment } = usePayment(paymentId);

  // Get error type from search params, default to DEFAULT
  const errorType = (searchParams.get("type") as ErrorType) || "DEFAULT";

  const handleRetry = () => {
    router.push(`/${paymentId}`);
  };

  const handleContactSupport = () => {
    window.open("mailto:support@tavvio.com", "_blank");
  };

  return (
    <div className="flex min-h-screen justify-center bg-muted/30 px-4 py-8 sm:px-8">
      <div className="w-full max-w-[460px] space-y-6">
        <MerchantBranding
          merchantName={payment?.merchantName ?? "Merchant"}
          merchantLogo={payment?.merchantLogo}
        />

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <ErrorCard
            errorType={errorType}
            onRetry={handleRetry}
            onContactSupport={handleContactSupport}
          />
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}
