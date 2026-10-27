import React, { useState, useEffect } from 'react';
import { Download, Heart, ExternalLink, Check, ImageIcon } from 'lucide-react';
import { Wallpaper } from '../types';
import { downloadWallpaperDirectly } from '../utils/downloadHelper';

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
  const initialSrc = wallpaper?.thumbUrl || wallpaper?.imageUrl || wallpaper?.url || '';
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!initialSrc);
  const [quickDownloading, setQuickDownloading] = useState(false);

  // Sync state when wallpaper changes (e.g. infinite scroll or filter)
  useEffect(() => {
    const nextSrc = wallpaper?.thumbUrl || wallpaper?.imageUrl || wallpaper?.url || '';
    setImgSrc(nextSrc);
    setIsLoaded(false);
    setHasError(!nextSrc);
  }, [wallpaper?.id, wallpaper?.thumbUrl, wallpaper?.imageUrl, wallpaper?.url]);

  // If the image fails to load, remove the card entirely from the grid to eliminate black gaps
  if (hasError) {
    return null;
  }

  const handleImageError = () => {
    // Attempt fallback from thumbUrl to primary imageUrl/url before giving up
    const fallback = wallpaper?.imageUrl || wallpaper?.url;
    if (fallback && fallback !== imgSrc) {
      setImgSrc(fallback);
    } else {
      setHasError(true);
    }
  };

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickDownloading(true);
    try {
      await downloadWallpaperDirectly(wallpaper, 'original');
    } catch (err) {
      console.error('Quick download failed:', err);
    } finally {
      setTimeout(() => setQuickDownloading(false), 1500);
    }
  };

  const seoAltText = `PixelDrop - 4K Wallpaper ${wallpaper.title} by ${wallpaper.authorName}`;

  return (
    <div
      id={`wallpaper-card-${wallpaper.id}`}
      onClick={() => onSelect(wallpaper)}
      className="group relative mb-3 sm:mb-4 break-inside-avoid block w-full cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0f1118] transition-all duration-200 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-black/70"
    >
      {/* Container with dynamic aspect-ratio based on API dimensions (Prevents Layout Shift) */}
      <div
        className="relative w-full overflow-hidden bg-[#0c0d14]"
        style={{
          aspectRatio: `${wallpaper.width || 16} / ${wallpaper.height || 9}`,
        }}
      >
        {/* Lightweight Skeleton Loader */}
        {!isLoaded && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#11131c] z-0 pointer-events-none">
            <div className="flex flex-col items-center gap-1.5 opacity-40 select-none">
              <ImageIcon className="w-5 h-5 text-zinc-600 animate-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 font-medium">
                {wallpaper.source || '4K'}
              </span>
            </div>
          </div>
        )}

        <img
          src={imgSrc}
          alt={seoAltText}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.025] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10 pointer-events-none opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase bg-black/80 text-zinc-300 border border-white/10">
              {wallpaper.category}
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold bg-black/80 text-cyan-300 border border-cyan-500/20">
              {wallpaper.width >= 3840 ? '4K UHD' : wallpaper.width >= 2560 ? '2K QHD' : 'Full HD'}
            </span>
          </div>

          <button
            onClick={(e) => onToggleFavorite(wallpaper.id, e)}
            className={`p-2 rounded-full transition-all pointer-events-auto cursor-pointer flex items-center justify-center shadow-md ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-black/75 text-zinc-300 hover:text-rose-400 hover:bg-black border border-white/10'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save wallpaper'}
            aria-label="Favorite wallpaper"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Information Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-95 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between text-white z-10">
          <div className="flex-1 pr-2 min-w-0">
            <p className="text-xs font-medium truncate text-zinc-100">
              {wallpaper.title}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 truncate">
              <span>by</span>
              <span className="font-normal text-zinc-200 truncate">
                {wallpaper.authorName}
              </span>
              {(wallpaper.authorProfile || wallpaper.authorLink) && (
                <a
                  href={wallpaper.authorProfile || wallpaper.authorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Author profile"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Download Button */}
          <button
            onClick={handleQuickDownload}
            className={`p-2 rounded-lg border transition-colors shrink-0 cursor-pointer flex items-center justify-center ${
              quickDownloading
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-black/80 hover:bg-cyan-500 hover:text-black border-white/15 text-white active:scale-95'
            }`}
            title="Download 4K Ultra HD"
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
