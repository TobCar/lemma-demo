"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ORGANIZATION_TYPES } from "@/data/organizations";
import { HEALTHCARE_NAICS_CODES } from "@/data/naicsCodes";
import { ArrowRight, AlertCircle, Check, ChevronsUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export function OrganisationStep1() {
  const { formData, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { businessProfile } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [typeOpen, setTypeOpen] = useState(false);
  const [structureOpen, setStructureOpen] = useState(false);

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
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!businessProfile.legalBusinessName.trim()) {
      newErrors.legalBusinessName = "Organisation name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(1);
    }
  };

  const selectedType =
    HEALTHCARE_NAICS_CODES.find((t) => t.code === businessProfile.naicsCode) ||
    HEALTHCARE_NAICS_CODES[0];
  const selectedStructure =
    availableOrgTypes.find(
      (o) => o.value === businessProfile.organizationType,
    ) || availableOrgTypes.find((o) => o.value === "professional_corporation");

  return (
    <div className="space-y-7">
      <div>
        <h1 className="onboarding-header">
          Tell us a bit about your Organisation
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1">Step 1 of 3</p>
      </div>

      <div className="form-field">
        <Label htmlFor="orgName">Organisation Name</Label>
        <Input
          id="orgName"
          placeholder="Acme Healthcare Inc."
          value={businessProfile.legalBusinessName}
          onChange={(e) => {
            updateBusinessProfile({ legalBusinessName: e.target.value });
            if (errors.legalBusinessName)
              setErrors((prev) => ({ ...prev, legalBusinessName: "" }));
          }}
          className={`form-input ${errors.legalBusinessName ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
        />
        {errors.legalBusinessName && (
          <p className="text-[13px] text-destructive flex items-center gap-1.5 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.legalBusinessName}
          </p>
        )}
      </div>

      <div className="form-field">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          value={businessProfile.website}
          onChange={(e) => updateBusinessProfile({ website: e.target.value })}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <Label>Type</Label>
        <Popover open={typeOpen} onOpenChange={setTypeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={typeOpen}
              className="form-select-trigger w-full justify-between font-normal"
            >
              {selectedType ? (
                <span className="truncate">{selectedType.label}</span>
              ) : (
                <span className="text-muted-foreground">
                  Search for your type...
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Search healthcare types..."
                className="h-10"
              />
              <CommandList>
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {HEALTHCARE_NAICS_CODES.map((type) => (
                    <CommandItem
                      key={type.code}
                      value={type.label}
                      onSelect={() => {
                        updateBusinessProfile({ naicsCode: type.code });
                        setTypeOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          businessProfile.naicsCode === type.code
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="text-[14px]">{type.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="form-field">
        <Label>Organisation Structure</Label>
        <Popover open={structureOpen} onOpenChange={setStructureOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={structureOpen}
              className="form-select-trigger w-full justify-between font-normal"
            >
              {selectedStructure ? (
                <span className="truncate">{selectedStructure.label}</span>
              ) : (
                <span className="text-muted-foreground">
                  Select your organisation structure...
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Search organisation structures..."
                className="h-10"
              />
              <CommandList>
                <CommandEmpty>No organisation structure found.</CommandEmpty>
                <CommandGroup>
                  {availableOrgTypes.map((orgType) => (
                    <CommandItem
                      key={orgType.value}
                      value={orgType.label}
                      disabled={orgType.disabled}
                      onSelect={() => {
                        if (!orgType.disabled) {
                          handleOrgTypeChange(orgType.value);
                          setStructureOpen(false);
                        }
                      }}
                      className={cn(
                        orgType.disabled && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          businessProfile.organizationType === orgType.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="text-[14px]">{orgType.label}</span>
                      {orgType.disabled &&
                        businessProfile.incorporationState && (
                          <span className="ml-auto text-[12px] text-muted-foreground">
                            Not available in{" "}
                            {businessProfile.incorporationState}
                          </span>
                        )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="onboarding-button-row">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(1)}
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
  );
}
