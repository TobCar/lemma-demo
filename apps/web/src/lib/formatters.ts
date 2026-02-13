export function formatSSN(value: string): string {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function censorSSN(digits: string): string {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return "\u2022".repeat(digits.length);
  if (digits.length <= 5)
    return `\u2022\u2022\u2022-${"\u2022".repeat(digits.length - 3)}`;
  return `\u2022\u2022\u2022-\u2022\u2022-${digits.slice(5)}`;
}

export function formatEIN(value: string): string {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function displayEIN(digits: string): string {
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

/** Formats where value is raw digits, input is via onKeyDown, and display is formatted. */
export const digitOnlyFormats: Partial<
  Record<
    FormatterKey,
    { maxDigits: number; display: (digits: string) => string }
  >
> = {
  ssn: { maxDigits: 9, display: censorSSN },
  ein: { maxDigits: 9, display: displayEIN },
  phone: { maxDigits: 10, display: displayPhone },
};

export function formatNPI(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function formatPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function displayPhone(digits: string): string {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatZip(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

const formatters = {
  ssn: formatSSN,
  ein: formatEIN,
  npi: formatNPI,
  phone: formatPhone,
  zip: formatZip,
} as const;

export type FormatterKey = keyof typeof formatters;

export function applyFormatter(key: FormatterKey, value: string): string {
  return formatters[key](value);
}
