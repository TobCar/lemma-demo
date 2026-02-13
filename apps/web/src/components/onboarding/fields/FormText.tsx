"use client";

import { Input } from "@/components/ui/input";
import { FormLabel } from "./FormLabel";
import { FieldError } from "./FieldError";
import {
  applyFormatter,
  digitOnlyFormats,
  type FormatterKey,
} from "@/lib/formatters";

interface FormTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  format?: FormatterKey;
  inputType?: string;
  required?: boolean;
  description?: string;
  error?: string;
  onBlur?: () => void;
}

export function FormText({
  label,
  value,
  onChange,
  placeholder,
  format,
  inputType,
  required,
  description,
  error,
  onBlur,
}: FormTextProps) {
  const digitOnly = format ? digitOnlyFormats[format] : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (digitOnly) return; // digit-only formats are handled via onKeyDown
    const raw = e.target.value;
    onChange(format ? applyFormatter(format, raw) : raw);
  };

  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!digitOnly) return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      if (value.length < digitOnly.maxDigits) {
        onChange(value + e.key);
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  // maxLength accounts for formatting characters (dashes, parens, spaces)
  const maxLengthForFormat = (fmt: FormatterKey): number | undefined => {
    switch (fmt) {
      case "ssn":
        return 11; // censored display: •••-••-6789
      case "ein":
        return 10; // display: 12-3456789
      case "npi":
        return 10;
      case "phone":
        return 14;
      case "zip":
        return 5;
    }
  };

  const numericFormats: FormatterKey[] = ["ssn", "ein", "npi", "zip"];
  const resolvedInputMode =
    format === "phone"
      ? ("tel" as const)
      : format && numericFormats.includes(format)
        ? ("numeric" as const)
        : undefined;

  const displayValue = digitOnly ? digitOnly.display(value) : value;

  return (
    <div className="form-field">
      <FormLabel required={required}>{label}</FormLabel>
      <Input
        type={inputType}
        inputMode={resolvedInputMode}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={digitOnly ? handleDigitKeyDown : undefined}
        onBlur={onBlur}
        className={`form-input${format ? " masked-input" : ""}`}
        maxLength={format ? maxLengthForFormat(format) : undefined}
      />
      {description && (
        <p className="text-[13px] text-muted-foreground mt-1">{description}</p>
      )}
      <FieldError error={error} />
    </div>
  );
}
