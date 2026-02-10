import { motion } from "framer-motion";
import { Plus, ArrowLeftRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-6"
    >
      <h1 className="text-2xl font-semibold text-foreground">
        {greeting}, Dr. Chen
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 rounded-full px-5">
          <ArrowLeftRight className="h-4 w-4" />
          Transfer
        </Button>
        <Button variant="outline" className="gap-2 rounded-full px-5">
          <Send className="h-4 w-4" />
          Deposit
        </Button>
        <Button variant="outline" className="gap-2 rounded-full px-5">
          <Plus className="h-4 w-4" />
          Account
        </Button>
      </div>
    </motion.div>
  );
}
