import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { AvatarButton } from "@/components/layout/AvatarButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen w-full bg-background">
        <OnboardingHeader avatar={<AvatarButton />} />

        <main className="flex justify-center min-h-[calc(100vh-68px)]">
          <div className="w-full max-w-2xl flex items-start justify-center px-6 py-12 lg:py-16">
            <div className="w-full max-w-[520px] animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </OnboardingProvider>
  );
}
