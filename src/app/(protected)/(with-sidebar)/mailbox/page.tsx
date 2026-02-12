"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Search,
  DollarSign,
  FileText,
  ClipboardList,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MailDetail } from "@/components/mailbox/MailDetail";
import type { MailItem, MailType, MailStatus } from "@/data/mailbox";
import { cn } from "@/lib/utils";
import {
  TablePagination,
  usePagination,
} from "@/components/ui/table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const getTypeIcon = (type: MailType) => {
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

const typeOptions: (MailType | "All Types")[] = [
  "All Types",
  "Check",
  "EOB",
  "Medical Records",
  "Refund",
  "Other",
];
const statusOptions: (MailStatus | "All Status")[] = [
  "All Status",
  "PENDING",
  "PROCESSED",
];

export default function DigitalMailboxPage() {
  const [mailItems, setMailItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MailType | "All Types">(
    "All Types",
  );
  const [selectedStatus, setSelectedStatus] = useState<
    MailStatus | "All Status"
  >("All Status");

  useEffect(() => {
    async function fetchMail() {
      try {
        const res = await fetch("/api/mailbox");
        if (!res.ok) throw new Error("Failed to load mailbox");
        const data: MailItem[] = await res.json();
        setMailItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchMail();
  }, []);

  const handleRowClick = (mail: MailItem) => {
    setSelectedMail(mail);
    setDetailOpen(true);
  };

  const filteredMail = mailItems.filter((mail) => {
    const searchMatch =
      searchQuery === "" ||
      mail.sentBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.type.toLowerCase().includes(searchQuery.toLowerCase());

    const typeMatch =
      selectedType === "All Types" || mail.type === selectedType;
    const statusMatch =
      selectedStatus === "All Status" || mail.status === selectedStatus;

    return searchMatch && typeMatch && statusMatch;
  });

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredMail, 10);

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          Digital Mailbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Physical mail received and digitized for your practice
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-card rounded-xl border border-border shadow-soft p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by sender or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 min-w-[140px] justify-between"
                >
                  {selectedType}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                {typeOptions.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 min-w-[130px] justify-between"
                >
                  {selectedStatus}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card rounded-xl border border-border shadow-soft overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[200px_200px_1fr_140px] gap-4 px-6 py-4 border-b border-border">
          <div className="text-xs font-normal text-muted-foreground">
            Received
          </div>
          <div className="text-xs font-normal text-muted-foreground">Type</div>
          <div className="text-xs font-normal text-muted-foreground">
            Sent By
          </div>
          <div className="text-xs font-normal text-muted-foreground">
            Status
          </div>
        </div>

        {/* Table Body */}
        <Suspense fallback={<MailboxRowsSkeleton rows={10} />}>
          <div className="divide-y divide-border">
            {error ? (
              <div className="flex items-center justify-center h-40 px-6">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            ) : loading ? (
              <MailboxRowsSkeleton rows={10} />
            ) : paginatedItems.length === 0 ? (
              <div className="flex items-center justify-center h-40 px-6">
                <p className="text-sm text-muted-foreground">No mail found.</p>
              </div>
            ) : (
              paginatedItems.map((mail, index) => {
                const TypeIcon = getTypeIcon(mail.type);
                const isSelected = selectedMail?.id === mail.id && detailOpen;

                return (
                  <motion.div
                    key={mail.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.03 * index }}
                    onClick={() => handleRowClick(mail)}
                    className={cn(
                      "grid grid-cols-[200px_200px_1fr_140px] gap-4 px-6 py-4 cursor-pointer transition-colors",
                      isSelected ? "bg-secondary/70" : "hover:bg-secondary/50",
                    )}
                  >
                    <div className="text-sm text-muted-foreground">
                      {mail.receivedDate}, {mail.receivedTime}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {mail.type}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {mail.sentBy}
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium uppercase tracking-wider",
                        mail.status === "PENDING"
                          ? "text-category-amber"
                          : "text-success",
                      )}
                    >
                      {mail.status}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Suspense>

        {/* Pagination */}
        <TablePagination
          currentPage={loading || !!error ? 1 : currentPage}
          totalPages={loading || !!error ? 1 : totalPages}
          onPageChange={goToPage}
          totalItems={loading || !!error ? 0 : totalItems}
          itemsPerPage={itemsPerPage}
        />
      </motion.div>

      {/* Mail Detail Sheet */}
      <MailDetail
        mail={selectedMail}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}

function MailboxRowsSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[200px_200px_1fr_140px] gap-4 px-6 py-4"
        >
          <SkeletonBlock className="h-4 w-44" />
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-8 w-8 rounded-lg" />
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <SkeletonBlock className="h-4 w-52" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
      ))}
    </>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded bg-secondary/25",
        className,
      )}
    >
      <div className="absolute inset-0 animate-pulse" />
    </div>
  );
}
