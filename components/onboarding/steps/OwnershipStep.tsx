"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Pencil,
  User,
} from "lucide-react";
import { useState } from "react";
import { OwnerData } from "@/types/onboarding";
import { FormFields, type FieldRow } from "@/components/onboarding/fields";
import { validateAddress, validateSSN } from "@/lib/validation";

const editFields: FieldRow[] = [
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

export function OwnershipStep() {
  const { formData, addOwner, updateOwner, removeOwner, setCurrentStep } =
    useOnboarding();
  const [allOwnersConfirmed, setAllOwnersConfirmed] = useState(false);
  const [editingOwnerId, setEditingOwnerId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const leader = formData.owners[0];
  const additionalOwners = formData.owners
    .slice(1)
    .filter((o) => o.prongs.includes("ownership"));

  const totalOwners =
    (leader.prongs.includes("ownership") ? 1 : 0) + additionalOwners.length;
  const MAX_OWNERS = 4;

  const editingOwner = editingOwnerId
    ? formData.owners.find((o) => o.id === editingOwnerId)
    : null;

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
    setErrors({});
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
    setErrors({});
  };

  const handleDoneEditing = () => {
    setEditingOwnerId(null);
    setIsAddingNew(false);
    setErrors({});
  };

  const handleCancelAdding = () => {
    if (isAddingNew && editingOwnerId) {
      removeOwner(editingOwnerId);
    }
    setEditingOwnerId(null);
    setIsAddingNew(false);
    setErrors({});
  };

  const handleEditChange = (key: string, value: unknown) => {
    if (!editingOwnerId) return;
    if (key === "address") {
      updateOwner(editingOwnerId, {
        address: value as OwnerData["address"],
      });
    } else {
      updateOwner(editingOwnerId, { [key]: value });
    }
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateEdit = () => {
    if (!editingOwner) return false;
    const newErrors: Record<string, string> = {};
    if (!editingOwner.name.trim()) {
      newErrors.name = "Legal name is required";
    }
    if (!editingOwner.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    validateSSN(editingOwner.ssn, "ssn", newErrors);
    validateAddress(editingOwner.address, "address", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEdit()) {
      handleDoneEditing();
    }
  };

  if (editingOwnerId && editingOwner) {
    return (
      <form className="space-y-7" onSubmit={handleEditSubmit} noValidate>
        <div>
          <h1 className="onboarding-header">
            {isAddingNew ? "Add a beneficial owner" : "Edit beneficial owner"}
          </h1>
          <p className="onboarding-subheader">
            Provide details for the individual who owns 25% or more of the
            company.
          </p>
        </div>

        <FormFields
          fields={editFields}
          values={editingOwner}
          onChange={handleEditChange}
          errors={errors}
        />

        <div className="onboarding-button-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelAdding}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isAddingNew ? "Cancel" : "Back"}
          </Button>
          <Button type="submit" className="btn-primary">
            {isAddingNew ? "Add Owner" : "Save Changes"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
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

        {totalOwners < MAX_OWNERS && (
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
        )}
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
          <Button onClick={() => setCurrentStep(5)} className="btn-primary">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
