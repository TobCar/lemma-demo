"use client";

import { OnboardingProgressBar } from "./OnboardingProgressBar";

interface OnboardingHeaderProps {
  avatar: React.ReactNode;
}

export function OnboardingHeader({ avatar }: OnboardingHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-end h-16 px-8">
        {avatar}
      </div>

      <OnboardingProgressBar />
    </header>
  );
}
