import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { MovieSearch } from './MovieSearch';
import { Favorites } from './Favorites';
import { useFavorites } from '@/hooks/useFavorites';

const Index = () => {
  const [currentView, setCurrentView] = useState<'search' | 'favorites'>('search');
  const { favoritesCount } = useFavorites();
  
  // For now, we'll show a warning about the API key
  // Users can add their API key when they connect to Supabase or Cloud
  const apiKey = undefined; // Will be set when they add their API key

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        favoritesCount={favoritesCount}
      />
      
      {currentView === 'search' ? (
        <MovieSearch apiKey={apiKey} />
      ) : (
        <Favorites apiKey={apiKey} />
      )}
    </div>
  );
};

export default Index;
