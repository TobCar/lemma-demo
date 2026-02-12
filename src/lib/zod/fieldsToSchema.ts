import { z } from "zod";
import type { FieldDef, FieldRow } from "@/components/onboarding/fields";
import {
  zodPhone,
  zodSSN,
  zodEIN,
  zodNPI,
  zodZip,
  zodEmail,
  zodUrl,
  zodAddress,
} from "./formats";

const FORMAT_SCHEMAS: Record<string, z.ZodTypeAny> = {
  phone: zodPhone,
  ssn: zodSSN,
  ein: zodEIN,
  npi: zodNPI,
  zip: zodZip,
};

function schemaForDef(def: FieldDef): z.ZodTypeAny | null {
  switch (def.type) {
    case "shield-banner":
      return null;

    case "text": {
      const base = (def.format && FORMAT_SCHEMAS[def.format]) ?? z.string().min(1, `${def.label} is required`);
      return def.required ? base : base.optional();
    }

    case "dropdown": {
      const values = def.options.map((o) => o.value) as [string, ...string[]];
      const base = z.enum(values, {
        error: `${def.label} is required`,
      });
      return def.required ? base : base.optional();
    }

    case "email":
      return def.required ? zodEmail : zodEmail.optional();

    case "url":
      return zodUrl.optional();

    case "address":
      return def.required ? zodAddress : zodAddress.optional();

    case "date": {
      const base = z.coerce.date();
      return def.required ? base : base.optional();
    }
  }
}

export function fieldsToSchema(
  fields: FieldRow[],
  options?: { keyMap?: Record<string, string> },
) {
  const shape: Record<string, z.ZodTypeAny> = {};
  const reverseMap: Record<string, string> = {};

  if (options?.keyMap) {
    for (const [apiKey, defKey] of Object.entries(options.keyMap)) {
      reverseMap[defKey] = apiKey;
    }
  }

  for (const row of fields) {
    for (const def of row) {
      const schema = schemaForDef(def);
      if (!schema) continue;
      const outputKey = reverseMap[def.key] ?? def.key;
      shape[outputKey] = schema;
    }
  }

  return z.object(shape);
}
