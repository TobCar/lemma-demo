export type PaymentType = "ACH" | "CHECK" | "WIRE";
export type MatchStatus = "Matched" | "Needs Match";

export interface ClaimTransaction {
  id: string;
  date: string;
  payor: string;
  description: string;
  type: PaymentType;
  amount: number;
  matchStatus: MatchStatus;
}

export interface ClaimToMatch {
  id: string;
  claimId: string;
  patientId: string;
  amount: number;
}

export const claimTransactions: ClaimTransaction[] = [
  {
    id: "1",
    date: "Jan 19",
    payor: "Blue Cross Blue Shield",
    description: "Medical Claims Payment - Batch #45892",
    type: "ACH",
    amount: 15680.50,
    matchStatus: "Needs Match",
  },
  {
    id: "2",
    date: "Jan 18",
    payor: "Blue Cross Blue Shield",
    description: "Medical Claims Payment - Check",
    type: "CHECK",
    amount: 8420.75,
    matchStatus: "Matched",
  },
  {
    id: "3",
    date: "Jan 18",
    payor: "UnitedHealthcare",
    description: "Wire Transfer - Claims Settlement",
    type: "WIRE",
    amount: 45230.75,
    matchStatus: "Matched",
  },
  {
    id: "4",
    date: "Jan 18",
    payor: "Aetna",
    description: "Medical Claims Payment - Weekly Batch",
    type: "ACH",
    amount: 8945.20,
    matchStatus: "Matched",
  },
  {
    id: "5",
    date: "Jan 17",
    payor: "UnitedHealthcare",
    description: "Healthcare Claims Payment - Check",
    type: "CHECK",
    amount: 6910.00,
    matchStatus: "Matched",
  },
  {
    id: "6",
    date: "Jan 17",
    payor: "Cigna",
    description: "Healthcare Claims Reimbursement",
    type: "ACH",
    amount: 12350.00,
    matchStatus: "Needs Match",
  },
  {
    id: "7",
    date: "Jan 17",
    payor: "Blue Cross Blue Shield",
    description: "Wire Transfer - Surgical Settlement",
    type: "WIRE",
    amount: 67800.00,
    matchStatus: "Matched",
  },
  {
    id: "8",
    date: "Jan 16",
    payor: "Aetna",
    description: "Healthcare Claims Payment - Check",
    type: "CHECK",
    amount: 12350.40,
    matchStatus: "Matched",
  },
];

export const claimsToMatch: ClaimToMatch[] = [
  { id: "1", claimId: "CLM-58960", patientId: "PAT-1445", amount: 9000.627 },
  { id: "2", claimId: "CLM-70970", patientId: "PAT-2714", amount: 7369.377 },
  { id: "3", claimId: "CLM-37847", patientId: "PAT-5321", amount: 9206.774 },
  { id: "4", claimId: "CLM-45123", patientId: "PAT-8923", amount: 5420.50 },
  { id: "5", claimId: "CLM-89234", patientId: "PAT-3456", amount: 12350.00 },
];

// Calculate summary stats
export const getClaimStats = () => {
  const totalReceived = claimTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = claimTransactions.length;
  const matchedTransactions = claimTransactions.filter((t) => t.matchStatus === "Matched");
  const totalMatched = matchedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const matchedCount = matchedTransactions.length;
  const matchPercentage = ((matchedCount / totalTransactions) * 100).toFixed(1);

  return {
    totalReceived,
    totalTransactions,
    totalMatched,
    matchedCount,
    matchPercentage,
  };
};
