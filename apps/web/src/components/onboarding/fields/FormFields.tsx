"use client";

import { Fragment } from "react";
import { Shield } from "lucide-react";
import { FormText } from "./FormText";
import { FormDropdown, type DropdownOption } from "./FormDropdown";
import { FormDate } from "./FormDate";
import { FormAddress, type AddressData } from "./FormAddress";
import type { FormatterKey } from "@/lib/formatters";

// ── Field definition types ──────────────────────────────────────────

export type TextFieldDef = {
  type: "text";
  key: string;
  label: string;
  placeholder?: string;
  format?: FormatterKey;
  inputType?: string;
  required?: boolean;
  description?: string;
};

export type DropdownFieldDef = {
  type: "dropdown";
  key: string;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  required?: boolean;
  description?: string;
};

export type AddressFieldDef = {
  type: "address";
  key: string;
  label?: string;
  required?: boolean;
  description?: string;
};

export type DateFieldDef = {
  type: "date";
  key: string;
  label: string;
  placeholder?: string;
  minYear?: number;
  maxDate?: Date;
  required?: boolean;
  minAge?: number;
};

export type EmailFieldDef = {
  type: "email";
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
};

export type UrlFieldDef = {
  type: "url";
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
};

export type ShieldBannerFieldDef = {
  type: "shield-banner";
  key: string;
  text: string;
};

export type FieldDef =
  | TextFieldDef
  | DropdownFieldDef
  | AddressFieldDef
  | DateFieldDef
  | EmailFieldDef
  | UrlFieldDef
  | ShieldBannerFieldDef;

export type FieldRow = FieldDef[];

// ── Renderer ────────────────────────────────────────────────────────

interface FormFieldsProps {
  fields: FieldRow[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  onChange: (key: string, value: unknown) => void;
  errors?: Record<string, string>;
}

function renderField(
  def: FieldDef,
  values: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void,
  errors?: Record<string, string>,
) {
  const error = errors?.[def.key];

  switch (def.type) {
    case "text":
      return (
        <FormText
          key={def.key}
          label={def.label}
          value={(values[def.key] as string) ?? ""}
          onChange={(v) => onChange(def.key, v)}
          placeholder={def.placeholder}
          format={def.format}
          inputType={def.inputType}
          required={def.required}
          description={def.description}
          error={error}
        />
      );
    case "dropdown":
      return (
        <FormDropdown
          key={def.key}
          label={def.label}
          value={(values[def.key] as string) ?? ""}
          onChange={(v) => onChange(def.key, v)}
          options={def.options}
          placeholder={def.placeholder}
          searchable={def.searchable}
          searchPlaceholder={def.searchPlaceholder}
          required={def.required}
          description={def.description}
          error={error}
        />
      );
    case "date":
      return (
        <FormDate
          key={def.key}
          label={def.label}
          value={(values[def.key] as Date | null) ?? null}
          onChange={(v) => onChange(def.key, v)}
          placeholder={def.placeholder}
          minYear={def.minYear}
          maxDate={def.maxDate}
          required={def.required}
          error={error}
        />
      );
    case "email":
      return (
        <FormText
          key={def.key}
          label={def.label}
          value={(values[def.key] as string) ?? ""}
          onChange={(v) => onChange(def.key, v)}
          placeholder={def.placeholder}
          inputType="email"
          required={def.required}
          description={def.description}
          error={error}
        />
      );
    case "url":
      return (
        <FormText
          key={def.key}
          label={def.label}
          value={(values[def.key] as string) ?? ""}
          onChange={(v) => onChange(def.key, v)}
          placeholder={def.placeholder}
          required={def.required}
          description={def.description}
          error={error}
        />
      );
    case "shield-banner":
      return (
        <div key={def.key} className="trust-signal">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{def.text}</span>
        </div>
      );
    case "address":
      return (
        <FormAddress
          key={def.key}
          label={def.label}
          value={values[def.key] as AddressData}
          onChange={(v) => onChange(def.key, v)}
          required={def.required}
          description={def.description}
          error={error}
        />
      );
  }
}

const gridColsClass: Record<number, string> = {
  2: "grid grid-cols-2 gap-4",
  3: "grid grid-cols-3 gap-4",
  4: "grid grid-cols-4 gap-4",
};

export function FormFields({ fields, values, onChange, errors }: FormFieldsProps) {
  return (
    <>
      {fields.map((row, i) => {
        if (row.length === 1) {
          return (
            <Fragment key={row[0].key}>
              {renderField(row[0], values, onChange, errors)}
            </Fragment>
          );
        }
        return (
          <div key={i} className={gridColsClass[row.length]}>
            {row.map((def) => renderField(def, values, onChange, errors))}
          </div>
        );
      })}
    </>
  );
}
