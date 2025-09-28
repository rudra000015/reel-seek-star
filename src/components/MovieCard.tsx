import { Heart, Star, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  imdbRating?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  Released?: string;
}

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  className?: string;
}

export const MovieCard = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  className
}: MovieCardProps) => {
  const posterUrl = movie.Poster && movie.Poster !== "N/A" 
    ? movie.Poster 
    : "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Poster";

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden bg-card border-border/50 shadow-movie-card",
        "hover:shadow-elevated hover:border-primary/30 transition-all duration-300",
        "hover:scale-[1.02] cursor-pointer animate-fade-in",
        className
      )}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-gradient-surface">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            className={cn(
              "h-8 w-8 p-0 rounded-full backdrop-blur-sm",
              isFavorite && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(movie);
            }}
            className="h-8 w-8 p-0 rounded-full backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Rating badge */}
        {movie.imdbRating && movie.imdbRating !== "N/A" && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-cinema-dark/80 backdrop-blur-sm border-cinema-gold/30"
          >
            <Star className="h-3 w-3 mr-1 text-cinema-gold fill-current" />
            {movie.imdbRating}
          </Badge>
        )}
      </div>

      <CardContent 
        className="p-4 space-y-2"
        onClick={() => onViewDetails(movie)}
      >
        <div className="space-y-1">
          <h3 className="font-semibold text-card-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors duration-200">
            {movie.Title}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{movie.Year}</span>
            {movie.Type && (
              <>
                <span>•</span>
                <span className="capitalize">{movie.Type}</span>
              </>
            )}
          </div>
        </div>

        {movie.Genre && (
          <div className="flex flex-wrap gap-1">
            {movie.Genre.split(', ').slice(0, 2).map((genre) => (
              <Badge 
                key={genre} 
                variant="outline" 
                className="text-xs px-2 py-0 border-muted"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};