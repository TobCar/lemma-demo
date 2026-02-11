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
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Pencil,
  CalendarIcon,
  User,
  Shield,
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { OwnerData } from "@/types/onboarding";

export function OwnershipStep() {
  const { formData, addOwner, updateOwner, removeOwner, setCurrentStep } =
    useOnboarding();
  const [allOwnersConfirmed, setAllOwnersConfirmed] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const leader = formData.owners[0];
  const additionalOwners = formData.owners
    .slice(1)
    .filter((o) => o.prongs.includes("ownership"));

  const editingOwner = editingOwnerId
    ? formData.owners.find((o) => o.id === editingOwnerId)
    : null;

  const formatSSN = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }, []);

  const getMaskedSSN = (ssn: string) => {
    const digits = ssn.replace(/-/g, "");
    if (digits.length < 4)
      return "\u2022\u2022\u2022-\u2022\u2022-\u2022\u2022\u2022\u2022";
    return `\u2022\u2022\u2022-\u2022\u2022-${digits.slice(-4)}`;
  };

  const handleAddOwner = () => {
    addOwner();
    const newOwner = formData.owners[formData.owners.length - 1];
    if (newOwner) {
      updateOwner(newOwner.id, { prongs: ["ownership"] });
    }
    setIsAddingNew(true);
    setTimeout(() => {
      const updatedOwners = formData.owners;
      const lastOwner = updatedOwners[updatedOwners.length - 1];
      if (lastOwner) {
        setEditingOwnerId(lastOwner.id);
      }
    }, 0);
  };

  const handleEditOwner = (owner: OwnerData) => {
    setIsAddingNew(false);
    setEditingOwnerId(owner.id);
  };

  const handleDoneEditing = () => {
    setEditingOwnerId(null);
    setIsAddingNew(false);
  };

  const handleCancelAdding = () => {
    if (isAddingNew && editingOwnerId) {
      removeOwner(editingOwnerId);
    }
    setEditingOwnerId(null);
    setIsAddingNew(false);
  };

  const handleNext = () => {
    setCurrentStep(5);
  };

  if (editingOwnerId && editingOwner) {
    return (
      <div className="space-y-7">
        <div>
          <h1 className="onboarding-header">
            {isAddingNew ? "Add a beneficial owner" : "Edit beneficial owner"}
          </h1>
          <p className="onboarding-subheader">
            Provide details for the individual who owns 25% or more of the
            company.
          </p>
        </div>

        <div className="form-field">
          <Label>Legal name</Label>
          <Input
            placeholder="Full legal name"
            value={editingOwner.name}
            onChange={(e) =>
              updateOwner(editingOwner.id, { name: e.target.value })
            }
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
                    !editingOwner.dateOfBirth && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {editingOwner.dateOfBirth
                    ? format(editingOwner.dateOfBirth, "MM/dd/yyyy")
                    : "mm/dd/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={new Date(1924, 0)}
                  endMonth={new Date()}
                  selected={editingOwner.dateOfBirth || undefined}
                  onSelect={(date) =>
                    updateOwner(editingOwner.id, { dateOfBirth: date || null })
                  }
                  disabled={(date) =>
                    date > new Date() || date < new Date("1910-01-01")
                  }
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="form-field">
            <Label>Tax ID (SSN or ITIN)</Label>
            <Input
              placeholder="123-45-6789"
              value={editingOwner.ssn}
              onChange={(e) =>
                updateOwner(editingOwner.id, { ssn: formatSSN(e.target.value) })
              }
              className="form-input masked-input"
            />
          </div>
        </div>

        <div className="trust-signal">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Your SSN is encrypted and used only for identity verification. It
            will not affect your credit score.
          </span>
        </div>

        <div className="space-y-3">
          <Label>Home address</Label>

          <Input
            placeholder="Address line 1"
            value={editingOwner.address.line1}
            onChange={(e) =>
              updateOwner(editingOwner.id, {
                address: { ...editingOwner.address, line1: e.target.value },
              })
            }
            className="form-input"
          />

          <Input
            placeholder="Address line 2 (optional)"
            value={editingOwner.address.line2}
            onChange={(e) =>
              updateOwner(editingOwner.id, {
                address: { ...editingOwner.address, line2: e.target.value },
              })
            }
            className="form-input"
          />

          <div className="address-grid">
            <div className="city">
              <Input
                placeholder="City"
                value={editingOwner.address.city}
                onChange={(e) =>
                  updateOwner(editingOwner.id, {
                    address: { ...editingOwner.address, city: e.target.value },
                  })
                }
                className="form-input"
              />
            </div>

            <div className="state">
              <Select
                value={editingOwner.address.state}
                onValueChange={(value) =>
                  updateOwner(editingOwner.id, {
                    address: { ...editingOwner.address, state: value },
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
                value={editingOwner.address.zip}
                onChange={(e) => {
                  const zip = e.target.value.replace(/\D/g, "").slice(0, 5);
                  updateOwner(editingOwner.id, {
                    address: { ...editingOwner.address, zip },
                  });
                }}
                maxLength={5}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="onboarding-button-row">
          <Button
            variant="outline"
            onClick={handleCancelAdding}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isAddingNew ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleDoneEditing} className="btn-primary">
            {isAddingNew ? "Add Owner" : "Save Changes"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="onboarding-header">
          Tell us about your company ownership
        </h1>
        <p className="onboarding-subheader">
          Anti-money laundering laws require us to identify all individuals with
          25% or greater ownership.
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
        {leader.prongs.includes("ownership") && leader.name && (
          <div className="flex items-center justify-between px-4 py-4 bg-background hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  {leader.name}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {getMaskedSSN(leader.ssn)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditOwner(leader)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        )}

        {additionalOwners.map((owner) => (
          <div
            key={owner.id}
            className="flex items-center justify-between px-4 py-4 bg-background hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  {owner.name || "New Owner"}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {getMaskedSSN(owner.ssn)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditOwner(owner)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddOwner}
          className="flex items-center gap-3 w-full px-4 py-4 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-full border-2 border-dashed border-border flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-[14px]">Add a beneficial owner</span>
        </button>
      </div>

      <label className="checkbox-label">
        <Checkbox
          checked={allOwnersConfirmed}
          onCheckedChange={(checked) => setAllOwnersConfirmed(!!checked)}
        />
        <span>
          I&apos;ve listed all individuals who own 25% or more of the company
        </span>
      </label>

      <div className="onboarding-button-row">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(3)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(5)}
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
