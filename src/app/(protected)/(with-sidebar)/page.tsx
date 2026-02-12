import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { PromoBanner } from "@/components/dashboard/PromoBanner";
import { SpendingWidget } from "@/components/dashboard/SpendingWidget";
import { AccountsList } from "@/components/dashboard/AccountsList";

export default function DashboardPage() {
  return (
    <>
      <WelcomeHeader />

      {/* Two-column layout: Main content + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left column - Balance card */}
        <div className="space-y-6">
          <BalanceChart />
        </div>

        {/* Right column - Stacked widgets */}
        <div className="space-y-4">
          <PromoBanner />
          <SpendingWidget />
          <AccountsList />
        </div>
      </div>
    </>
  );
}
