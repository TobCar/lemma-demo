import { Label } from "@/components/ui/label";

interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export function FormLabel({ children, required }: FormLabelProps) {
  return (
    <Label>
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}
