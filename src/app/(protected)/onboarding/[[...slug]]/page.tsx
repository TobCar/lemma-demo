import { redirect, RedirectType } from "next/navigation";

// Redirect if you land in `/onboarding/*` but your exact URL is wrong
export default function OnboardingCatchAll() {
  redirect("/onboarding/new-organization", RedirectType.replace);
}
