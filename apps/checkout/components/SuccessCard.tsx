interface SuccessCardProps {
  amount: number;
  currency: string;
  merchantName: string;
  referenceId: string;
  date: Date;
}

export function SuccessCard({
  amount,
  currency,
  merchantName,
  referenceId,
  date,
}: SuccessCardProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <div className="space-y-4">
      {/* Amount and merchant */}
      <div className="text-center">
        <p className="font-mono text-3xl font-bold text-foreground">
          {formattedAmount}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">to {merchantName}</p>
      </div>

      {/* Transaction details */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Reference</span>
          <span className="font-mono text-xs text-foreground">{referenceId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date</span>
          <span className="text-foreground">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
