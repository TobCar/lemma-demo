import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeErrorResponse } from "@/lib/api/errors";
import { VALID_STRUCTURES } from "@/data/organizations";
import type { CreateLegalEntityRequest } from "@/types/onboarding";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateLegalEntityRequest;
  try {
    body = await request.json();
  } catch {
    return safeErrorResponse("Invalid request body", 400);
  }

  if (!VALID_STRUCTURES.has(body.structure)) {
    return safeErrorResponse(`Invalid structure: ${body.structure}`, 400);
  }

  const { data: entity, error: entityError } = await supabase
    .from("legal_entities")
    .insert({
      name: body.name,
      website: body.website || null,
      business_phone: body.businessPhone || null,
      structure: body.structure,
      npi: body.npi,
      naics_code: body.naicsCode || null,
      owner_user_id: user.id,
    })
    .select("id")
    .single();

  if (entityError) {
    return safeErrorResponse(entityError.message, 500);
  }

  const { error: termsError } = await supabase.from("term_acceptances").insert({
    legal_entity_id: entity.id,
    ip_address: body.ipAddress || null,
  });

  if (termsError) {
    return safeErrorResponse(termsError.message, 500);
  }

  return NextResponse.json({ id: entity.id });
}
