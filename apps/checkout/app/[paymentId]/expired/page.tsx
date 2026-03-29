"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@tavvio/ui";
import { TrustBadges } from "@/components/TrustBadges";
import { MerchantBranding } from "@/components/MerchantBranding";
import { usePayment } from "@/hooks/usePayment";

interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  merchantName: string;
  merchantLogo?: string;
  redirectUrl?: string;
}

export default function ExpiredPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = use(params);
  const router = useRouter();
  const { data: payment } = usePayment(paymentId) as { data: PaymentDetails | undefined };

  const handleReturnToMerchant = () => {
    if (payment?.redirectUrl) {
      window.location.href = payment.redirectUrl;
    } else {
      // Fallback to payment page to request new link
      router.push(`/${paymentId}`);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-muted/30 px-4 py-8 sm:px-8">
      <div className="w-full max-w-[460px] space-y-6">
        <MerchantBranding
          merchantName={payment?.merchantName ?? "Merchant"}
          merchantLogo={payment?.merchantLogo}
        />

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            {/* Expired icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber/10">
              <Clock size={40} weight="fill" className="text-amber" />
            </div>

            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              Payment Expired
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This payment session has expired. Please contact the merchant for a
              new payment link.
            </p>

            {/* Helpful info */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4 text-left">
              <p className="text-sm text-muted-foreground">
                Payment sessions expire after a set time to ensure accurate
                conversion rates. No funds have been charged.
              </p>
            </div>

            {/* Return button */}
            <Button
              variant="outline"
              onClick={handleReturnToMerchant}
              className="mt-6 w-full"
            >
              <ArrowLeft size={16} />
              Return to merchant
            </Button>
          </div>
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}
