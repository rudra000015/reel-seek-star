import { Loader2, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "default" | "cinema";
}

export const LoadingSpinner = ({ 
  size = "md", 
  text, 
  className,
  variant = "default"
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (variant === "cinema") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className="relative">
          <Film className={cn(sizeClasses[size], "text-primary animate-pulse")} />
          <div className="absolute inset-0 animate-spin">
            <div className={cn(
              sizeClasses[size], 
              "border-2 border-primary/30 border-t-primary rounded-full"
            )} />
          </div>
        </div>
        {text && (
          <p className={cn(textSizes[size], "text-muted-foreground animate-pulse")}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <span className={cn("text-muted-foreground", textSizes[size])}>
          {text}
        </span>
      )}
    </div>
  );
};