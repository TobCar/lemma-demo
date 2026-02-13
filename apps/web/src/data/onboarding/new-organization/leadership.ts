import type { FieldRow } from "@/components/onboarding/fields";

export const leadershipFields: FieldRow[] = [
  [
    {
      type: "text",
      key: "name",
      label: "Legal name",
      placeholder: "Full legal name",
      required: true,
    },
  ],
  [
    {
      type: "text",
      key: "title",
      label: "Title",
      placeholder: "e.g. CEO, President, Managing Director",
    },
  ],
  [
    {
      type: "date",
      key: "dateOfBirth",
      label: "Date of birth",
      required: true,
      minAge: 18,
    },
    {
      type: "text",
      key: "ssn",
      label: "Tax ID (SSN or ITIN)",
      format: "ssn",
      placeholder: "123-45-6789",
      required: true,
    },
  ],
  [
    {
      type: "shield-banner",
      key: "ssn-notice",
      text: "Your SSN is encrypted and used only for identity verification. It will not affect your credit score.",
    },
  ],
  [{ type: "address", key: "address", label: "Home address", required: true }],
];
