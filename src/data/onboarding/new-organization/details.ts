import type { FieldRow } from "@/components/onboarding/fields";
import { US_STATES } from "@/data/usStates";

export const stateOptions = US_STATES.map((s) => ({
  value: s.value,
  label: s.label,
}));

export const detailsBaseFields: FieldRow[] = [
  [
    {
      type: "dropdown",
      key: "incorporationState",
      label: "State of Incorporation",
      options: stateOptions,
      required: true,
      placeholder: "Select a state",
    },
  ],
  [
    {
      type: "text",
      key: "ein",
      label: "Tax ID (EIN)",
      placeholder: "12-3456789",
      format: "ein",
      required: true,
      description: "This must match the IRS SS-4 letter for your practice.",
    },
  ],
];

export const detailsOrgNpiField: FieldRow[] = [
  [
    {
      type: "text",
      key: "practiceNpi",
      label: "Organizational NPI (Type 2)",
      placeholder: "1234567890",
      format: "npi",
      required: true,
      description:
        "This is the 10-digit National Provider Identifier assigned to your group practice or Organization. Do not use your personal (Type 1) NPI.",
    },
  ],
];

export const detailsIndividualNpiField: FieldRow[] = [
  [
    {
      type: "text",
      key: "individualNpi",
      label: "Individual NPI (Type 1)",
      placeholder: "1234567890",
      format: "npi",
      required: true,
      description: "Your personal 10-digit Individual NPI.",
    },
  ],
];
