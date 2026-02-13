import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mailItems } from "@/data/mailbox";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(mailItems);
}
