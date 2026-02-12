"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORGANIZATION_TYPES } from "@/data/organizations";
import { ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";
import { useRef, useState } from "react";
import { formatNPI } from "@/lib/formatters";
import {
  FormLabel,
  FormText,
  FormDropdown,
  FieldError,
} from "@/components/onboarding/fields";
import {
  detailsBaseFields,
  detailsOrgNpiField,
  detailsIndividualNpiField,
  stateOptions,
} from "@/data/onboarding/new-organisation";
import { validateFields } from "@/lib/validation";

export function OrganisationDetails() {
  const { formData, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { businessProfile } = formData;
  const ss4InputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedOrgType = ORGANIZATION_TYPES.find(
    (o) => o.value === businessProfile.organizationType,
  );
  const isSoleProprietorship =
    selectedOrgType?.logicBranch === "skip_beneficial_owners";

  const clearError = (key: string) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleStateChange = (value: string) => {
    const currentOrgType = ORGANIZATION_TYPES.find(
      (o) => o.value === businessProfile.organizationType,
    );
    const willBeRestricted = currentOrgType?.restrictedStates?.includes(value);

    updateBusinessProfile({
      incorporationState: value,
      organizationType: willBeRestricted
        ? ""
        : businessProfile.organizationType,
    });
    clearError("incorporationState");
  };

  const handleSS4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateBusinessProfile({ ss4File: file });
      clearError("ein");
    }
  };

  const validate = () => {
    const npiFields = isSoleProprietorship
      ? businessProfile.npiType === "type1"
        ? detailsIndividualNpiField
        : detailsOrgNpiField
      : detailsOrgNpiField;

    const newErrors = validateFields(
      [...detailsBaseFields, ...npiFields],
      businessProfile,
    );

    // Custom rule: EIN is not required if SS-4 file is uploaded
    if (businessProfile.ss4File && newErrors.ein) {
      delete newErrors.ein;
    }
    // Custom message when neither EIN nor SS-4 is provided
    if (
      !businessProfile.ein.replace(/\D/g, "").trim() &&
      !businessProfile.ss4File
    ) {
      newErrors.ein =
        "Either a Tax ID (EIN) or SS-4 confirmation letter is required";
    }

    // Map NPI field key to generic "npi" error key for the manual NPI UI
    const npiKey =
      isSoleProprietorship && businessProfile.npiType === "type1"
        ? "individualNpi"
        : "practiceNpi";
    if (newErrors[npiKey]) {
      newErrors.npi = newErrors[npiKey];
      delete newErrors[npiKey];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep(2);
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit} noValidate>
      <div>
        <h1 className="onboarding-header">
          Tell us a bit about your Organisation
        </h1>
      </div>

      <FormDropdown
        label="State of Incorporation"
        value={businessProfile.incorporationState}
        onChange={handleStateChange}
        options={stateOptions}
        required
        placeholder="Select a state"
        error={errors.incorporationState}
      />

      {isSoleProprietorship ? (
        <div className="form-field">
          <FormLabel required>National Provider Identifier (NPI)</FormLabel>
          <p className="text-[13px] text-muted-foreground mb-3">
            As a sole proprietor, you may provide your Individual (Type 1) NPI
            if you don&apos;t have an organizational NPI.
          </p>

          <div className="space-y-3">
            <Select
              value={businessProfile.npiType || ""}
              onValueChange={(value: "type1" | "type2") => {
                updateBusinessProfile({ npiType: value });
                clearError("npi");
              }}
            >
              <SelectTrigger className="form-select-trigger">
                <SelectValue placeholder="Select NPI type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type2">
                  Organisational NPI (Type 2)
                </SelectItem>
                <SelectItem value="type1">Individual NPI (Type 1)</SelectItem>
              </SelectContent>
            </Select>

            {businessProfile.npiType === "type2" && (
              <div>
                <Input
                  id="npi"
                  placeholder="1234567890"
                  value={businessProfile.practiceNpi}
                  onChange={(e) => {
                    updateBusinessProfile({
                      practiceNpi: formatNPI(e.target.value),
                    });
                    clearError("npi");
                  }}
                  inputMode="numeric"
                  className="form-input"
                  maxLength={10}
                />
                <p className="text-[13px] text-muted-foreground mt-1.5">
                  10-digit Organisational NPI assigned to your practice.
                </p>
              </div>
            )}

            {businessProfile.npiType === "type1" && (
              <div>
                <Input
                  id="individual-npi"
                  placeholder="1234567890"
                  value={businessProfile.individualNpi}
                  onChange={(e) => {
                    updateBusinessProfile({
                      individualNpi: formatNPI(e.target.value),
                    });
                    clearError("npi");
                  }}
                  inputMode="numeric"
                  className="form-input"
                  maxLength={10}
                />
                <p className="text-[13px] text-muted-foreground mt-1.5">
                  Your personal 10-digit Individual NPI.
                </p>
              </div>
            )}
          </div>
          <FieldError error={errors.npi} />
        </div>
      ) : (
        <div className="form-field">
          <FormLabel required>Organisational NPI (Type 2)</FormLabel>
          <Input
            id="npi"
            placeholder="1234567890"
            value={businessProfile.practiceNpi}
            onChange={(e) => {
              updateBusinessProfile({
                practiceNpi: formatNPI(e.target.value),
              });
              clearError("npi");
            }}
            inputMode="numeric"
            className="form-input"
            maxLength={10}
          />
          <p className="text-[13px] text-muted-foreground mt-1.5">
            This is the 10-digit National Provider Identifier assigned to your
            group practice or organisation. Do not use your personal (Type 1)
            NPI.
          </p>
          <FieldError error={errors.npi} />
        </div>
      )}

      <FormText
        label="Tax ID (EIN)"
        placeholder="12-3456789"
        value={businessProfile.ein}
        onChange={(value) => {
          updateBusinessProfile({ ein: value });
          clearError("ein");
        }}
        format="ein"
        required
        description="This must match the IRS SS-4 letter for your practice."
        error={errors.ein}
      />

      <div>
        <input
          type="file"
          ref={ss4InputRef}
          accept=".pdf,image/*"
          onChange={handleSS4Change}
          className="hidden"
        />

        {businessProfile.ss4File ? (
          <div className="flex items-center gap-2 text-[14px] text-accent">
            <Check className="w-4 h-4" />
            <span>{businessProfile.ss4File.name}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => ss4InputRef.current?.click()}
            className="upload-link"
          >
            <Upload className="w-4 h-4" />
            Can&apos;t find your EIN? Upload your SS-4 confirmation letter.
          </button>
        )}
      </div>

      <div className="onboarding-button-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(0)}
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
