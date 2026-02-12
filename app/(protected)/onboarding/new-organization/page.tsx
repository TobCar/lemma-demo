"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { OrganisationProfile } from "@/components/onboarding/steps/OrganisationProfile";
import { OrganisationDetails } from "@/components/onboarding/steps/OrganisationDetails";
import { OrganisationContact } from "@/components/onboarding/steps/OrganisationContact";
import { LeadershipStep } from "@/components/onboarding/steps/LeadershipStep";
import { OwnershipStep } from "@/components/onboarding/steps/OwnershipStep";
import { ReviewStep } from "@/components/onboarding/steps/ReviewStep";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";

const stepOrder = [
  OrganisationProfile,
  OrganisationDetails,
  OrganisationContact,
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
