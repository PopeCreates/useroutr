import { WarningCircle, Headset, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@tavvio/ui";

export type ErrorType =
  | "QUOTE_EXPIRED"
  | "HTLC_TIMEOUT"
  | "INSUFFICIENT_LIQUIDITY"
  | "NETWORK_ERROR"
  | "WALLET_REJECTED"
  | "DEFAULT";

interface ErrorInfo {
  title: string;
  description: string;
  showRefundNotice?: boolean;
}

const ERROR_MESSAGES: Record<ErrorType, ErrorInfo> = {
  QUOTE_EXPIRED: {
    title: "Quote expired",
    description:
      "The conversion rate expired before payment was confirmed on-chain. Please start the payment again.",
  },
  HTLC_TIMEOUT: {
    title: "Payment timed out",
    description:
      "Payment timed out. Your funds will be automatically refunded within 24 hours.",
    showRefundNotice: true,
  },
  INSUFFICIENT_LIQUIDITY: {
    title: "Conversion unavailable",
    description:
      "We couldn't find a conversion path for this amount. Please try a different payment method.",
  },
  NETWORK_ERROR: {
    title: "Connection lost",
    description: "We lost connection. Please check your internet and try again.",
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

interface ErrorCardProps {
  errorType: ErrorType;
  onRetry: () => void;
  onContactSupport: () => void;
}

export function ErrorCard({ errorType, onRetry, onContactSupport }: ErrorCardProps) {
  const errorInfo = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.DEFAULT;

  return (
    <div className="text-center">
      {/* Error icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
        <WarningCircle size={40} weight="fill" className="text-red" />
      </div>

      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        {errorInfo.title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{errorInfo.description}</p>

      {/* Refund notice */}
      {errorInfo.showRefundNotice && (
        <div className="mt-4 rounded-lg bg-muted/50 p-4 text-left">
          <p className="text-sm text-muted-foreground">
            Your funds have not been charged. If funds were locked, they will be
            automatically refunded within 24 hours.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={onRetry} className="w-full">
          <ArrowCounterClockwise size={16} />
          Try again
        </Button>
        <Button variant="outline" onClick={onContactSupport} className="w-full">
          <Headset size={16} />
          Contact support
        </Button>
      </div>
    </div>
  );
}
