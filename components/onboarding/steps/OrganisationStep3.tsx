"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { FormFields, type FieldRow } from "@/components/onboarding/fields";
import { validateAddress, validateEmail, validatePhone } from "@/lib/validation";

const fields: FieldRow[] = [
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

export function OrganisationStep3() {
  const { formData, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { businessProfile } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: unknown) => {
    if (key === "address") {
      updateBusinessProfile({ address: value as typeof businessProfile.address });
    } else {
      updateBusinessProfile({ [key]: value });
    }
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    validateAddress(businessProfile.address, "address", newErrors);
    validateEmail(businessProfile.businessEmail, "businessEmail", newErrors, "Business email");
    validatePhone(businessProfile.businessPhone, "businessPhone", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep(3);
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit} noValidate>
      <div>
        <h1 className="onboarding-header">
          Tell us a bit about your Organisation
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1">Step 3 of 3</p>
      </div>

      <FormFields
        fields={fields}
        values={businessProfile}
        onChange={handleChange}
        errors={errors}
      />

      <div className="onboarding-button-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(1)}
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
