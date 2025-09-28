import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { MovieSearch } from './MovieSearch';
import { Favorites } from './Favorites';
import { useFavorites } from '@/hooks/useFavorites';

const Index = () => {
  const [currentView, setCurrentView] = useState<'search' | 'favorites'>('search');
  const { favoritesCount } = useFavorites();
  
  // OMDb API key for movie search
  const apiKey = '435bc363';

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
