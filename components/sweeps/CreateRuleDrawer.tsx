"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Scale, RefreshCw, ArrowLeft } from "lucide-react";
import { RuleType, ruleTypeOptions } from "@/data/cashSweeps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface CreateRuleDrawerProps {
  open: boolean;
  onClose: () => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "arrow-right":
      return ArrowRight;
    case "scale":
      return Scale;
    case "refresh":
      return RefreshCw;
    default:
      return ArrowRight;
  }
};

export function CreateRuleDrawer({ open, onClose }: CreateRuleDrawerProps) {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedType, setSelectedType] = useState<RuleType | null>(null);
  const [percentage, setPercentage] = useState(0);

  const handleTypeSelect = (type: RuleType) => {
    setSelectedType(type);
    setStep("configure");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedType(null);
  };

  const handleClose = () => {
    setStep("select");
    setSelectedType(null);
    onClose();
  };

  const renderRuleTypeSelection = () => (
    <>
      <SheetHeader className="px-6 py-5 border-b border-border">
        <div>
          <SheetTitle className="text-xl font-semibold">Auto Cash Sweep</SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create rules that move money between your bank accounts.
          </p>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {ruleTypeOptions.map((option) => {
          const Icon = getIcon(option.icon);
          return (
            <button
              key={option.type}
              onClick={() => handleTypeSelect(option.type)}
              className="w-full p-5 border border-border rounded-xl text-left hover:bg-secondary/50 transition-colors flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{option.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  const renderDistributeForm = () => (
    <>
      <SheetHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <SheetTitle className="text-xl font-semibold">Distribute funds across accounts</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically move money to other accounts.
            </p>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Transfer</label>
          <Select defaultValue="percentage">
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select transfer type" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="percentage">a percentage of account balance</SelectItem>
              <SelectItem value="fixed">a set amount of funds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">From</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Starting account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">└</span>
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-20 bg-background"
            />
            <span className="text-muted-foreground">%</span>
          </div>
          <span className="text-muted-foreground">to</span>
          <Select>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Destination account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button className="flex items-center gap-2 text-sm text-foreground hover:underline">
          <span className="text-muted-foreground">└</span>
          Add destination account
        </button>

        <div className="pt-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{percentage}% destination account</span>
            <span>{100 - percentage}% starting account</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Repeat</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="daily">Every business day</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border p-6 flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          Next
        </Button>
      </div>
    </>
  );

  const renderMaintainForm = () => (
    <>
      <SheetHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <SheetTitle className="text-xl font-semibold">Maintain a target account balance</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Transfer funds into or out of an account when it reaches certain thresholds.
            </p>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <label className="text-sm text-muted-foreground whitespace-nowrap">If the balance of</label>
          <Select>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Select defaultValue="not-exactly">
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="not-exactly">is not exactly</SelectItem>
              <SelectItem value="lower-than">is lower than</SelectItem>
              <SelectItem value="higher-than">is higher than</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input type="number" placeholder="Target balance" className="pl-7 bg-background" />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Then restore the balance using</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Supporting account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Repeat</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="daily">Every business day</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border p-6 flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          Next
        </Button>
      </div>
    </>
  );

  const renderScheduleForm = () => (
    <>
      <SheetHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <SheetTitle className="text-xl font-semibold">Schedule recurring transfers</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Move funds out of an account at a regular time.
            </p>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Transfer</label>
          <Select defaultValue="fixed">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="fixed">a set amount of funds</SelectItem>
              <SelectItem value="percentage">a percentage of account balance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">From</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Starting account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">└</span>
          <div className="relative w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input type="number" className="pl-7 bg-background" />
          </div>
          <span className="text-muted-foreground">to</span>
          <Select>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Destination account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button className="flex items-center gap-2 text-sm text-foreground hover:underline">
          <span className="text-muted-foreground">└</span>
          Add destination account
        </button>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Repeat</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="daily">Every business day</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border p-6 flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          Next
        </Button>
      </div>
    </>
  );

  const renderRedirectForm = () => (
    <>
      <SheetHeader className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <SheetTitle className="text-xl font-semibold">Redirect incoming funds</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sweep all funds into another account.
            </p>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Transfer</label>
          <Select defaultValue="percentage">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="percentage">a percentage of incoming funds</SelectItem>
              <SelectItem value="all">all incoming funds</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            This includes internal transfers as well as any incoming ACH, wire, or check deposits
          </p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">From</label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Starting account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">└</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-20 bg-background"
            />
            <span className="text-muted-foreground">%</span>
          </div>
          <span className="text-muted-foreground">to</span>
          <Select>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Destination account" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="checking">Checking ••4212</SelectItem>
              <SelectItem value="savings">Savings ••7534</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button className="flex items-center gap-2 text-sm text-foreground hover:underline">
          <span className="text-muted-foreground">└</span>
          Add destination account
        </button>

        <div className="pt-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{percentage}% destination account</span>
            <span>{100 - percentage}% starting account</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-6 flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          Next
        </Button>
      </div>
    </>
  );

  const renderConfigureForm = () => {
    switch (selectedType) {
      case "distribute":
        return renderDistributeForm();
      case "maintain":
        return renderMaintainForm();
      case "schedule":
        return renderScheduleForm();
      case "redirect":
        return renderRedirectForm();
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {step === "select" ? renderRuleTypeSelection() : renderConfigureForm()}
      </SheetContent>
    </Sheet>
  );
}
