"use client";

import { useRef } from "react";
import { useState } from "react";
import { Upload, Check, X } from "lucide-react";
import { FormLabel } from "./FormLabel";
import { FieldError } from "./FieldError";
import { MAX_FILE_SIZE } from "@/data/onboarding/maxFileSize";

interface FormFileUploadProps {
  label?: string;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  prompt: string;
  required?: boolean;
  error?: string;
}

export function FormFileUpload({
  label,
  accept = ".pdf,image/*",
  value,
  onChange,
  prompt,
  required,
  error
}: FormFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [sizeError, setSizeError] = useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const maxMb = Math.round(MAX_FILE_SIZE / 1024 / 1024);
      setSizeError(`File is too large. Maximum size is ${maxMb} MB.`);
      e.target.value = "";
      return;
    }

    setSizeError(undefined);
    onChange(file);
  };

  const handleRemove = () => {
    setSizeError(undefined);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="form-field">
      {label && <FormLabel required={required}>{label}</FormLabel>}

      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center gap-2 text-[14px] text-accent">
          <Check className="w-4 h-4" />
          <span>{value.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="upload-link"
        >
          <Upload className="w-4 h-4" />
          {prompt}
        </button>
      )}

      <FieldError error={sizeError ?? error} />
    </div>
  );
}
