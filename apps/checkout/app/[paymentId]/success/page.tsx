"use client";

import { use, useCallback, useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "@tavvio/ui";
import { TrustBadges } from "@/components/TrustBadges";
import { MerchantBranding } from "@/components/MerchantBranding";
import { SuccessCard } from "@/components/SuccessCard";
import { RedirectCountdown } from "@/components/RedirectCountdown";
import { usePayment } from "@/hooks/usePayment";

// Extended payment interface for success page
interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  merchantName: string;
  merchantLogo?: string;
  referenceId?: string;
  redirectUrl?: string;
  customerEmail?: string;
  completedAt?: string;
}

export default function SuccessPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = use(params);
  const { data: payment } = usePayment(paymentId) as { data: PaymentDetails | undefined };
  const [showConfetti, setShowConfetti] = useState(true);

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = useCallback(() => {
    if (payment?.redirectUrl) {
      window.location.href = payment.redirectUrl;
    }
  }, [payment?.redirectUrl]);

  const handleReturnToMerchant = () => {
    if (payment?.redirectUrl) {
      window.location.href = payment.redirectUrl;
    }
  };

  // Generate reference ID from payment ID if not provided
  const referenceId = payment?.referenceId ?? `TVP-${paymentId.slice(0, 6).toUpperCase()}`;

  return (
    <div className="flex min-h-screen justify-center bg-muted/30 px-4 py-8 sm:px-8">
      {/* Confetti animation overlay */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-[confetti_3s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"][
                  Math.floor(Math.random() * 5)
                ],
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-[460px] space-y-6">
        <MerchantBranding
          merchantName={payment?.merchantName ?? "Merchant"}
          merchantLogo={payment?.merchantLogo}
        />

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            {/* Success icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 animate-[scale-in_0.3s_ease-out]">
              <CheckCircle size={40} weight="fill" className="text-green" />
            </div>

            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
              Paid!
            </h2>
          </div>

          {/* Payment details */}
          <div className="mt-6">
            {payment ? (
              <SuccessCard
                amount={payment.amount}
                currency={payment.currency}
                merchantName={payment.merchantName}
                referenceId={referenceId}
                date={payment.completedAt ? new Date(payment.completedAt) : new Date()}
              />
            ) : (
              <div className="space-y-2">
                <div className="skeleton h-8 w-32 mx-auto" />
                <div className="skeleton h-4 w-24 mx-auto" />
              </div>
            )}
          </div>

          {/* Receipt notification */}
          {payment?.customerEmail && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              A receipt has been sent to{" "}
              <span className="font-medium text-foreground">
                {payment.customerEmail}
              </span>
            </p>
          )}

          {/* Return button */}
          {payment?.redirectUrl && (
            <div className="mt-6 space-y-4">
              <Button
                onClick={handleReturnToMerchant}
                className="w-full"
              >
                Return to merchant
              </Button>
              <RedirectCountdown seconds={5} onComplete={handleRedirect} />
            </div>
          )}

          {/* No redirect URL - just show done message */}
          {payment && !payment.redirectUrl && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              You can safely close this window.
            </p>
          )}
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}
