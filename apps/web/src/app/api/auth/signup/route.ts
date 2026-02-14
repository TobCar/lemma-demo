import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeErrorResponse } from "@/lib/api/errors";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  ipAddress: z.string(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return safeErrorResponse("Invalid request body", 400);
  }

  const result = signUpSchema.safeParse(rawBody);
  if (!result.success) {
    const messages = result.error.issues.map((e) => e.message);
    return safeErrorResponse(`Validation failed: ${messages.join(", ")}`, 400);
  }

  const { email, password, ipAddress } = result.data;

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${request.headers.get("origin")}/onboarding/new-organization`,
    },
  });

  if (signUpError) {
    return safeErrorResponse(signUpError.message, 400);
  }

  const { error: termsError } = await supabase.from("term_acceptances").insert({
    tos_version: "signup_tos_march_2026",
    ip_address: ipAddress,
    legal_entity_id: null,
  });

  if (termsError) {
    return safeErrorResponse(termsError.message, 500);
  }

  return NextResponse.json({ success: true });
}
