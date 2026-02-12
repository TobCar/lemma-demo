"use client";

import { OnboardingProgressBar } from "./OnboardingProgressBar";

interface OnboardingHeaderProps {
  avatar: React.ReactNode;
}

export function OnboardingHeader({ avatar }: OnboardingHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center h-16 px-8">
        <div className="w-10" />
        <span className="flex-1 text-center font-bold text-[18px] text-foreground tracking-tight">
          LEMMA.
        </span>
        <div>{avatar}</div>
      </div>

      <OnboardingProgressBar />
    </header>
  );
}
