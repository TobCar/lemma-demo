export type ClaimsAccessStatus = "Mirroring" | "Dual-Stream" | "Active" | "Stalled" | "Not Connected";
export type FinancialRoutingStatus = "Active" | "Pending" | "Not Configured";

export interface PayerConnection {
  id: string;
  name: string;
  payerId: string;
  claimsAccess: ClaimsAccessStatus;
  remittanceAccess: ClaimsAccessStatus;
  financialRouting: FinancialRoutingStatus;
  lastActivity: string;
}

export interface Portal {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  category: "clearinghouse" | "payment";
}

export const payerConnections: PayerConnection[] = [
  {
    id: "1",
    name: "Aetna",
    payerId: "AETNA123",
    claimsAccess: "Mirroring",
    remittanceAccess: "Mirroring",
    financialRouting: "Active",
    lastActivity: "Jan 14",
  },
  {
    id: "2",
    name: "Blue Cross Blue Shield",
    payerId: "BCBS456",
    claimsAccess: "Dual-Stream",
    remittanceAccess: "Dual-Stream",
    financialRouting: "Active",
    lastActivity: "Jan 19",
  },
  {
    id: "3",
    name: "UnitedHealthcare",
    payerId: "UHC789",
    claimsAccess: "Active",
    remittanceAccess: "Active",
    financialRouting: "Pending",
    lastActivity: "Jan 24",
  },
  {
    id: "4",
    name: "Cigna",
    payerId: "CIGNA012",
    claimsAccess: "Stalled",
    remittanceAccess: "Stalled",
    financialRouting: "Not Configured",
    lastActivity: "Jan 9",
  },
  {
    id: "5",
    name: "Humana",
    payerId: "HUMANA345",
    claimsAccess: "Not Connected",
    remittanceAccess: "Not Connected",
    financialRouting: "Not Configured",
    lastActivity: "Jan 17",
  },
];

export const portals: Portal[] = [
  {
    id: "1",
    name: "Stedi",
    description: "EDI clearinghouse for claims and ERA processing",
    isConnected: false,
    category: "clearinghouse",
  },
  {
    id: "2",
    name: "Availity",
    description: "Healthcare information network and clearinghouse",
    isConnected: true,
    category: "clearinghouse",
  },
  {
    id: "3",
    name: "Optum",
    description: "Integrated clearinghouse and payer portal",
    isConnected: false,
    category: "clearinghouse",
  },
  {
    id: "4",
    name: "Zelis",
    description: "Payment integrity and claims management",
    isConnected: true,
    category: "payment",
  },
  {
    id: "5",
    name: "InstaMed",
    description: "Healthcare payment network",
    isConnected: false,
    category: "payment",
  },
  {
    id: "6",
    name: "Echo",
    description: "Healthcare payment processing platform",
    isConnected: false,
    category: "payment",
  },
  {
    id: "7",
    name: "Change Healthcare",
    description: "Healthcare technology and payment solutions",
    isConnected: true,
    category: "payment",
  },
];

export const connectionStatusInfo = [
  {
    status: "Active",
    description: "100% digital data flow is operational and optimized.",
  },
  {
    status: "Mirroring",
    description:
      'We\'re "Bcc\'ing" your data from your existing clearinghouse without disrupting your workflow. Your primary billing flow remains unchanged.',
  },
  {
    status: "Dual-Stream",
    description:
      "Transitional phase (30-45 days) where both paper and digital files are being sent to ensure continuity.",
  },
  {
    status: "Stalled",
    description: "Connection exists, but no files received in the last 72 hours. Requires attention.",
  },
];
