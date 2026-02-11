"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Mail, CheckCircle2, ExternalLink, Lock, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPayorDrawer } from "@/components/connections/AddPayorDrawer";
import { TablePagination, usePagination } from "@/components/ui/table-pagination";
import {
  payerConnections,
  portals,
  connectionStatusInfo,
  FinancialRoutingStatus,
} from "@/data/connections";
import { cn } from "@/lib/utils";

type TabType = "payers" | "portals";

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("payers");
  const [addPayorOpen, setAddPayorOpen] = useState(false);

  const clearinghousePortals = portals.filter((p) => p.category === "clearinghouse");
  const paymentPortals = portals.filter((p) => p.category === "payment");

  const { currentPage, totalPages, paginatedItems, goToPage, totalItems, itemsPerPage } =
    usePagination(payerConnections, 10);

  const getRoutingStatusIcon = (status: FinancialRoutingStatus) => {
    switch (status) {
      case "Active":
        return <Mail className="h-4 w-4" />;
      case "Pending":
        return <Mail className="h-4 w-4" />;
      case "Not Configured":
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">Connections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage payer connections, ERA setup, and portal access
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-6 border-b border-border">
          <button
            onClick={() => setActiveTab("payers")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === "payers"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Payers
            {activeTab === "payers" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("portals")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === "portals"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Portals
            {activeTab === "portals" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        </div>
      </motion.div>

      {activeTab === "payers" && (
        <>
          {/* Payers Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-start justify-between mb-6"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {payerConnections.length} payers connected
              </p>
              <p className="text-sm text-muted-foreground">
                Track ERA, virtual account, and lockbox setup status
              </p>
            </div>
            <Button
              onClick={() => setAddPayorOpen(true)}
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <Plus className="h-4 w-4" />
              Add Payor
            </Button>
          </motion.div>

          {/* Payers Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-card rounded-xl border border-border shadow-soft overflow-hidden mb-6"
          >
            {/* Table Header */}
            <div className="grid grid-cols-[200px_160px_180px_160px_140px] gap-4 px-6 py-4 border-b border-border">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Payer Name
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Claims Access (837)
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Remittance Access (835)
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Financial Routing
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Health & Activity
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {paginatedItems.map((payer, index) => (
                <motion.div
                  key={payer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.03 * index }}
                  className="grid grid-cols-[200px_160px_180px_160px_140px] gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{payer.name}</p>
                    <p className="text-xs text-muted-foreground">{payer.payerId}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{payer.claimsAccess}</div>
                  <div className="text-sm text-muted-foreground">{payer.remittanceAccess}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm",
                        payer.financialRouting === "Active"
                          ? "text-success"
                          : payer.financialRouting === "Pending"
                          ? "text-category-amber"
                          : "text-muted-foreground"
                      )}
                    >
                      {payer.financialRouting}
                    </span>
                    {getRoutingStatusIcon(payer.financialRouting)}
                  </div>
                  <div className="text-sm text-muted-foreground">{payer.lastActivity}</div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card rounded-xl border border-border shadow-soft p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <CircleHelp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <h3 className="text-sm font-semibold text-foreground">How Payer Connections Work</h3>
            </div>
            <div className="space-y-2 ml-8">
              {connectionStatusInfo.map((info) => (
                <p key={info.status} className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{info.status}:</span>{" "}
                  {info.description}
                </p>
              ))}
              <p className="text-sm text-muted-foreground pt-2">
                <span className="font-semibold text-foreground">Important:</span> Our connections
                are non-destructive and will not disrupt your existing billing or EHR workflows. We
                mirror your data without modifying your primary submitter IDs or payer relationships.
              </p>
            </div>
          </motion.div>
        </>
      )}

      {activeTab === "portals" && (
        <>
          {/* Portals Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6"
          >
            <p className="text-sm font-semibold text-foreground">Portal Access Management</p>
            <p className="text-sm text-muted-foreground">
              Share credentials securely with Lemma to enable automated data sync
            </p>
          </motion.div>

          {/* Clearinghouse Portals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Clearinghouse Portals
            </p>
            <div className="space-y-2">
              {clearinghousePortals.map((portal) => (
                <div
                  key={portal.id}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{portal.name}</p>
                        <span
                          className={cn(
                            "text-xs",
                            portal.isConnected ? "text-success" : "text-muted-foreground"
                          )}
                        >
                          {portal.isConnected ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{portal.description}</p>
                    </div>
                  </div>
                  {portal.isConnected ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Lock className="h-4 w-4" />
                      Share Credentials
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Portals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mb-6"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Payment Portals
            </p>
            <div className="space-y-2">
              {paymentPortals.map((portal) => (
                <div
                  key={portal.id}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{portal.name}</p>
                        <span
                          className={cn(
                            "text-xs",
                            portal.isConnected ? "text-success" : "text-muted-foreground"
                          )}
                        >
                          {portal.isConnected ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{portal.description}</p>
                    </div>
                  </div>
                  {portal.isConnected ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Lock className="h-4 w-4" />
                      Share Credentials
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card rounded-xl border border-border shadow-soft p-6"
          >
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Secure Credential Sharing
                </h3>
                <p className="text-sm text-muted-foreground">
                  All credentials are encrypted end-to-end and stored securely. Lemma uses your
                  portal access only to sync payment data and never modifies your account settings.
                  You can <span className="underline">revoke access</span> at any time.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Add Payor Drawer */}
      <AddPayorDrawer open={addPayorOpen} onClose={() => setAddPayorOpen(false)} />
    </>
  );
}
