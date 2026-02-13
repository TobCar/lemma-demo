"use client";

import { Input } from "@/components/ui/input";
import { FormLabel } from "./FormLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US_STATES } from "@/data/usStates";
import { formatZip } from "@/lib/formatters";
import { FieldError } from "./FieldError";

export interface AddressData {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

interface FormAddressProps {
  label?: string;
  value: AddressData;
  onChange: (address: AddressData) => void;
  required?: boolean;
  description?: string;
  error?: string;
  onBlur?: () => void;
}

export function FormAddress({
  label,
  value,
  onChange,
  required,
  description,
  error,
  onBlur,
}: FormAddressProps) {
  const update = (patch: Partial<AddressData>) =>
    onChange({ ...value, ...patch });

  return (
    <div
      className="space-y-3"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onBlur?.();
      }}
    >
      <div>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        {description && (
          <p className="text-[13px] text-muted-foreground mt-0">
            {description}
          </p>
        )}
      </div>

      <Input
        placeholder="Address line 1"
        value={value.line1}
        onChange={(e) => update({ line1: e.target.value })}
        className="form-input"
      />

      <Input
        placeholder="Address line 2 (optional)"
        value={value.line2}
        onChange={(e) => update({ line2: e.target.value })}
        className="form-input"
      />

      <div className="address-grid">
        <div className="city">
          <Input
            placeholder="City"
            value={value.city}
            onChange={(e) => update({ city: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="state">
          <Select
            value={value.state}
            onValueChange={(v) => update({ state: v })}
          >
            <SelectTrigger className="form-select-trigger">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="zip">
          <Input
            placeholder="ZIP code"
            value={value.zip}
            onChange={(e) => update({ zip: formatZip(e.target.value) })}
            inputMode="numeric"
            maxLength={5}
            className="form-input"
          />
        </div>
      </div>
      <FieldError error={error} />
    </div>
  );
}
