import { X, Heart, Star, Calendar, Clock, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Movie } from "./MovieCard";

interface MovieDetailsProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const MovieDetails = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onClose,
  isOpen
}: MovieDetailsProps) => {
  if (!isOpen) return null;

  const posterUrl = movie.Poster && movie.Poster !== "N/A" 
    ? movie.Poster 
    : "https://via.placeholder.com/400x600/1a1a1a/666?text=No+Poster";

  return (
    <div className="fixed inset-0 z-50 bg-cinema-dark/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-card/95 backdrop-blur-md border-border/50 shadow-elevated animate-scale-in">
          <CardHeader className="relative p-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 h-8 w-8 p-0 rounded-full bg-cinema-dark/80 hover:bg-cinema-dark border-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Poster */}
              <div className="lg:w-1/3 relative">
                <div className="aspect-[2/3] lg:aspect-auto lg:h-full relative overflow-hidden">
                  <img
                    src={posterUrl}
                    alt={movie.Title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Favorite button overlay */}
                  <Button
                    size="sm"
                    variant={isFavorite ? "default" : "secondary"}
                    onClick={() => onToggleFavorite(movie)}
                    className={cn(
                      "absolute top-4 left-4 h-10 w-10 p-0 rounded-full backdrop-blur-sm",
                      isFavorite && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="lg:w-2/3 p-6 space-y-6">
                {/* Title and Rating */}
                <div className="space-y-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground leading-tight">
                    {movie.Title}
                  </h1>
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    {movie.imdbRating && movie.imdbRating !== "N/A" && (
                      <Badge variant="secondary" className="px-3 py-1 bg-cinema-elevated border-cinema-gold/30">
                        <Star className="h-4 w-4 mr-2 text-cinema-gold fill-current" />
                        {movie.imdbRating}/10
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.Year}</span>
                    </div>
                    
                    {movie.Runtime && movie.Runtime !== "N/A" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{movie.Runtime}</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.Genre && movie.Genre !== "N/A" && (
                    <div className="flex flex-wrap gap-2">
                      {movie.Genre.split(', ').map((genre) => (
                        <Badge 
                          key={genre} 
                          variant="outline" 
                          className="border-muted text-muted-foreground"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="bg-border/50" />

                {/* Plot */}
                {movie.Plot && movie.Plot !== "N/A" && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-card-foreground">Plot</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {movie.Plot}
                    </p>
                  </div>
                )}

                {/* Credits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.Director && movie.Director !== "N/A" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                        <User className="h-4 w-4" />
                        <span>Director</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {movie.Director}
                      </p>
                    </div>
                  )}
                  
                  {movie.Actors && movie.Actors !== "N/A" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                        <Users className="h-4 w-4" />
                        <span>Cast</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {movie.Actors}
                      </p>
                    </div>
                  )}
                </div>

                {/* Release Date */}
                {movie.Released && movie.Released !== "N/A" && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-card-foreground">Released</h4>
                    <p className="text-sm text-muted-foreground">
                      {movie.Released}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};