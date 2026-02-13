import { DollarSign, FileText, ClipboardList, Settings } from "lucide-react";
import type { MailType } from "@/data/mailbox";

export const getTypeIcon = (type: MailType) => {
  switch (type) {
    case "Check":
    case "Refund":
      return DollarSign;
    case "EOB":
      return FileText;
    case "Medical Records":
      return ClipboardList;
    case "Other":
      return Settings;
    default:
      return FileText;
  }
};

export const formatCurrency = (value?: number) =>
  value == null
    ? "—"
    : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
