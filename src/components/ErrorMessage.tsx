
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export const ErrorMessage = ({ 
  title = "Erro", 
  message, 
  className = "" 
}: ErrorMessageProps) => {
  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>{title}:</strong> {message}
      </AlertDescription>
    </Alert>
  );
};
