import { useEffect, useRef, useState } from 'react';
import type { Movie } from '@/components/MovieCard';

interface DomeGalleryProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
  fit?: number;
  minRadius?: number;
  segments?: number;
  grayscale?: boolean;
  className?: string;
}

export const DomeGallery = ({
  movies,
  onMovieClick,
  fit = 0.8,
  minRadius = 400,
  segments = 24,
  grayscale = false,
  className = ''
}: DomeGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Limit movies to prevent performance issues
  const displayMovies = movies.slice(0, segments);

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setRotation(prev => ({
          ...prev,
          y: prev.y + 0.2 // Auto-rotate slowly
        }));
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  if (displayMovies.length === 0) return null;

  return (
    <div className={`relative w-full h-64 md:h-80 overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          
          const startX = e.clientX;
          const startY = e.clientY;
          const startRotation = { ...rotation };
          
          const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            setRotation({
              x: Math.max(-15, Math.min(15, startRotation.x + dy * 0.1)),
              y: startRotation.y + dx * 0.2
            });
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragging(false);
          };
          
          setIsDragging(true);
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {displayMovies.map((movie, index) => {
            const angle = (index / displayMovies.length) * 2 * Math.PI;
            const radius = Math.max(minRadius * fit, 200);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <div
                key={movie.imdbID}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{
                  transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}rad)`,
                  width: '120px',
                  height: '160px'
                }}
                onClick={() => onMovieClick?.(movie)}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className={`w-full h-full object-cover ${grayscale ? 'grayscale hover:grayscale-0' : ''} transition-all duration-300`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground text-center p-2">
                        {movie.Title}
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay with movie info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                                opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-white text-xs font-semibold leading-tight line-clamp-2">
                        {movie.Title}
                      </h4>
                      <p className="text-white/80 text-xs mt-1">
                        {movie.Year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
          {isDragging ? 'Release to continue rotation' : 'Drag to explore • Click to view details'}
        </p>
      </div>
    </div>
  );
};