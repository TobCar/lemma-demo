"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { OrganizationProfile } from "@/components/onboarding/steps/OrganizationProfile";
import { OrganizationDetails } from "@/components/onboarding/steps/OrganizationDetails";
import { OrganizationContact } from "@/components/onboarding/steps/OrganizationContact";
import { LeadershipStep } from "@/components/onboarding/steps/LeadershipStep";
import { OwnershipStep } from "@/components/onboarding/steps/OwnershipStep";
import { ReviewStep } from "@/components/onboarding/steps/ReviewStep";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";

const stepOrder = [
  OrganizationProfile,
  OrganizationDetails,
  OrganizationContact,
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
