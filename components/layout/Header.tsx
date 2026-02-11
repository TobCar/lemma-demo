import { Bell, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AvatarButton } from "@/components/layout/AvatarButton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-background px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions, accounts..."
          className="h-9 w-full bg-card border border-border pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring rounded-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-category-coral" />
        </button>
        <AvatarButton />
      </div>
    </header>
  );
}
