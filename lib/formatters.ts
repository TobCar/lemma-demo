export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function formatEIN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

export function formatNPI(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatZip(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

const formatters = { ssn: formatSSN, ein: formatEIN, npi: formatNPI, phone: formatPhone, zip: formatZip } as const;

export type FormatterKey = keyof typeof formatters;

export function applyFormatter(key: FormatterKey, value: string): string {
  return formatters[key](value);
}
