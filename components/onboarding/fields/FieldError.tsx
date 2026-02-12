import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  error?: string;
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;
  return (
    <p className="text-[13px] text-destructive flex items-center gap-1.5 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {error}
    </p>
  );
}
