import { Film, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentView: 'search' | 'favorites';
  onViewChange: (view: 'search' | 'favorites') => void;
  favoritesCount: number;
  className?: string;
}

export const Navigation = ({ 
  currentView, 
  onViewChange, 
  favoritesCount,
  className 
}: NavigationProps) => {
  return (
    <nav className={cn("flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border/50", className)}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Film className="h-8 w-8 text-primary" />
          <div className="absolute inset-0 animate-pulse-glow opacity-50" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">MovieFinder</h1>
          <p className="text-xs text-muted-foreground">Discover amazing movies</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={currentView === 'search' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('search')}
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            currentView === 'search' && "bg-primary text-primary-foreground"
          )}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>

        <Button
          variant={currentView === 'favorites' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('favorites')}
          className={cn(
            "flex items-center gap-2 relative transition-all duration-200",
            currentView === 'favorites' && "bg-primary text-primary-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", favoritesCount > 0 && "text-cinema-red fill-current")} />
          <span className="hidden sm:inline">Favorites</span>
          
          {favoritesCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-cinema-red border-0 animate-scale-in"
            >
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </Badge>
          )}
        </Button>
      </div>
    </nav>
  );
};