"use client";

import { Check, Circle, SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@tavvio/ui";
import type { PaymentStatus } from "@tavvio/types";

interface Step {
  id: string;
  label: string;
  statuses: PaymentStatus[];
}

const STEPS: Step[] = [
  {
    id: "received",
    label: "Payment received",
    statuses: ["SOURCE_LOCKED", "STELLAR_LOCKED", "PROCESSING", "COMPLETED"],
  },
  {
    id: "converting",
    label: "Converting assets",
    statuses: ["STELLAR_LOCKED", "PROCESSING", "COMPLETED"],
  },
  {
    id: "settling",
    label: "Settling to merchant",
    statuses: ["PROCESSING", "COMPLETED"],
  },
];

interface ProcessingStepsProps {
  currentStatus: PaymentStatus;
}

export function ProcessingSteps({ currentStatus }: ProcessingStepsProps) {
  const getStepState = (step: Step): "complete" | "active" | "pending" => {
    if (currentStatus === "COMPLETED") {
      return "complete";
    }
    if (step.statuses.includes(currentStatus)) {
      // If this step includes the current status, check if it's the last matching step
      const currentStepIndex = STEPS.findIndex((s) =>
        s.statuses.includes(currentStatus) && !STEPS.slice(STEPS.indexOf(s) + 1).some((ns) => ns.statuses.includes(currentStatus) && ns.statuses.indexOf(currentStatus) === 0)
      );
      const stepIndex = STEPS.indexOf(step);
      
      if (stepIndex < currentStepIndex) {
        return "complete";
      }
      if (stepIndex === currentStepIndex) {
        return "active";
      }
    }
    
    // Simplified logic: if the step's first status has been passed
    const statusOrder: PaymentStatus[] = [
      "PENDING",
      "QUOTE_LOCKED",
      "SOURCE_LOCKED",
      "STELLAR_LOCKED",
      "PROCESSING",
      "COMPLETED",
    ];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepFirstStatusIndex = statusOrder.indexOf(step.statuses[0]);
    
    if (currentIndex > stepFirstStatusIndex) {
      return "complete";
    }
    if (currentIndex === stepFirstStatusIndex || step.statuses.includes(currentStatus)) {
      return "active";
    }
    return "pending";
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="space-y-3">
        {STEPS.map((step) => {
          const state = getStepState(step);
          
          return (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                  state === "complete" && "bg-green text-white",
                  state === "active" && "bg-primary/10 text-primary",
                  state === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {state === "complete" && <Check size={12} weight="bold" />}
                {state === "active" && (
                  <SpinnerGap size={12} weight="bold" className="animate-spin" />
                )}
                {state === "pending" && <Circle size={8} weight="fill" />}
              </div>
              <span
                className={cn(
                  "text-sm transition-colors",
                  state === "complete" && "text-foreground",
                  state === "active" && "font-medium text-foreground",
                  state === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
