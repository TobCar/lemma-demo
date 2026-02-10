import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import InsurancePayments from "./pages/InsurancePayments";
import Accounts from "./pages/Accounts";
import DigitalMailbox from "./pages/DigitalMailbox";
import CashSweeps from "./pages/CashSweeps";
import ClaimReconciliation from "./pages/ClaimReconciliation";
import Capital from "./pages/Capital";
import Connections from "./pages/Connections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insurance" element={<InsurancePayments />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/mailbox" element={<DigitalMailbox />} />
          <Route path="/sweeps" element={<CashSweeps />} />
          <Route path="/claims" element={<ClaimReconciliation />} />
          <Route path="/capital" element={<Capital />} />
          <Route path="/connections" element={<Connections />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
