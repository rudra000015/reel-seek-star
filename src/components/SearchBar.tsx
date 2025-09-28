import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search for movies...",
  isLoading,
  className
}: SearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 h-12 text-base bg-input border-border/50",
            "focus:border-primary/50 focus:ring-1 focus:ring-primary/25",
            "placeholder:text-muted-foreground/60 transition-all duration-200"
          )}
          disabled={isLoading}
        />
        
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Button
        onClick={onSearch}
        disabled={!value.trim() || isLoading}
        className={cn(
          "h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
          isLoading && "animate-pulse"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            <span>Searching...</span>
          </div>
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
};