import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useLogout() {
  const router = useRouter();

  return async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "local" });
    router.push("/auth/login");
  };
}
