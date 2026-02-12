import { AvatarButton } from "@/components/layout/AvatarButton";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-background px-6">
      <div></div>
      <div className="flex items-center gap-1">
        <AvatarButton />
      </div>
    </header>
  );
}
