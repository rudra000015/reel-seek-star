import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const POPULAR_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  className?: string;
}

export const GenreFilter = ({ selectedGenres, onGenreChange, className }: GenreFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    onGenreChange(newGenres);
  };

  const clearAllGenres = () => {
    onGenreChange([]);
  };

  const hasActiveFilters = selectedGenres.length > 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Filter Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "relative",
              hasActiveFilters && "border-primary bg-primary/10"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Genre
            {hasActiveFilters && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {selectedGenres.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter by Genre</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllGenres}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <Button
                    key={genre}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleGenreToggle(genre)}
                    className={cn(
                      "justify-start h-8 text-sm font-normal",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                  >
                    {genre}
                  </Button>
                );
              })}
            </div>
            
            {hasActiveFilters && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Selected:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive/10"
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Quick access selected genres */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1 flex-wrap">
          {selectedGenres.slice(0, 3).map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/10"
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {selectedGenres.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{selectedGenres.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};