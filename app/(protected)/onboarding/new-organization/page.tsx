"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { OrganisationStep1 } from "@/components/onboarding/steps/OrganisationStep1";
import { OrganisationStep2 } from "@/components/onboarding/steps/OrganisationStep2";
import { OrganisationStep3 } from "@/components/onboarding/steps/OrganisationStep3";
import { LeadershipStep } from "@/components/onboarding/steps/LeadershipStep";
import { OwnershipStep } from "@/components/onboarding/steps/OwnershipStep";
import { ReviewStep } from "@/components/onboarding/steps/ReviewStep";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";

const stepOrder = [
  OrganisationStep1,
  OrganisationStep2,
  OrganisationStep3,
  LeadershipStep,
  OwnershipStep,
  ReviewStep,
];

export default function NewOrganizationPage() {
  const { currentStep, isComplete } = useOnboarding();

  if (isComplete) {
    return <SuccessScreen />;
  }

  const StepComponent = stepOrder[currentStep] ?? stepOrder[0];
  return <StepComponent />;
}
