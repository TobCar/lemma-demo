export interface SweepRule {
  id: string;
  type: "distribute" | "maintain" | "schedule" | "redirect";
  frequency: string;
  sourceAccount: string;
  sourceAccountId: string;
  destinationAccount: string;
  destinationAccountId: string;
  condition?: string;
  threshold?: number;
  nextTransfer: string;
  lastModified: string;
  isActive: boolean;
}

export interface RecentSweep {
  id: string;
  date: string;
  amount: number;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  method: string;
  status: "completed" | "pending" | "failed";
}

export const sweepRules: SweepRule[] = [
  {
    id: "1",
    type: "maintain",
    frequency: "Every business day",
    sourceAccount: "Savings",
    sourceAccountId: "••7534",
    destinationAccount: "Checking",
    destinationAccountId: "••4212",
    condition: "is lower than",
    threshold: 200,
    nextTransfer: "tomorrow",
    lastModified: "6 days ago",
    isActive: true,
  },
];

export const recentSweeps: RecentSweep[] = [
  {
    id: "1",
    date: "Jan 27, 2026",
    amount: 156420.00,
    from: "Savings",
    fromId: "••7534",
    to: "Checking",
    toId: "••4212",
    method: "Internal Transfer",
    status: "completed",
  },
  {
    id: "2",
    date: "Jan 26, 2026",
    amount: 189340.00,
    from: "Savings",
    fromId: "••7534",
    to: "Checking",
    toId: "••4212",
    method: "Internal Transfer",
    status: "completed",
  },
  {
    id: "3",
    date: "Jan 25, 2026",
    amount: 142580.00,
    from: "Savings",
    fromId: "••7534",
    to: "Checking",
    toId: "••4212",
    method: "Internal Transfer",
    status: "completed",
  },
  {
    id: "4",
    date: "Jan 24, 2026",
    amount: 167920.00,
    from: "Savings",
    fromId: "••7534",
    to: "Checking",
    toId: "••4212",
    method: "Internal Transfer",
    status: "completed",
  },
  {
    id: "5",
    date: "Jan 23, 2026",
    amount: 198540.00,
    from: "Savings",
    fromId: "••7534",
    to: "Checking",
    toId: "••4212",
    method: "Internal Transfer",
    status: "completed",
  },
];

export type RuleType = "distribute" | "maintain" | "schedule" | "redirect";

export interface RuleTypeOption {
  type: RuleType;
  title: string;
  description: string;
  icon: string;
}

export const ruleTypeOptions: RuleTypeOption[] = [
  {
    type: "distribute",
    title: "Distribute funds across accounts",
    description: "Automatically split balances between accounts",
    icon: "arrow-right",
  },
  {
    type: "maintain",
    title: "Maintain a target account balance",
    description: "Keep accounts at specific thresholds",
    icon: "scale",
  },
  {
    type: "schedule",
    title: "Schedule recurring transfers",
    description: "Set up automatic scheduled payments",
    icon: "refresh",
  },
  {
    type: "redirect",
    title: "Redirect incoming funds",
    description: "Automatically route deposits to accounts",
    icon: "arrow-right",
  },
];
