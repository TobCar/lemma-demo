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
  ss4FileKey: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

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

  if (body.ss4FileKey) {
    // TODO: Verify the S3 key exists and belongs to this user
    console.log("SS-4 file uploaded to S3:", body.ss4FileKey);
  }

  const { data: entityId, error: entityError } = await supabase.rpc(
    "create_legal_entity_with_owner",
    {
      entity_name: body.legalBusinessName,
      entity_structure: body.organizationType,
      entity_npi: body.practiceNpi,
      entity_website: body.url || null,
      entity_business_phone: body.businessPhone || null,
      entity_naics_code: body.naicsCode || null,
    },
  );

  if (entityError) {
    return safeErrorResponse(entityError.message, 500);
  }

  const { error: termsError } = await supabase.from("term_acceptances").insert({
    legal_entity_id: entityId,
    tos_version: "included_all_25_pct_ownership_march_2026",
    ip_address: body.ipAddress || null,
  });

  if (termsError) {
    return safeErrorResponse(termsError.message, 500);
  }

  return NextResponse.json({ id: entityId });
}
