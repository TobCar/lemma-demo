"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";

// We would need to find a way to store the number of steps in useOnboarding() when we have more forms
const TOTAL_STEPS = 6;

export function OnboardingProgressBar() {
  const { currentStep } = useOnboarding();

  // Calculate progress percentage
  const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="h-1 bg-border">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
