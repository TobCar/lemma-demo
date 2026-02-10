"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Wallet,
  Mail,
  RefreshCcw,
  FileCheck,
  TrendingUp,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Receipt, label: "Transactions", href: "/transactions" },
  { icon: ShieldCheck, label: "Insurance Payments", href: "/insurance" },
  { icon: Wallet, label: "Accounts", href: "/accounts" },
  { icon: Mail, label: "Digital Mailbox", href: "/mailbox" },
  { icon: RefreshCcw, label: "Cash Sweeps", href: "/sweeps" },
  // Hidden for now - pages still exist
  // { icon: FileCheck, label: "Claim Reconciliation", href: "/claims" },
  // { icon: TrendingUp, label: "Capital", href: "/capital" },
  { icon: Link2, label: "Connections", href: "/connections" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold tracking-widest text-foreground">
              LEMMA.
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 pt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                  isActive
                    ? "font-semibold text-foreground"
                    : "font-medium text-sidebar-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    isActive ? "text-foreground" : "text-sidebar-foreground group-hover:text-foreground"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
