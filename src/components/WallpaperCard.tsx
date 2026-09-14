import React, { useState } from 'react';
import { Download, Heart, ExternalLink, Check } from 'lucide-react';
import { Wallpaper } from '../types';
import { downloadWallpaperDirect } from '../services/pexels';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onSelect: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [quickDownloading, setQuickDownloading] = useState(false);

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickDownloading(true);
    const rawId = wallpaper.id.replace(/^pexels-|^pixabay-|^wallhaven-/, '');
    const filename = `PixelDrop-4K-${rawId}.jpg`;
    await downloadWallpaperDirect(wallpaper.url || wallpaper.fullUrl || wallpaper.imageUrl, filename, 'original');
    setTimeout(() => setQuickDownloading(false), 1200);
  };

  const seoAltText = `PixelDrop - Fond d'écran ${wallpaper.category.charAt(0).toUpperCase() + wallpaper.category.slice(1)} 4K by ${wallpaper.authorName}`;

  return (
    <div
      id={`wallpaper-card-${wallpaper.id}`}
      onClick={() => onSelect(wallpaper)}
      className="group relative mb-4 break-inside-avoid inline-block w-full cursor-pointer rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md shadow-md transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1"
    >
      {/* Container with dynamic aspect-ratio based on API dimensions (Prevents Layout Shift) */}
      <div
        className="relative w-full overflow-hidden bg-zinc-900/60"
        style={{
          aspectRatio: `${wallpaper.width || 16} / ${wallpaper.height || 9}`,
        }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 w-full h-full animate-pulse bg-zinc-800/40" />
        )}

        <img
          src={wallpaper.thumbUrl || wallpaper.imageUrl}
          alt={seoAltText}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 will-change-transform group-hover:scale-[1.03] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Floating Glass Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10">
              {wallpaper.category}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold border backdrop-blur-md ${
                wallpaper.source === 'wallhaven'
                  ? 'bg-purple-500/25 text-purple-300 border-purple-500/40'
                  : wallpaper.source === 'pixabay'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {wallpaper.source}
            </span>
          </div>

          <button
            onClick={(e) => onToggleFavorite(wallpaper.id, e)}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all pointer-events-auto cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/60 text-zinc-300 hover:text-rose-400 hover:bg-black/80 border border-white/10'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save wallpaper'}
            aria-label="Favorite wallpaper"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Subtle Dark Gradient Overlay on Hover with Photographer Name and Quick Download Icon */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between text-white z-10">
          <div className="flex-1 pr-2 min-w-0">
            <p className="text-xs font-semibold truncate text-zinc-100 drop-shadow-sm">
              {wallpaper.title}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-light truncate">
              <span>{wallpaper.source === 'wallhaven' ? 'Art by' : 'Photo by'}</span>
              <span className="font-medium text-zinc-200 truncate">
                {wallpaper.authorName}
              </span>
              {(wallpaper.authorProfile || wallpaper.authorLink) && (
                <a
                  href={wallpaper.authorProfile || wallpaper.authorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title={`Photographer profile on ${wallpaper.source}`}
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Download Icon Button */}
          <button
            onClick={handleQuickDownload}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all shrink-0 cursor-pointer ${
              quickDownloading
                ? 'bg-emerald-500/80 border-emerald-400 text-white'
                : 'bg-white/15 hover:bg-white/25 border-white/20 text-white hover:scale-105 active:scale-95'
            }`}
            title="Quick download 4K Ultra HD (Max Quality)"
            aria-label="Quick download 4K wallpaper"
          >
            {quickDownloading ? (
              <Check className="w-3.5 h-3.5 animate-bounce" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
