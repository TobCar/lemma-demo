import type { AddressData } from "@/components/onboarding/fields";
import type { FieldRow, FieldDef } from "@/components/onboarding/fields";

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

// TODO: migrate to Twilio Lookup API for phone validation
const PREMIUM_AREA_CODES = ["900", "976"];

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
  } else if (PREMIUM_AREA_CODES.includes(digits.substring(0, 3))) {
    errors[key] = "Premium-rate numbers are not allowed";
  }
}

function validateFieldDef(
  def: FieldDef,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>,
  errors: Record<string, string>,
) {
  const value = values[def.key];

  switch (def.type) {
    case "shield-banner":
      return;

    case "address":
      if (def.required) {
        validateAddress(value as AddressData, def.key, errors);
      }
      return;

    case "date":
      if (def.required && !value) {
        errors[def.key] = `${def.label} is required`;
      } else if (def.minAge && value) {
        const birth = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (age < def.minAge) {
          errors[def.key] = `Must be at least ${def.minAge} years old`;
        }
      }
      return;

    case "email":
      if (def.required) {
        validateEmail(value ?? "", def.key, errors, def.label);
      } else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[def.key] = "Please enter a valid email address";
      }
      return;

    case "url":
      if (value && !value.includes(".")) {
        errors[def.key] = "Please enter a valid URL";
      }
      return;

    case "dropdown":
      if (def.required && !value) {
        errors[def.key] = `${def.label} is required`;
      }
      return;

    case "text": {
      const str = (value ?? "") as string;
      if (def.required && !str.trim()) {
        errors[def.key] = `${def.label} is required`;
        return;
      }
      if (!str.trim()) return;
      switch (def.format) {
        case "ssn":
          validateSSN(str, def.key, errors);
          break;
        case "ein": {
          const digits = str.replace(/\D/g, "");
          if (digits.length !== 9) {
            errors[def.key] = "EIN must be exactly 9 digits";
          }
          break;
        }
        case "npi": {
          const digits = str.replace(/\D/g, "");
          if (digits.length !== 10) {
            errors[def.key] = "NPI must be exactly 10 digits";
          }
          break;
        }
        case "phone":
          validatePhone(str, def.key, errors);
          break;
        case "zip": {
          const digits = str.replace(/\D/g, "");
          if (digits.length !== 5) {
            errors[def.key] = "ZIP code must be exactly 5 digits";
          }
          break;
        }
      }
      return;
    }
  }
}

export function validateFields(
  fields: FieldRow[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const row of fields) {
    for (const def of row) {
      validateFieldDef(def, values, errors);
    }
  }
  return errors;
}
