"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { FormFields, type FieldRow } from "@/components/onboarding/fields";
import { validateAddress, validateSSN } from "@/lib/validation";

const fields: FieldRow[] = [
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
      required: true,
    },
  ],
  [
    { type: "date", key: "dateOfBirth", label: "Date of birth", required: true },
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

export function LeadershipStep() {
  const { formData, updateOwner, setCurrentStep } = useOnboarding();
  const leader = formData.owners[0];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: unknown) => {
    if (key === "address") {
      updateOwner(leader.id, { address: value as typeof leader.address });
    } else {
      updateOwner(leader.id, { [key]: value });
    }
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleOwnership = (checked: boolean) => {
    const prongs = checked
      ? ([...leader.prongs.filter((p) => p !== "ownership"), "ownership"] as (
          | "ownership"
          | "control"
        )[])
      : leader.prongs.filter((p) => p !== "ownership");
    if (!prongs.includes("control")) {
      prongs.push("control");
    }
    updateOwner(leader.id, { prongs });
  };

  useEffect(() => {
    if (!leader.prongs.includes("control")) {
      updateOwner(leader.id, { prongs: [...leader.prongs, "control"] });
    }
  }, [leader.id, leader.prongs, updateOwner]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!leader.name.trim()) {
      newErrors.name = "Legal name is required";
    }
    if (!leader.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!leader.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    validateSSN(leader.ssn, "ssn", newErrors);
    validateAddress(leader.address, "address", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep(4);
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit} noValidate>
      <div>
        <h1 className="onboarding-header">Verify a Control Person</h1>
        <p className="onboarding-subheader">
          Our banking partner requires one person with significant management
          responsibility (like a CEO or Managing Partner) to be verified.
        </p>
      </div>

      <FormFields fields={fields} values={leader} onChange={handleChange} errors={errors} />

      <div className="form-field">
        <Label>Ownership</Label>
        <label className="checkbox-label mt-2">
          <Checkbox
            checked={leader.prongs.includes("ownership")}
            onCheckedChange={toggleOwnership}
          />
          <span>Does this person own 25% or more of the company?</span>
        </label>
      </div>

      <div className="onboarding-button-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button type="submit" className="btn-primary">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </form>
  );
}
