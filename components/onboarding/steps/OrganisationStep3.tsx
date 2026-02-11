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
import { US_STATES } from "@/data/usStates";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { useCallback } from "react";

export function OrganisationStep3() {
  const { formData, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { businessProfile } = formData;

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    updateBusinessProfile({
      address: { ...businessProfile.address, zip: value },
    });
  };

  const formatPhone = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    updateBusinessProfile({ businessPhone: formatted });
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="onboarding-header">
          Tell us a bit about your Organisation
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1">Step 3 of 3</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Address</Label>
          <p className="text-[13px] text-muted-foreground mt-1 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            Physical street addresses only. P.O. Boxes are not permitted by our
            banking partner.
          </p>
        </div>

        <Input
          placeholder="Address line 1"
          value={businessProfile.address.line1}
          onChange={(e) =>
            updateBusinessProfile({
              address: { ...businessProfile.address, line1: e.target.value },
            })
          }
          className="form-input"
        />

        <Input
          placeholder="Address line 2 (optional)"
          value={businessProfile.address.line2}
          onChange={(e) =>
            updateBusinessProfile({
              address: { ...businessProfile.address, line2: e.target.value },
            })
          }
          className="form-input"
        />

        <div className="address-grid">
          <div className="city">
            <Input
              placeholder="City"
              value={businessProfile.address.city}
              onChange={(e) =>
                updateBusinessProfile({
                  address: { ...businessProfile.address, city: e.target.value },
                })
              }
              className="form-input"
            />
          </div>

          <div className="state">
            <Select
              value={businessProfile.address.state}
              onValueChange={(value) =>
                updateBusinessProfile({
                  address: { ...businessProfile.address, state: value },
                })
              }
            >
              <SelectTrigger className="form-select-trigger">
                <SelectValue placeholder="State" />
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

          <div className="zip">
            <Input
              placeholder="ZIP code"
              value={businessProfile.address.zip}
              onChange={handleZipChange}
              maxLength={5}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="form-field">
        <Label htmlFor="businessEmail">Business email</Label>
        <Input
          id="businessEmail"
          type="email"
          placeholder="contact@yourpractice.com"
          value={businessProfile.businessEmail}
          onChange={(e) =>
            updateBusinessProfile({ businessEmail: e.target.value })
          }
          className="form-input"
        />
      </div>

      <div className="form-field">
        <Label htmlFor="businessPhone">Business phone number</Label>
        <Input
          id="businessPhone"
          type="tel"
          placeholder="(555) 123-4567"
          value={businessProfile.businessPhone}
          onChange={handlePhoneChange}
          className="form-input"
        />
      </div>

      <div className="nav-bar">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(3)}
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
