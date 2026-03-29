"use client";

import { cn } from "@tavvio/ui";

interface ProcessingAnimationProps {
  className?: string;
}

export function ProcessingAnimation({ className }: ProcessingAnimationProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[pulse_2s_ease-in-out_infinite]" />
        
        {/* Middle rotating ring */}
        <div className="absolute inset-2 rounded-full border-2 border-primary/30 border-t-primary animate-[spin_1.5s_linear_infinite]" />
        
        {/* Inner solid circle with subtle pulse */}
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <div className="h-4 w-4 rounded-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
