// src/components/common/ErrorMessage.tsx
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({
  message = "Something went wrong. Please try again.",
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive ${className}`}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}
