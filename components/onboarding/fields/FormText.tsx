"use client";

import { Input } from "@/components/ui/input";
import { FormLabel } from "./FormLabel";
import { FieldError } from "./FieldError";
import { applyFormatter, type FormatterKey } from "@/lib/formatters";

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
}: FormTextProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(format ? applyFormatter(format, raw) : raw);
  };

  // maxLength accounts for formatting characters (dashes, parens, spaces)
  // e.g. SSN "123-45-6789" = 9 digits + 2 dashes = 11 chars
  const maxLengthForFormat = (fmt: FormatterKey): number | undefined => {
    switch (fmt) {
      case "ssn": return 11;
      case "ein": return 10;
      case "npi": return 10;
      case "phone": return 14;
      case "zip": return 5;
    }
  };

  const numericFormats: FormatterKey[] = ["ssn", "ein", "npi", "zip"];
  const resolvedInputMode = format === "phone" ? "tel" as const
    : format && numericFormats.includes(format) ? "numeric" as const
    : undefined;

  return (
    <div className="form-field">
      <FormLabel required={required}>{label}</FormLabel>
      <Input
        type={inputType}
        inputMode={resolvedInputMode}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
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
