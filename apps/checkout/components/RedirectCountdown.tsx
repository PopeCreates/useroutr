"use client";

import { useEffect, useState } from "react";

interface RedirectCountdownProps {
  seconds: number;
  onComplete: () => void;
}

export function RedirectCountdown({ seconds, onComplete }: RedirectCountdownProps) {
  const [remaining, setRemaining] = useState(seconds);
  const progress = ((seconds - remaining) / seconds) * 100;

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-muted-foreground">
        Redirecting in {remaining}s...
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
