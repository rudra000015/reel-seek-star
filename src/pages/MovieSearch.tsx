import { useState, useCallback } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { MovieDetails } from '@/components/MovieDetails';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DomeGallery } from '@/components/DomeGallery';
import { GenreFilter } from '@/components/GenreFilter';
import { useMovies } from '@/hooks/useMovies';
import { useFavorites } from '@/hooks/useFavorites';
import type { Movie } from '@/components/MovieCard';

interface MovieSearchProps {
  apiKey?: string;
}

export const MovieSearch = ({ apiKey }: MovieSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const { 
    movies, 
    loading, 
    error, 
    totalResults, 
    currentPage, 
    searchTerm,
    searchMovies, 
    loadMore, 
    getMovieDetails,
    reset 
  } = useMovies(apiKey);

  const { toggleFavorite, isFavorite } = useFavorites();

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim()) {
      // Add genre filter to search query
      const genreQuery = selectedGenres.length > 0 
        ? `${searchQuery.trim()} ${selectedGenres.join(' ')}`
        : searchQuery.trim();
      await searchMovies(genreQuery);
    }
  }, [searchQuery, selectedGenres, searchMovies]);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    reset();
  };

  const handleMovieDetails = useCallback(async (movie: Movie) => {
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
  }, [getMovieDetails]);

  const handleCloseDetails = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const canLoadMore = movies.length < totalResults && !loading;
  const hasResults = movies.length > 0;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-backdrop p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>API Key Required:</strong> You need an OMDb API key to search for movies. 
              <br />
              Get your free API key at{' '}
              <a 
                href="https://www.omdbapi.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                omdbapi.com
              </a>
              {' '}and add it to your project settings.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-backdrop">
      <div className="container mx-auto p-4 space-y-8">
        {/* Search Section */}
        <div className="pt-8 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Discover Amazing Movies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search through millions of movies and build your personal favorites collection
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onClear={handleClear}
              isLoading={loading}
              placeholder="Search for movies, TV shows..."
            />
            
            <div className="flex justify-center">
              <GenreFilter
                selectedGenres={selectedGenres}
                onGenreChange={setSelectedGenres}
              />
            </div>
          </div>
        </div>

        {/* Dome Gallery - Only show when there are movies */}
        {hasResults && !loading && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Explore Movies
              </h3>
              <p className="text-sm text-muted-foreground">
                Interactive 3D gallery of your search results
              </p>
            </div>
            <DomeGallery 
              movies={movies}
              onMovieClick={handleMovieDetails}
              className="mb-8"
              grayscale={true}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch()}
                  className="ml-4"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {loading && movies.length === 0 && (
          <div className="flex justify-center py-12">
            <LoadingSpinner 
              variant="cinema"
              size="lg" 
              text="Searching for movies..." 
            />
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {movies.length} of {totalResults.toLocaleString()} results for{' '}
                <span className="text-foreground font-medium">"{searchTerm}"</span>
              </p>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
              {movies.map((movie, index) => (
                <MovieCard
                  key={`${movie.imdbID}-${index}`}
                  movie={movie}
                  isFavorite={isFavorite(movie.imdbID)}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={handleMovieDetails}
                />
              ))}
            </div>

            {/* Load More */}
            {canLoadMore && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  size="lg"
                  className="px-8"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Loading more...
                    </>
                  ) : (
                    `Load More (${totalResults - movies.length} remaining)`
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && searchTerm && !hasResults && (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🎬</div>
            <h3 className="text-xl font-semibold text-foreground">No movies found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any movies matching "{searchTerm}". Try adjusting your search terms.
            </p>
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
      </div>
    </div>
  );
};