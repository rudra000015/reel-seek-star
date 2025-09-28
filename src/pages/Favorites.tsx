import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Trash2, RefreshCw } from "lucide-react";
import { MovieCard } from '@/components/MovieCard';
import { MovieDetails } from '@/components/MovieDetails';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFavorites } from '@/hooks/useFavorites';
import { useMovies } from '@/hooks/useMovies';
import type { Movie } from '@/components/MovieCard';

interface FavoritesProps {
  apiKey?: string;
}

export const Favorites = ({ apiKey }: FavoritesProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const { favorites, toggleFavorite, isFavorite, clearFavorites, favoritesCount } = useFavorites();
  const { getMovieDetails } = useMovies(apiKey);

  const handleMovieDetails = async (movie: Movie) => {
    setSelectedMovie(movie);
    setDetailsLoading(true);
    
    try {
      const details = await getMovieDetails(movie.imdbID);
      setMovieDetails(details || movie);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setMovieDetails(movie);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="pt-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-8 w-8 text-cinema-red fill-current" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                My Favorites
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">
              {favoritesCount > 0 
                ? `${favoritesCount} movie${favoritesCount === 1 ? '' : 's'} in your collection`
                : 'Your favorite movies collection is empty'
              }
            </p>
          </div>

          {/* Actions */}
          {favoritesCount > 0 && (
            <div className="flex justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Favorites
              </Button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {favoritesCount === 0 && (
          <div className="text-center py-16 space-y-6">
            <div className="text-8xl opacity-20">💖</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">No favorites yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Start building your movie collection by searching for movies and adding them to your favorites.
              </p>
            </div>
          </div>
        )}

        {/* Favorites Grid */}
        {favoritesCount > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
              {favorites.map((movie, index) => (
                <MovieCard
                  key={`${movie.imdbID}-fav-${index}`}
                  movie={movie}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={handleMovieDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Movie Details Modal */}
        {selectedMovie && movieDetails && (
          <MovieDetails
            movie={movieDetails}
            isFavorite={isFavorite(movieDetails.imdbID)}
            onToggleFavorite={toggleFavorite}
            onClose={handleCloseDetails}
            isOpen={!!selectedMovie}
          />
        )}

        {/* Details Loading */}
        {selectedMovie && detailsLoading && (
          <div className="fixed inset-0 z-50 bg-cinema-dark/90 backdrop-blur-sm flex items-center justify-center">
            <LoadingSpinner 
              variant="cinema"
              size="lg" 
              text="Loading movie details..." 
            />
          </div>
        )}

        {/* API Key Warning */}
        {!apiKey && favoritesCount > 0 && (
          <Alert className="border-amber-500/50 bg-amber-500/5">
            <RefreshCw className="h-4 w-4" />
            <AlertDescription>
              <strong>Limited functionality:</strong> Add an OMDb API key to view detailed movie information.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};