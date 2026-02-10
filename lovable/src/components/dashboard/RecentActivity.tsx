import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
}

const transactions: Transaction[] = [
  {
    id: "1",
    title: "Payroll Services Inc",
    description: "Biweekly Payroll - 15 Employees",
    amount: -28450.00,
    date: "Jan 19",
    type: "debit",
  },
  {
    id: "2",
    title: "Blue Cross Blue Shield",
    description: "Medical Claims Payment - Batch #45892",
    amount: 15680.50,
    date: "Jan 19",
    type: "credit",
  },
  {
    id: "3",
    title: "Blue Cross Blue Shield",
    description: "Medical Claims Payment - Check",
    amount: 8420.75,
    date: "Jan 18",
    type: "credit",
  },
  {
    id: "4",
    title: "UnitedHealthcare",
    description: "Wire Transfer - Claims Settlement",
    amount: 45230.75,
    date: "Jan 18",
    type: "credit",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-xl border border-border"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <p className="section-label">Recent Activity</p>
        <Link to="/transactions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all →
        </Link>
      </div>
      <div className="p-2">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary cursor-pointer"
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
                transaction.type === "credit"
                  ? "bg-success/10 text-success"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {transaction.type === "credit" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {transaction.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {transaction.description}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-medium tabular-nums",
                  transaction.type === "credit" ? "text-success" : "text-foreground"
                )}
              >
                {transaction.type === "credit" ? "+" : ""}
                ${Math.abs(transaction.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
