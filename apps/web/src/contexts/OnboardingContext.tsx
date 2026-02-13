"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  OnboardingFormData,
  PersonData,
  BeneficialOwnerData,
} from "@/types/onboarding";
import { resolveNaicsCode } from "@/data/naicsCodes";

const emptyPerson = (): PersonData => ({
  name: "",
  title: "",
  dateOfBirth: null,
  ssn: "",
  address: { line1: "", line2: "", city: "", state: "", zip: "" },
});

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: OnboardingFormData;
  updateBusinessProfile: (
    data: Partial<OnboardingFormData["businessProfile"]>,
  ) => void;
  setControlPerson: (data: PersonData) => void;
  setControlPersonOwnsBusiness: (owns: boolean) => void;
  addBeneficialOwner: (data: PersonData) => string;
  updateBeneficialOwner: (
    id: string,
    data: Partial<BeneficialOwnerData>,
  ) => void;
  removeBeneficialOwner: (id: string) => void;
  updateIdentityVerification: (
    data: Partial<OnboardingFormData["identityVerification"]>,
  ) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  getApiPayload: () => object;
}

const defaultFormData: OnboardingFormData = {
  businessProfile: {
    legalBusinessName: "",
    ein: "",
    website: "",
    naicsCode: "621111",
    incorporationState: "",
    organizationType: "professional_corporation",
    ss4File: null,
    practiceNpi: "",
    individualNpi: "",
    npiType: "type2",
    sharedTaxId: null,
    businessEmail: "",
    businessPhone: "",
    address: { line1: "", line2: "", city: "", state: "", zip: "" },
  },
  controlPerson: emptyPerson(),
  controlPersonOwnsBusiness: false,
  beneficialOwners: [],
  identityVerification: {
    idFrontFile: null,
    idBackFile: null,
    termsAccepted: false,
    termsIpAddress: "",
    termsTimestamp: "",
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateBusinessProfile = useCallback(
    (data: Partial<OnboardingFormData["businessProfile"]>) => {
      setFormData((prev) => ({
        ...prev,
        businessProfile: { ...prev.businessProfile, ...data },
      }));
    },
    [],
  );

  const setControlPerson = useCallback((data: PersonData) => {
    setFormData((prev) => ({ ...prev, controlPerson: data }));
  }, []);

  const setControlPersonOwnsBusiness = useCallback((owns: boolean) => {
    setFormData((prev) => ({ ...prev, controlPersonOwnsBusiness: owns }));
  }, []);

  const addBeneficialOwner = useCallback((data: PersonData) => {
    const id = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      beneficialOwners: [...prev.beneficialOwners, { ...data, id }],
    }));
    return id;
  }, []);

  const updateBeneficialOwner = useCallback(
    (id: string, data: Partial<BeneficialOwnerData>) => {
      setFormData((prev) => ({
        ...prev,
        beneficialOwners: prev.beneficialOwners.map((o) =>
          o.id === id ? { ...o, ...data } : o,
        ),
      }));
    },
    [],
  );

  const removeBeneficialOwner = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      beneficialOwners: prev.beneficialOwners.filter((o) => o.id !== id),
    }));
  }, []);

  const updateIdentityVerification = useCallback(
    (data: Partial<OnboardingFormData["identityVerification"]>) => {
      setFormData((prev) => ({
        ...prev,
        identityVerification: { ...prev.identityVerification, ...data },
      }));
    },
    [],
  );

  const getApiPayload = useCallback(() => {
    const {
      businessProfile,
      controlPerson,
      controlPersonOwnsBusiness,
      beneficialOwners,
      identityVerification,
    } = formData;

    // Build deduplicated beneficial_owners array with correct prongs
    const personsBySSN = new Map<
      string,
      {
        person: PersonData;
        prongs: Set<"control" | "ownership">;
      }
    >();

    // Control person always has "control" prong
    if (controlPerson.ssn) {
      personsBySSN.set(controlPerson.ssn, {
        person: controlPerson,
        prongs: new Set(
          controlPersonOwnsBusiness
            ? (["control", "ownership"] as const)
            : (["control"] as const),
        ),
      });
    }

    // Each beneficial owner has "ownership" prong
    for (const owner of beneficialOwners) {
      if (!owner.ssn) continue;
      const existing = personsBySSN.get(owner.ssn);
      if (existing) {
        existing.prongs.add("ownership");
      } else {
        personsBySSN.set(owner.ssn, {
          person: owner,
          prongs: new Set(["ownership"] as const),
        });
      }
    }

    const payload = {
      structure: "corporation",
      corporation: {
        name: businessProfile.legalBusinessName,
        tax_identifier: businessProfile.ein,
        website: businessProfile.website || undefined,
        industry_code: resolveNaicsCode(businessProfile.naicsCode) || undefined,
        address: {
          line1: businessProfile.address.line1,
          line2: businessProfile.address.line2 || undefined,
          city: businessProfile.address.city,
          state: businessProfile.address.state,
          zip: businessProfile.address.zip,
        },
        beneficial_owners: Array.from(personsBySSN.values()).map(
          ({ person, prongs }) => ({
            company_title: person.title || undefined,
            individual: {
              name: person.name,
              date_of_birth: person.dateOfBirth
                ? person.dateOfBirth.toISOString().split("T")[0]
                : "",
              address: {
                line1: person.address.line1,
                line2: person.address.line2 || undefined,
                city: person.address.city,
                state: person.address.state,
                zip: person.address.zip,
                country: "US",
              },
              identification: {
                method: "social_security_number",
                number: person.ssn,
              },
            },
            prongs: Array.from(prongs),
          }),
        ),
      },
      terms_agreements: identityVerification.termsAccepted
        ? [
            {
              agreed_at: identityVerification.termsTimestamp,
              ip_address: identityVerification.termsIpAddress,
              terms_url: "https://lemma.health/terms",
            },
          ]
        : undefined,
    };

    return payload;
  }, [formData]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateBusinessProfile,
        setControlPerson,
        setControlPersonOwnsBusiness,
        addBeneficialOwner,
        updateBeneficialOwner,
        removeBeneficialOwner,
        updateIdentityVerification,
        isSubmitting,
        setIsSubmitting,
        isComplete,
        setIsComplete,
        getApiPayload,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
