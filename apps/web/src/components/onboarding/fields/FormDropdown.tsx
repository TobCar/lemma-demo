"use client";

import { useState } from "react";
import { FormLabel } from "./FormLabel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  renderItemExtra?: (option: DropdownOption) => React.ReactNode;
  required?: boolean;
  description?: string;
  error?: string;
  onBlur?: () => void;
}

export function FormDropdown({
  label,
  value,
  onChange,
  options,
  placeholder,
  searchable,
  searchPlaceholder,
  renderItemExtra,
  required,
  description,
  error,
  onBlur,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  if (searchable) {
    return (
      <div className="form-field">
        <FormLabel required={required}>{label}</FormLabel>
        {description && (
          <p className="text-[13px] text-muted-foreground mt-1">
            {description}
          </p>
        )}
        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) onBlur?.();
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="form-select-trigger w-full justify-between font-normal"
            >
              {selected ? (
                <span className="truncate">{selected.label}</span>
              ) : (
                <span className="text-muted-foreground">
                  {placeholder ?? "Select..."}
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder={searchPlaceholder ?? "Search..."}
                className="h-10"
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => {
                        if (!option.disabled) {
                          onChange(option.value);
                          setOpen(false);
                        }
                      }}
                      className={cn(
                        option.disabled && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="text-[14px]">{option.label}</span>
                      {renderItemExtra?.(option)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FieldError error={error} />
      </div>
    );
  }

  return (
    <div className="form-field">
      <FormLabel required={required}>{label}</FormLabel>
      {description && (
        <p className="text-[13px] text-muted-foreground mt-1">{description}</p>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        onOpenChange={(isOpen) => {
          if (!isOpen) onBlur?.();
        }}
      >
        <SelectTrigger className="form-select-trigger">
          <SelectValue placeholder={placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError error={error} />
    </div>
  );
}
