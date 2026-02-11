import { OrganizationType } from "@/types/onboarding";

export const ORGANIZATION_TYPES: OrganizationType[] = [
  {
    value: "pc",
    label: "Professional Corporation (PC)",
    structure: "corporation",
    logicBranch: "standard_kyb",
  },
  {
    value: "pllc",
    label: "Professional LLC (PLLC)",
    structure: "llc",
    logicBranch: "standard_kyb",
    restrictedStates: ["CA", "NY"],
  },
  {
    value: "llc",
    label: "Limited Liability Company (LLC)",
    structure: "llc",
    logicBranch: "standard_kyb",
    restrictedStates: ["CA", "NY"],
  },
  {
    value: "nonprofit",
    label: "Non-Profit Organization (501c3)",
    structure: "non_profit",
    logicBranch: "control_person",
  },
  {
    value: "mso",
    label: "Management Services Org (MSO)",
    structure: "corporation",
    logicBranch: "standard_kyb",
  },
  {
    value: "sole_prop",
    label: "Sole Proprietorship",
    structure: "natural_person",
    logicBranch: "skip_beneficial_owners",
  },
  {
    value: "fqhc",
    label: "Federally Qualified Health Center (FQHC)",
    structure: "government_authority",
    logicBranch: "authorized_signer",
  },
  {
    value: "govt",
    label: "Public / Government Health Entity",
    structure: "government_authority",
    logicBranch: "authorized_signer",
  },
  {
    value: "partnership",
    label: "Medical Partnership",
    structure: "joint",
    logicBranch: "standard_kyb",
  },
];
