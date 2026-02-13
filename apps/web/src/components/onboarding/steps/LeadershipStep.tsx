"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { FormFields } from "@/components/onboarding/fields";
import { leadershipFields } from "@/data/onboarding/new-organization";
import { validateField, validateFields } from "@/lib/validation";

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

  const handleBlur = (key: string) => {
    const def = leadershipFields.flat().find((f) => f.key === key);
    if (!def) return;
    const error = validateField(def, leader);
    setErrors((prev) => ({ ...prev, [key]: error ?? "" }));
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
    const newErrors = validateFields(leadershipFields, leader);
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

      <FormFields
        fields={leadershipFields}
        values={leader}
        onChange={handleChange}
        errors={errors}
        onBlur={handleBlur}
      />

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
