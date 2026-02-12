import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeErrorResponse } from "@/lib/api/errors";
import { fieldsToSchema, zodEmail, zodAddress } from "@/lib/zod";
import { profileFields } from "@/data/onboarding/new-organization/profile";
import { detailsOrgNpiField } from "@/data/onboarding/new-organization/details";
import { contactFields } from "@/data/onboarding/new-organization/contact";
import { z } from "zod";

const createLegalEntitySchema = fieldsToSchema([
  ...profileFields,
  ...detailsOrgNpiField,
  ...contactFields,
]).extend({
  ipAddress: z.string().optional(),
  businessEmail: zodEmail.optional(),
  address: zodAddress.optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return safeErrorResponse("Invalid request body", 400);
  }

  const result = createLegalEntitySchema.safeParse(rawBody);
  if (!result.success) {
    const messages = result.error.issues.map((e) => e.message);
    return safeErrorResponse(`Validation failed: ${messages.join(", ")}`, 400);
  }

  const body = result.data;

  const { data: entity, error: entityError } = await supabase
    .from("legal_entities")
    .insert({
      name: body.legalBusinessName,
      website: body.url || null,
      business_phone: body.businessPhone || null,
      structure: body.organizationType,
      npi: body.practiceNpi,
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
