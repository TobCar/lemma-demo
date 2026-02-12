import type { FieldRow } from "@/components/onboarding/fields";

export const contactFields: FieldRow[] = [
  [
    {
      type: "address",
      key: "address",
      label: "Address",
      required: true,
      description:
        "Physical street addresses only. P.O. Boxes are not permitted by our banking partner.",
    },
  ],
  [
    {
      type: "email",
      key: "businessEmail",
      label: "Business email",
      placeholder: "contact@yourpractice.com",
      required: true,
    },
  ],
  [
    {
      type: "text",
      key: "businessPhone",
      label: "Business phone number",
      format: "phone",
      placeholder: "(555) 123-4567",
      required: true,
    },
  ],
];
