import { Suspense } from "react";
import { AvatarMenu } from "./AvatarMenu";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarLetter } from "@/components/ui/avatar";

async function UserInitials() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const name = user?.user_metadata?.full_name ?? user?.email;
    return <>{name ? name.charAt(0).toUpperCase() : ""}</>;
  } catch {
    return <></>;
  }
}

export function AvatarButton() {
  return (
    <AvatarMenu>
      <Avatar className="ml-2 h-8 w-8 cursor-pointer ring-1 ring-border">
        <AvatarLetter className="bg-card text-foreground text-xs font-bold">
          <Suspense fallback="">
            <UserInitials />
          </Suspense>
        </AvatarLetter>
      </Avatar>
    </AvatarMenu>
  );
}
