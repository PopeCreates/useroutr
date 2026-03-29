"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { WarningCircle, Headset } from "@phosphor-icons/react";
import { Button } from "@tavvio/ui";
import { ProcessingSteps } from "@/components/ProcessingSteps";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";
import { TrustBadges } from "@/components/TrustBadges";
import { MerchantBranding } from "@/components/MerchantBranding";
import { usePayment } from "@/hooks/usePayment";
import { usePaymentSocket } from "@/hooks/usePaymentSocket";
import type { PaymentStatus } from "@tavvio/types";

// Error messages mapping for specific error types
const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  QUOTE_EXPIRED: {
    title: "Quote expired",
    description:
      "The conversion rate expired. Please start the payment again.",
  },
  HTLC_TIMEOUT: {
    title: "Payment timed out",
    description:
      "Payment timed out. Your funds will be automatically refunded within 24 hours.",
  },
  INSUFFICIENT_LIQUIDITY: {
    title: "Conversion unavailable",
    description:
      "We couldn&apos;t find a conversion path for this amount. Please try a different payment method.",
  },
  NETWORK_ERROR: {
    title: "Connection lost",
    description:
      "We lost connection. Please check your internet and try again.",
  },
  WALLET_REJECTED: {
    title: "Transaction cancelled",
    description: "Transaction was cancelled in your wallet.",
  },
  DEFAULT: {
    title: "Payment failed",
    description:
      "Something went wrong with your payment. Please try again or contact support.",
  },
};

export default function ConfirmPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = use(params);
  const router = useRouter();
  const { data: payment } = usePayment(paymentId);
  const { status: socketStatus, connected } = usePaymentSocket(paymentId);

  const [currentStatus, setCurrentStatus] = useState<PaymentStatus>("SOURCE_LOCKED");
  const [errorType, setErrorType] = useState<string | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);

  // Update status from WebSocket
  useEffect(() => {
    if (socketStatus) {
      setCurrentStatus(socketStatus as PaymentStatus);
    }
  }, [socketStatus]);

  // Update status from polling (fallback)
  useEffect(() => {
    if (payment?.status) {
      setCurrentStatus(payment.status as PaymentStatus);
    }
  }, [payment?.status]);

  // Handle navigation on completion or failure
  useEffect(() => {
    if (currentStatus === "COMPLETED") {
      router.push(`/${paymentId}/success`);
    } else if (currentStatus === "FAILED") {
      // In a real scenario, the error type would come from the API/WebSocket
      setErrorType("DEFAULT");
    } else if (currentStatus === "EXPIRED") {
      router.push(`/${paymentId}/expired`);
    }
  }, [currentStatus, paymentId, router]);

  // 5-minute timeout warning
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStatus !== "COMPLETED" && currentStatus !== "FAILED") {
        setShowTimeout(true);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timer);
  }, [currentStatus]);

  const handleRetry = () => {
    // Navigate back to the payment page to restart
    router.push(`/${paymentId}`);
  };

  const handleContactSupport = () => {
    // Open support contact (could be a modal, email, or external link)
    window.open("mailto:support@tavvio.com", "_blank");
  };

  const errorInfo = errorType ? ERROR_MESSAGES[errorType] || ERROR_MESSAGES.DEFAULT : null;

  return (
    <div className="flex min-h-screen justify-center bg-muted/30 px-4 py-8 sm:px-8">
      <div className="w-full max-w-[460px] space-y-6">
        <MerchantBranding
          merchantName={payment?.merchantName ?? "Merchant"}
          merchantLogo={payment?.merchantLogo}
        />

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {/* Error State */}
          {errorInfo ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
                <WarningCircle size={40} weight="fill" className="text-red" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                {errorInfo.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {errorInfo.description}
              </p>

              {/* Refund notice for HTLC timeout */}
              {errorType === "HTLC_TIMEOUT" && (
                <div className="mt-4 rounded-lg bg-amber/10 p-3 text-left">
                  <p className="text-xs text-amber">
                    Your funds have not been charged. If funds were locked, they
                    will be automatically refunded within 24 hours.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <Button onClick={handleRetry} className="w-full">
                  Try again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleContactSupport}
                  className="w-full"
                >
                  <Headset size={16} />
                  Contact support
                </Button>
              </div>
            </div>
          ) : (
            /* Processing State */
            <div className="text-center">
              <ProcessingAnimation />
              
              <h2 className="mt-6 font-display text-lg font-semibold text-foreground">
                Confirming your payment...
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This usually takes less than 30 seconds.
              </p>

              {/* Connection status indicator */}
              {!connected && (
                <p className="mt-2 text-xs text-amber">
                  Reconnecting to server...
                </p>
              )}

              <div className="mt-6">
                <ProcessingSteps currentStatus={currentStatus} />
              </div>

              {/* Timeout Warning */}
              {showTimeout && (
                <div className="mt-6 rounded-lg border border-amber/30 bg-amber/10 p-4 text-left">
                  <p className="text-sm font-medium text-foreground">
                    Taking longer than expected
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your payment is still processing. If this continues, please
                    contact support.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactSupport}
                    className="mt-3"
                  >
                    <Headset size={14} />
                    Contact support
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}
