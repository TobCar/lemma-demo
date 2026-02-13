// Types for Lemma Onboarding - Maps to Increase API Entity structure

// Organization type definitions for healthcare legal structures
type OrganizationStructure =
  | "professional_corporation"
  | "professional_llc"
  | "llc"
  | "mso"
  | "non_profit"
  | "natural_person"
  | "government_authority"
  | "joint";

type OrganizationLogicBranch =
  | "standard_kyb"
  | "control_person"
  | "skip_beneficial_owners"
  | "authorized_signer";

export interface OrganizationType {
  value: string;
  label: string;
  structure: OrganizationStructure;
  logicBranch: OrganizationLogicBranch;
  restrictedStates?: string[]; // States where this org type is not allowed
}

// Form state types
export interface BusinessProfileData {
  legalBusinessName: string;
  ein: string;
  website: string;
  naicsCode: string;
  incorporationState: string;
  organizationType: string;
  ss4File: File | null;
  practiceNpi: string;
  individualNpi: string;
  npiType: "type2" | "type1" | null;
  locationCount: number | null;
  sharedTaxId: boolean | null;
  businessEmail: string;
  businessPhone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface OwnerData {
  id: string;
  name: string;
  title: string;
  dateOfBirth: Date | null;
  ssn: string;
  prongs: ("ownership" | "control")[];
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface IdentityVerificationData {
  idFrontFile: File | null;
  idBackFile: File | null;
  termsAccepted: boolean;
  termsIpAddress: string;
  termsTimestamp: string;
}

export interface OnboardingFormData {
  businessProfile: BusinessProfileData;
  owners: OwnerData[];
  identityVerification: IdentityVerificationData;
}

export interface CreateLegalEntityRequest {
  legalBusinessName: string;
  url: string;
  businessPhone: string;
  businessEmail?: string;
  address?: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  organizationType: string;
  practiceNpi: string;
  naicsCode: string;
  ipAddress: string;
  ss4FileKey?: string;
}
