import { z } from "zod";

const stripNonDigits = z.string().transform((v) => v.replace(/\D/g, ""));

const PREMIUM_AREA_CODES = ["900", "976"];

export const zodPhone = stripNonDigits.pipe(
  z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .refine((d) => !PREMIUM_AREA_CODES.includes(d.substring(0, 3)), {
      message: "Premium-rate numbers are not allowed",
    }),
);

export const zodSSN = stripNonDigits.pipe(
  z.string().length(9, "SSN must be exactly 9 digits"),
);

export const zodEIN = stripNonDigits.pipe(
  z.string().length(9, "EIN must be exactly 9 digits"),
);

export const zodNPI = stripNonDigits.pipe(
  z.string().length(10, "NPI must be exactly 10 digits"),
);

export const zodZip = stripNonDigits.pipe(
  z.string().length(5, "ZIP code must be exactly 5 digits"),
);

export const zodEmail = z
  .string()
  .min(1, "Email is required")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address");

export const zodUrl = z
  .string()
  .refine((v) => !v || v.includes("."), "Please enter a valid URL");

export const zodAddress = z.object({
  line1: z.string().min(1, "Street address is required"),
  line2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: zodZip,
});
