import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, BarChart3, FileText, RefreshCcw, Link2 } from "lucide-react";

const favorites = [
  {
    label: "Transactions",
    description: "View recent payments",
    href: "/transactions",
    icon: TrendingUp,
  },
  {
    label: "Claims",
    description: "Reconcile & match",
    href: "/claims",
    icon: BarChart3,
  },
  {
    label: "Insurance",
    description: "Payment tracking",
    href: "/insurance",
    icon: FileText,
  },
  {
    label: "Cash Sweeps",
    description: "Auto transfer rules",
    href: "/sweeps",
    icon: RefreshCcw,
  },
  {
    label: "Connections",
    description: "Payer setup & portals",
    href: "/connections",
    icon: Link2,
  },
];

export function FavoritesRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Favorites</p>
        <Button variant="outline" size="sm" className="text-xs rounded-full px-4 h-7">
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {favorites.map((fav, index) => (
          <Link
            key={fav.label}
            to={fav.href}
            className="group bg-card rounded-xl border border-border p-4 hover:shadow-soft transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <fav.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="section-label text-[10px]">{fav.label}</p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
