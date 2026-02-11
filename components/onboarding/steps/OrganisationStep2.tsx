"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORGANIZATION_TYPES } from "@/data/organizations";
import { LLC_RESTRICTED_STATES, US_STATES } from "@/data/usStates";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  HelpCircle,
  Check,
  AlertCircle,
} from "lucide-react";
import { useCallback, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OrganisationStep2() {
  const { formData, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { businessProfile } = formData;
  const ss4InputRef = useRef<HTMLInputElement>(null);

  const isLLCRestricted = LLC_RESTRICTED_STATES.includes(
    businessProfile.incorporationState,
  );
  const selectedState = US_STATES.find(
    (s) => s.value === businessProfile.incorporationState,
  );

  const selectedOrgType = ORGANIZATION_TYPES.find(
    (o) => o.value === businessProfile.organizationType,
  );
  const isSoleProprietorship =
    selectedOrgType?.logicBranch === "skip_beneficial_owners";

  const formatEIN = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }, []);

  const formatNPI = useCallback((value: string) => {
    return value.replace(/\D/g, "").slice(0, 10);
  }, []);

  const handleEINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    updateBusinessProfile({ ein: formatted });
  };

  const handleNPIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNPI(e.target.value);
    updateBusinessProfile({ practiceNpi: formatted });
  };

  const handleIndividualNPIChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const formatted = formatNPI(e.target.value);
    updateBusinessProfile({ individualNpi: formatted });
  };

  const handleLocationCountChange = (value: string) => {
    const count = parseInt(value, 10);
    updateBusinessProfile({
      locationCount: count,
      sharedTaxId: count === 1 ? null : businessProfile.sharedTaxId,
    });
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
  };

  const handleSS4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateBusinessProfile({ ss4File: file });
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="onboarding-header">
          Tell us a bit about your Organisation
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1">Step 2 of 3</p>
      </div>

      <div className="form-field">
        <Label>State of Incorporation</Label>
        <Select
          value={businessProfile.incorporationState}
          onValueChange={handleStateChange}
        >
          <SelectTrigger className="form-select-trigger">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLLCRestricted && businessProfile.incorporationState && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-[13px]">
            State law in {selectedState?.label} requires medical practices to be
            organized as Professional Corporations (PC) or Sole Proprietorships.
          </AlertDescription>
        </Alert>
      )}

      <div className="form-field">
        <Label>How many locations does the organisation operate?</Label>
        <Select
          value={businessProfile.locationCount?.toString() || ""}
          onValueChange={handleLocationCountChange}
        >
          <SelectTrigger className="form-select-trigger">
            <SelectValue placeholder="Select number of locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 location</SelectItem>
            <SelectItem value="2">2 locations</SelectItem>
            <SelectItem value="3">3 locations</SelectItem>
            <SelectItem value="4">4 locations</SelectItem>
            <SelectItem value="5">5+ locations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {businessProfile.locationCount !== null &&
        businessProfile.locationCount > 1 && (
          <div className="form-field">
            {/* TODO: Figure out how to ask for each Tax ID separately */}
            <Label>Do your locations share a single Tax ID (EIN)?</Label>
            <Select
              value={
                businessProfile.sharedTaxId === null
                  ? ""
                  : businessProfile.sharedTaxId
                    ? "yes"
                    : "no"
              }
              onValueChange={(value) =>
                updateBusinessProfile({ sharedTaxId: value === "yes" })
              }
            >
              <SelectTrigger className="form-select-trigger">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">
                  Yes, all locations share one EIN
                </SelectItem>
                <SelectItem value="no">
                  No, each location has its own EIN
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

      {isSoleProprietorship ? (
        <div className="form-field">
          <Label>National Provider Identifier (NPI)</Label>
          <p className="text-[13px] text-muted-foreground mb-3">
            As a sole proprietor, you may provide your Individual (Type 1) NPI
            if you don&apos;t have an organizational NPI.
          </p>

          <div className="space-y-3">
            <Select
              value={businessProfile.npiType || ""}
              onValueChange={(value: "type1" | "type2") =>
                updateBusinessProfile({ npiType: value })
              }
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
                  onChange={handleNPIChange}
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
                  onChange={handleIndividualNPIChange}
                  className="form-input"
                  maxLength={10}
                />
                <p className="text-[13px] text-muted-foreground mt-1.5">
                  Your personal 10-digit Individual NPI.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="form-field">
          <Label htmlFor="npi">Organisational NPI (Type 2)</Label>
          <Input
            id="npi"
            placeholder="1234567890"
            value={businessProfile.practiceNpi}
            onChange={handleNPIChange}
            className="form-input"
            maxLength={10}
          />
          <p className="text-[13px] text-muted-foreground mt-1.5">
            This is the 10-digit National Provider Identifier assigned to your
            group practice or organisation. Do not use your personal (Type 1)
            NPI.
          </p>
        </div>
      )}

      <div className="form-field">
        <div className="flex items-center gap-2">
          <Label htmlFor="ein">Tax ID (EIN)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="inline-flex">
                <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" className="max-w-[280px] p-3">
              <p className="text-[13px] text-foreground">
                This must match the IRS SS-4 letter for your practice.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <Input
          id="ein"
          placeholder="12-3456789"
          value={businessProfile.ein}
          onChange={handleEINChange}
          className="form-input masked-input"
        />
      </div>

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
          variant="outline"
          onClick={() => setCurrentStep(0)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(2)}
            className="btn-ghost"
          >
            Skip for now
          </Button>
          <Button onClick={handleNext} className="btn-primary">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
