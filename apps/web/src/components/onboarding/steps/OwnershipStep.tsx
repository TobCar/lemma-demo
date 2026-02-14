"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import type { PersonData, BeneficialOwnerData } from "@/types/onboarding";
import { FormFields } from "@/components/onboarding/fields";
import { ownershipEditFields } from "@/data/onboarding/new-organization";
import { validateField, validateFields } from "@/lib/validation";

const emptyPerson = (): PersonData => ({
  name: "",
  title: "",
  dateOfBirth: null,
  ssn: "",
  address: { line1: "", line2: "", city: "", state: "", zip: "" },
});

export function OwnershipStep() {
  const {
    formData,
    addBeneficialOwner,
    updateBeneficialOwner,
    removeBeneficialOwner,
    setCurrentStep,
  } = useOnboarding();

  const [allOwnersConfirmed, setAllOwnersConfirmed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [localPerson, setLocalPerson] = useState<PersonData>(emptyPerson());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { controlPerson, controlPersonOwnsBusiness, beneficialOwners } =
    formData;

  const totalOwners =
    (controlPersonOwnsBusiness ? 1 : 0) + beneficialOwners.length;
  const MAX_OWNERS = 4;

  const getMaskedSSN = (ssn: string) => {
    if (ssn.length < 4)
      return "\u2022\u2022\u2022-\u2022\u2022-\u2022\u2022\u2022\u2022";
    return `\u2022\u2022\u2022-\u2022\u2022-${ssn.slice(-4)}`;
  };

  const handleAddOwner = () => {
    setLocalPerson(emptyPerson());
    setIsAddingNew(true);
    setEditingId("new");
    setErrors({});
  };

  const handleEditOwner = (owner: BeneficialOwnerData) => {
    setLocalPerson({
      name: owner.name,
      title: owner.title,
      dateOfBirth: owner.dateOfBirth,
      ssn: owner.ssn,
      address: { ...owner.address },
    });
    setIsAddingNew(false);
    setEditingId(owner.id);
    setErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setLocalPerson(emptyPerson());
    setErrors({});
  };

  const handleEditChange = (key: string, value: unknown) => {
    if (key === "address") {
      setLocalPerson((prev) => ({
        ...prev,
        address: value as PersonData["address"],
      }));
    } else {
      setLocalPerson((prev) => ({ ...prev, [key]: value }));
    }
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleEditBlur = (key: string) => {
    const def = ownershipEditFields.flat().find((f) => f.key === key);
    if (!def) return;
    const error = validateField(def, localPerson);
    setErrors((prev) => ({ ...prev, [key]: error ?? "" }));
  };

  const validateEdit = () => {
    const newErrors = validateFields(ownershipEditFields, localPerson);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEdit()) return;

    if (isAddingNew) {
      addBeneficialOwner(localPerson);
    } else if (editingId) {
      updateBeneficialOwner(editingId, localPerson);
    }

    setEditingId(null);
    setIsAddingNew(false);
    setLocalPerson(emptyPerson());
    setErrors({});
  };

  // Editing/adding form view
  if (editingId) {
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
          fields={ownershipEditFields}
          values={localPerson}
          onChange={handleEditChange}
          errors={errors}
          onBlur={handleEditBlur}
        />

        <div className="onboarding-button-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
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

  // List view
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
        {controlPersonOwnsBusiness && controlPerson.name && (
          <div className="flex items-center justify-between px-4 py-4 bg-background hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  {controlPerson.name}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {getMaskedSSN(controlPerson.ssn)} &middot; Control person
                </p>
              </div>
            </div>
          </div>
        )}

        {beneficialOwners.map((owner) => (
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
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditOwner(owner)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBeneficialOwner(owner.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
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
          I confirm that I&apos;ve listed all individuals who own 25% or more of
          the company, or that no single individual owns 25% or more
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
            onClick={() => setCurrentStep(5)}
            className="btn-primary"
            disabled={!allOwnersConfirmed}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
