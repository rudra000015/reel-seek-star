import { useState, useCallback } from 'react';
import type { Movie } from '@/components/MovieCard';

interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  searchTerm: string;
  searchMovies: (term: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  getMovieDetails: (imdbID: string) => Promise<Movie | null>;
  reset: () => void;
}

export const useMovies = (apiKey?: string): UseMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = useCallback(async (term: string, page = 1) => {
    if (!apiKey) {
      setError('API key is required. Please add your OMDb API key.');
      return;
    }

    if (!term.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(term)}&page=${page}&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data: MovieSearchResponse = await response.json();
      
      if (data.Response === 'False') {
        setError(data.Error || 'No movies found');
        if (page === 1) {
          setMovies([]);
          setTotalResults(0);
        }
        return;
      }

      const newMovies = data.Search || [];
      
      if (page === 1) {
        setMovies(newMovies);
        setSearchTerm(term);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
      }
      
      setTotalResults(parseInt(data.totalResults || '0'));
      setCurrentPage(page);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search movies';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const loadMore = useCallback(async () => {
    if (searchTerm && !loading) {
      await searchMovies(searchTerm, currentPage + 1);
    }
  }, [searchTerm, currentPage, loading, searchMovies]);

  const getMovieDetails = useCallback(async (imdbID: string): Promise<Movie | null> => {
    if (!apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}&plot=full`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const data: any = await response.json();
      
      if (data.Response === 'False') {
        return null;
      }

      return data as Movie;
    } catch (err) {
      console.error('Error fetching movie details:', err);
      return null;
    }
  }, [apiKey]);

  const reset = useCallback(() => {
    setMovies([]);
    setError(null);
    setTotalResults(0);
    setCurrentPage(1);
    setSearchTerm('');
  }, []);

  return {
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
  };
};