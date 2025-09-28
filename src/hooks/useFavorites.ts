import { useState, useEffect } from 'react';
import type { Movie } from '@/components/MovieCard';

const FAVORITES_KEY = 'movieFinder_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = (movie: Movie) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.imdbID === movie.imdbID);
      
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.imdbID !== movie.imdbID);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isFavorite = (movieId: string) => {
    return favorites.some(fav => fav.imdbID === movieId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};