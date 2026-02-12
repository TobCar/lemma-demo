"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ORGANIZATION_TYPES } from "@/data/organizations";
import { ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { FormText, FormDropdown } from "@/components/onboarding/fields";
import { profileFields, naicsOptions } from "@/data/onboarding/new-organisation";
import { validateFields } from "@/lib/validation";

export function OrganisationProfile() {
  const { formData, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { businessProfile } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableOrgTypes = useMemo(() => {
    return ORGANIZATION_TYPES.map((orgType) => ({
      ...orgType,
      disabled:
        orgType.restrictedStates?.includes(
          businessProfile.incorporationState,
        ) || false,
    }));
  }, [businessProfile.incorporationState]);

  const handleOrgTypeChange = (value: string) => {
    const orgType = ORGANIZATION_TYPES.find((o) => o.value === value);

    if (orgType?.logicBranch === "skip_beneficial_owners") {
      updateBusinessProfile({
        organizationType: value,
        npiType: null,
        practiceNpi: "",
      });
    } else {
      updateBusinessProfile({
        organizationType: value,
        npiType: "type2",
        individualNpi: "",
      });
    }
    if (errors.organizationType)
      setErrors((prev) => ({ ...prev, organizationType: "" }));
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = validateFields(profileFields, businessProfile);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep(1);
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit} noValidate>
      <div>
        <h1 className="onboarding-header">
          Tell us a bit about your Organisation
        </h1>
      </div>

      <FormText
        label="Organisation Name"
        placeholder="Acme Healthcare Inc."
        required
        value={businessProfile.legalBusinessName}
        onChange={(value) => {
          updateBusinessProfile({ legalBusinessName: value });
          clearError("legalBusinessName");
        }}
        error={errors.legalBusinessName}
      />

      <FormText
        label="Website"
        placeholder="https://example.com"
        value={businessProfile.website}
        onChange={(value) => updateBusinessProfile({ website: value })}
      />

      <FormDropdown
        label="Type"
        value={businessProfile.naicsCode}
        onChange={(value) => {
          updateBusinessProfile({ naicsCode: value });
          clearError("naicsCode");
        }}
        options={naicsOptions}
        required
        searchable
        placeholder="Search for your type..."
        searchPlaceholder="Search healthcare types..."
        error={errors.naicsCode}
      />

      <FormDropdown
        label="Organisation Structure"
        value={businessProfile.organizationType}
        onChange={handleOrgTypeChange}
        options={availableOrgTypes}
        required
        searchable
        placeholder="Select your organisation structure..."
        searchPlaceholder="Search organisation structures..."
        renderItemExtra={(option) =>
          option.disabled && businessProfile.incorporationState ? (
            <span className="ml-auto text-[12px] text-muted-foreground">
              Not available in {businessProfile.incorporationState}
            </span>
          ) : null
        }
        error={errors.organizationType}
      />

      <div className="onboarding-button-row">
        <Button type="submit" className="btn-primary">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
