export interface AccountTransaction {
  id: string;
  description: string;
  date: string;
  amount: number;
}

export interface Account {
  id: string;
  name: string;
  identifier: string;
  type: "Virtual Account" | "Lockbox";
  assignedTo: string;
  balance: number;
  status: "Active" | "Inactive";
  // Detail fields
  monthlyVolume: number;
  transactionCount: number;
  avgTransaction: number;
  accountNumber: string;
  routingNumber: string;
  createdDate: string;
  balanceChange: number;
  balanceTrend: { date: string; value: number }[];
  recentTransactions: AccountTransaction[];
}

export const accounts: Account[] = [
  {
    id: "1",
    name: "Blue Cross Blue Shield Virtual Account",
    identifier: "••1035",
    type: "Virtual Account",
    assignedTo: "Blue Cross Blue Shield",
    balance: 284750.45,
    status: "Active",
    monthlyVolume: 892450.30,
    transactionCount: 147,
    avgTransaction: 6071.09,
    accountNumber: "8847291035",
    routingNumber: "121000248",
    createdDate: "Jan 14, 2024",
    balanceChange: 313.4,
    balanceTrend: [
      { date: "Jan 4", value: 180000 },
      { date: "Jan 7", value: 195000 },
      { date: "Jan 10", value: 210000 },
      { date: "Jan 13", value: 225000 },
      { date: "Jan 16", value: 240000 },
      { date: "Jan 19", value: 265000 },
      { date: "Jan 22", value: 250000 },
      { date: "Jan 25", value: 270000 },
      { date: "Jan 28", value: 280000 },
      { date: "Feb 2", value: 284750 },
    ],
    recentTransactions: [
      { id: "t1", description: "Medical Claims Payment - Batch #45892", date: "Jan 19", amount: 15680.50 },
      { id: "t2", description: "Wire Transfer - Surgical Settlement", date: "Jan 17", amount: 67800.00 },
      { id: "t3", description: "Outpatient Claims Payment", date: "Jan 14", amount: 4567.30 },
      { id: "t4", description: "Lab Services Payment", date: "Jan 9", amount: 7845.60 },
    ],
  },
  {
    id: "2",
    name: "Aetna Virtual Account",
    identifier: "••1062",
    type: "Virtual Account",
    assignedTo: "Aetna",
    balance: 156920.80,
    status: "Active",
    monthlyVolume: 423580.20,
    transactionCount: 89,
    avgTransaction: 4759.33,
    accountNumber: "7723451062",
    routingNumber: "121000248",
    createdDate: "Feb 22, 2024",
    balanceChange: 128.5,
    balanceTrend: [
      { date: "Jan 4", value: 120000 },
      { date: "Jan 7", value: 125000 },
      { date: "Jan 10", value: 130000 },
      { date: "Jan 13", value: 140000 },
      { date: "Jan 16", value: 145000 },
      { date: "Jan 19", value: 150000 },
      { date: "Jan 22", value: 148000 },
      { date: "Jan 25", value: 152000 },
      { date: "Jan 28", value: 155000 },
      { date: "Feb 2", value: 156920 },
    ],
    recentTransactions: [
      { id: "t1", description: "Healthcare Claims Batch #89234", date: "Jan 18", amount: 8945.20 },
      { id: "t2", description: "Primary Care Reimbursement", date: "Jan 15", amount: 3420.00 },
      { id: "t3", description: "Specialist Consultation Claims", date: "Jan 12", amount: 5670.40 },
      { id: "t4", description: "Emergency Services Payment", date: "Jan 8", amount: 12350.00 },
    ],
  },
  {
    id: "3",
    name: "UnitedHealthcare Virtual Account",
    identifier: "••1089",
    type: "Virtual Account",
    assignedTo: "UnitedHealthcare",
    balance: 342180.20,
    status: "Active",
    monthlyVolume: 1245780.50,
    transactionCount: 234,
    avgTransaction: 5323.85,
    accountNumber: "9934561089",
    routingNumber: "121000248",
    createdDate: "Jan 3, 2024",
    balanceChange: 245.8,
    balanceTrend: [
      { date: "Jan 4", value: 250000 },
      { date: "Jan 7", value: 270000 },
      { date: "Jan 10", value: 285000 },
      { date: "Jan 13", value: 300000 },
      { date: "Jan 16", value: 310000 },
      { date: "Jan 19", value: 325000 },
      { date: "Jan 22", value: 320000 },
      { date: "Jan 25", value: 335000 },
      { date: "Jan 28", value: 340000 },
      { date: "Feb 2", value: 342180 },
    ],
    recentTransactions: [
      { id: "t1", description: "Wire Transfer - Claims Settlement", date: "Jan 18", amount: 45230.75 },
      { id: "t2", description: "Healthcare Claims Payment", date: "Jan 17", amount: 6910.00 },
      { id: "t3", description: "Pharmacy Benefits Payment", date: "Jan 14", amount: 8920.30 },
      { id: "t4", description: "Diagnostic Services Claims", date: "Jan 10", amount: 15670.00 },
    ],
  },
  {
    id: "4",
    name: "Medicare Lockbox",
    identifier: "LB-48291",
    type: "Lockbox",
    assignedTo: "Medicare",
    balance: 98450.60,
    status: "Active",
    monthlyVolume: 287650.40,
    transactionCount: 62,
    avgTransaction: 4639.52,
    accountNumber: "LB48291000",
    routingNumber: "121000248",
    createdDate: "Mar 8, 2024",
    balanceChange: 87.2,
    balanceTrend: [
      { date: "Jan 4", value: 75000 },
      { date: "Jan 7", value: 78000 },
      { date: "Jan 10", value: 82000 },
      { date: "Jan 13", value: 85000 },
      { date: "Jan 16", value: 88000 },
      { date: "Jan 19", value: 92000 },
      { date: "Jan 22", value: 90000 },
      { date: "Jan 25", value: 94000 },
      { date: "Jan 28", value: 96000 },
      { date: "Feb 2", value: 98450 },
    ],
    recentTransactions: [
      { id: "t1", description: "Medicare Part B Payment", date: "Jan 19", amount: 4250.00 },
      { id: "t2", description: "Medicare Part A Claims", date: "Jan 16", amount: 8920.40 },
      { id: "t3", description: "Durable Medical Equipment", date: "Jan 12", amount: 2340.00 },
      { id: "t4", description: "Home Health Services", date: "Jan 7", amount: 5670.20 },
    ],
  },
  {
    id: "5",
    name: "Humana Virtual Account",
    identifier: "••1127",
    type: "Virtual Account",
    assignedTo: "Humana",
    balance: 67230.15,
    status: "Active",
    monthlyVolume: 198450.80,
    transactionCount: 45,
    avgTransaction: 4410.02,
    accountNumber: "6645231127",
    routingNumber: "121000248",
    createdDate: "Apr 15, 2024",
    balanceChange: 56.3,
    balanceTrend: [
      { date: "Jan 4", value: 52000 },
      { date: "Jan 7", value: 54000 },
      { date: "Jan 10", value: 56000 },
      { date: "Jan 13", value: 58000 },
      { date: "Jan 16", value: 60000 },
      { date: "Jan 19", value: 63000 },
      { date: "Jan 22", value: 62000 },
      { date: "Jan 25", value: 65000 },
      { date: "Jan 28", value: 66000 },
      { date: "Feb 2", value: 67230 },
    ],
    recentTransactions: [
      { id: "t1", description: "Medical Services Payment", date: "Jan 16", amount: 6780.40 },
      { id: "t2", description: "Preventive Care Claims", date: "Jan 13", amount: 2450.00 },
      { id: "t3", description: "Specialist Referral Payment", date: "Jan 9", amount: 4120.30 },
      { id: "t4", description: "Behavioral Health Services", date: "Jan 5", amount: 3890.00 },
    ],
  },
];
