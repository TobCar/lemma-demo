import type { AddressData } from "@/components/onboarding/fields";

export function validateAddress(
  address: AddressData,
  key: string,
  errors: Record<string, string>,
) {
  if (
    !address.line1.trim() ||
    !address.city.trim() ||
    !address.state ||
    !address.zip.trim()
  ) {
    errors[key] = "Complete address is required";
  } else if (address.zip.length !== 5) {
    errors[key] = "ZIP code must be exactly 5 digits";
  }
}

export function validateSSN(
  ssn: string,
  key: string,
  errors: Record<string, string>,
) {
  const digits = ssn.replace(/\D/g, "");
  if (!digits) {
    errors[key] = "SSN is required";
  } else if (digits.length !== 9) {
    errors[key] = "SSN must be exactly 9 digits";
  }
}

export function validateEmail(
  email: string,
  key: string,
  errors: Record<string, string>,
  label = "Email",
) {
  if (!email.trim()) {
    errors[key] = `${label} is required`;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors[key] = "Please enter a valid email address";
  }
}

export function validatePhone(
  phone: string,
  key: string,
  errors: Record<string, string>,
) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    errors[key] = "Phone number is required";
  } else if (digits.length !== 10) {
    errors[key] = "Phone number must be exactly 10 digits";
  }
}
