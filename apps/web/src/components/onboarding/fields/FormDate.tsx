"use client";

import { FormLabel } from "./FormLabel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FieldError } from "./FieldError";

interface FormDateProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minYear?: number;
  maxDate?: Date;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
}

export function FormDate({
  label,
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
  minYear = 1900,
  maxDate,
  required,
  error,
  onBlur,
}: FormDateProps) {
  const max = maxDate ?? new Date();

  return (
    <div className="form-field">
      <FormLabel required={required}>{label}</FormLabel>
      <Popover
        onOpenChange={(isOpen) => {
          if (!isOpen) onBlur?.();
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "form-select-trigger w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {value ? format(value, "MM/dd/yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(minYear, 0)}
            endMonth={max}
            selected={value || undefined}
            onSelect={(date) => onChange(date || null)}
            disabled={(date) =>
              date > max || date < new Date(`${minYear}-01-01`)
            }
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <FieldError error={error} />
    </div>
  );
}
