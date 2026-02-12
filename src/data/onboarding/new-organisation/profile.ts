import type { FieldRow } from "@/components/onboarding/fields";
import type { DropdownOption } from "@/components/onboarding/fields";
import { HEALTHCARE_NAICS_CODES } from "@/data/naicsCodes";
import { ORGANIZATION_TYPES } from "@/data/organizations";

export const naicsOptions: DropdownOption[] = HEALTHCARE_NAICS_CODES.map(
  (t) => ({ value: t.key, label: t.label }),
);

export const orgTypeOptions: DropdownOption[] = ORGANIZATION_TYPES.map((o) => ({
  value: o.value,
  label: o.label,
}));

export const profileFields: FieldRow[] = [
  [
    {
      type: "text",
      key: "legalBusinessName",
      label: "Organisation Name",
      placeholder: "Acme Healthcare Inc.",
      required: true,
    },
  ],
  [
    {
      type: "url",
      key: "url",
      label: "Website",
      placeholder: "https://example.com",
    },
  ],
  [
    {
      type: "dropdown",
      key: "naicsCode",
      label: "Type",
      options: naicsOptions,
      required: true,
      searchable: true,
      placeholder: "Search for your type...",
      searchPlaceholder: "Search healthcare types...",
    },
  ],
  [
    {
      type: "dropdown",
      key: "organizationType",
      label: "Organisation Structure",
      options: orgTypeOptions,
      required: true,
      searchable: true,
      placeholder: "Select your organisation structure...",
      searchPlaceholder: "Search organisation structures...",
    },
  ],
];
