import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  lastFour: string;
  balance: number;
}

const accounts: Account[] = [
  { id: "1", name: "Blue Cross Blue Shield", lastFour: "1035", balance: 284750.45 },
  { id: "2", name: "Aetna", lastFour: "1062", balance: 156920.80 },
  { id: "3", name: "UnitedHealthcare", lastFour: "1089", balance: 342180.20 },
  { id: "4", name: "Medicare", lastFour: "1103", balance: 98450.60 },
  { id: "5", name: "Humana", lastFour: "1127", balance: 67230.15 },
];

export function AccountsList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card rounded-xl border border-border h-fit"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <p className="section-label">Accounts</p>
        <Link to="/accounts" className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Plus className="h-4 w-4" />
        </Link>
      </div>
      <div className="p-2">
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors cursor-pointer hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground">
                {account.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {account.name}
                </p>
                <p className="text-xs text-muted-foreground">••{account.lastFour}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground tabular-nums">
              ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="p-3 pt-0">
        <Link
          to="/accounts"
          className="block w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          View all accounts
        </Link>
      </div>
    </motion.div>
  );
}
