export type MailType = "Check" | "EOB" | "Medical Records" | "Refund" | "Other";
export type MailStatus = "PENDING" | "PROCESSED";

export interface MailItem {
  id: string;
  receivedDate: string;
  receivedTime: string;
  type: MailType;
  sentBy: string;
  status: MailStatus;
  // Detail fields
  trackingNumber: string;
  // Type-specific fields
  checkNumber?: string;
  amount?: number;
  description?: string;
}

export const mailItems: MailItem[] = [
  {
    id: "1",
    receivedDate: "Jan 28, 2026",
    receivedTime: "01:15 AM",
    type: "Check",
    sentBy: "Blue Cross Blue Shield",
    status: "PENDING",
    trackingNumber: "USPS-8472910394",
    checkNumber: "#847291",
    amount: 12450.80,
    description: "Payment for Claims Batch #45892",
  },
  {
    id: "2",
    receivedDate: "Jan 27, 2026",
    receivedTime: "06:30 AM",
    type: "EOB",
    sentBy: "Aetna",
    status: "PROCESSED",
    trackingNumber: "USPS-7361829405",
    description: "Explanation of Benefits - Claims Period Dec 2025",
  },
  {
    id: "3",
    receivedDate: "Jan 27, 2026",
    receivedTime: "03:20 AM",
    type: "Medical Records",
    sentBy: "City General Hospital",
    status: "PROCESSED",
    trackingNumber: "USPS-6250718394",
    description: "Patient Transfer Records - 15 Files",
  },
  {
    id: "4",
    receivedDate: "Jan 26, 2026",
    receivedTime: "08:45 AM",
    type: "Refund",
    sentBy: "UnitedHealthcare",
    status: "PROCESSED",
    trackingNumber: "USPS-5149607283",
    checkNumber: "#UHC-29384",
    amount: 3420.50,
    description: "Overpayment Refund - Q4 2025",
  },
  {
    id: "5",
    receivedDate: "Jan 26, 2026",
    receivedTime: "02:30 AM",
    type: "Check",
    sentBy: "Cigna",
    status: "PROCESSED",
    trackingNumber: "USPS-4038596172",
    checkNumber: "#CIG-48291",
    amount: 8920.40,
    description: "Healthcare Claims Payment",
  },
  {
    id: "6",
    receivedDate: "Jan 25, 2026",
    receivedTime: "05:15 AM",
    type: "EOB",
    sentBy: "Blue Cross Blue Shield",
    status: "PROCESSED",
    trackingNumber: "USPS-3927485061",
    description: "Explanation of Benefits - Specialty Care",
  },
  {
    id: "7",
    receivedDate: "Jan 25, 2026",
    receivedTime: "01:00 AM",
    type: "Other",
    sentBy: "State Medical Board",
    status: "PROCESSED",
    trackingNumber: "USPS-2816374950",
    description: "License Renewal Documentation",
  },
  {
    id: "8",
    receivedDate: "Jan 24, 2026",
    receivedTime: "07:30 AM",
    type: "Medical Records",
    sentBy: "Regional Medical Center",
    status: "PROCESSED",
    trackingNumber: "USPS-1705263849",
    description: "Specialist Consultation Reports",
  },
  {
    id: "9",
    receivedDate: "Jan 24, 2026",
    receivedTime: "03:45 AM",
    type: "Check",
    sentBy: "Humana",
    status: "PROCESSED",
    trackingNumber: "USPS-0694152738",
    checkNumber: "#HUM-72918",
    amount: 5670.20,
    description: "Medical Services Reimbursement",
  },
];
