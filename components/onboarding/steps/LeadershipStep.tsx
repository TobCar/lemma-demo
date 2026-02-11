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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { US_STATES } from "@/data/usStates";
import { ArrowRight, ArrowLeft, CalendarIcon, Shield } from "lucide-react";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function LeadershipStep() {
  const { formData, updateOwner, setCurrentStep } = useOnboarding();

  const leader = formData.owners[0];

  const formatSSN = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }, []);

  const handleSSNChange = (value: string) => {
    const formatted = formatSSN(value);
    updateOwner(leader.id, { ssn: formatted });
  };

  const handleZipChange = (value: string) => {
    const zip = value.replace(/\D/g, "").slice(0, 5);
    updateOwner(leader.id, {
      address: { ...leader.address, zip },
    });
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

  const handleNext = () => {
    setCurrentStep(4);
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="onboarding-header">Verify a Control Person</h1>
        <p className="onboarding-subheader">
          Our banking partner requires one person with significant management
          responsibility (like a CEO or Managing Partner) to be verified.
        </p>
      </div>

      <div className="form-field">
        <Label>Legal name</Label>
        <Input
          placeholder="Full legal name"
          value={leader.name}
          onChange={(e) => updateOwner(leader.id, { name: e.target.value })}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <Label>Title</Label>
        <Input
          placeholder="e.g. CEO, President, Managing Director"
          value={leader.title}
          onChange={(e) => updateOwner(leader.id, { title: e.target.value })}
          className="form-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-field">
          <Label>Date of birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "form-select-trigger w-full justify-start text-left font-normal",
                  !leader.dateOfBirth && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {leader.dateOfBirth
                  ? format(leader.dateOfBirth, "MM/dd/yyyy")
                  : "mm/dd/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                startMonth={new Date(1924, 0)}
                endMonth={new Date()}
                selected={leader.dateOfBirth || undefined}
                onSelect={(date) =>
                  updateOwner(leader.id, { dateOfBirth: date || null })
                }
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="form-field">
          <Label>Tax ID (SSN or ITIN)</Label>
          <Input
            placeholder="123-45-6789"
            value={leader.ssn}
            onChange={(e) => handleSSNChange(e.target.value)}
            className="form-input masked-input"
          />
        </div>
      </div>

      <div className="trust-signal">
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Your SSN is encrypted and used only for identity verification. It will
          not affect your credit score.
        </span>
      </div>

      <div className="space-y-3">
        <Label>Home address</Label>

        <Input
          placeholder="Address line 1"
          value={leader.address.line1}
          onChange={(e) =>
            updateOwner(leader.id, {
              address: { ...leader.address, line1: e.target.value },
            })
          }
          className="form-input"
        />

        <Input
          placeholder="Address line 2 (optional)"
          value={leader.address.line2}
          onChange={(e) =>
            updateOwner(leader.id, {
              address: { ...leader.address, line2: e.target.value },
            })
          }
          className="form-input"
        />

        <div className="address-grid">
          <div className="city">
            <Input
              placeholder="City"
              value={leader.address.city}
              onChange={(e) =>
                updateOwner(leader.id, {
                  address: { ...leader.address, city: e.target.value },
                })
              }
              className="form-input"
            />
          </div>

          <div className="state">
            <Select
              value={leader.address.state}
              onValueChange={(value) =>
                updateOwner(leader.id, {
                  address: { ...leader.address, state: value },
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
              value={leader.address.zip}
              onChange={(e) => handleZipChange(e.target.value)}
              maxLength={5}
              className="form-input"
            />
          </div>
        </div>
      </div>

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
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(4)}
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
