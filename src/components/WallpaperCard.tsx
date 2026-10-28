import React, { useState, useEffect } from 'react';
import { Download, Heart, ExternalLink, Check, User } from 'lucide-react';
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
  // Pick lightweight mobile thumbnail (rawSrc.medium is ~50KB instead of 2MB original)
  const getThumbnailSrc = (wp: Wallpaper) => {
    return wp?.rawSrc?.medium || wp?.thumbUrl || wp?.imageUrl || wp?.url || '';
  };

  const initialSrc = getThumbnailSrc(wallpaper);
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!initialSrc);
  const [quickDownloading, setQuickDownloading] = useState(false);

  useEffect(() => {
    const nextSrc = getThumbnailSrc(wallpaper);
    setImgSrc(nextSrc);
    setIsLoaded(false);
    setHasError(!nextSrc);
  }, [wallpaper?.id, wallpaper?.rawSrc?.medium, wallpaper?.thumbUrl, wallpaper?.imageUrl, wallpaper?.url]);

  if (hasError) {
    return null;
  }

  const handleImageError = () => {
    const fallback = wallpaper?.thumbUrl || wallpaper?.imageUrl || wallpaper?.url;
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

  const resolutionBadge =
    wallpaper.width >= 3840
      ? '4K UHD'
      : wallpaper.width >= 2560
      ? '2K QHD'
      : wallpaper.height >= 2160
      ? '4K'
      : 'Full HD';

  const authorInitial = wallpaper.authorName ? wallpaper.authorName.charAt(0).toUpperCase() : 'P';
  const seoAltText = `PixelDrop - 4K Wallpaper ${wallpaper.title} by ${wallpaper.authorName}`;

  return (
    <div
      id={`wallpaper-card-${wallpaper.id}`}
      onClick={() => onSelect(wallpaper)}
      className="group wallpaper-card-contain relative mb-3 sm:mb-4 break-inside-avoid block w-full cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200 dark:bg-[#151720] transition-transform duration-150 active:scale-[0.98] hover:shadow-xl hover:shadow-black/40 touch-manipulation"
    >
      {/* Container with dynamic aspect-ratio based on image dimensions */}
      <div
        className="relative w-full overflow-hidden bg-zinc-100 dark:bg-[#12131a]"
        style={{
          aspectRatio: `${wallpaper.width || 16} / ${wallpaper.height || 9}`,
        }}
      >
        {/* Lightweight non-pulsing skeleton placeholder (zero GPU repaint loop) */}
        {!isLoaded && (
          <div className="absolute inset-0 w-full h-full bg-zinc-200 dark:bg-[#181a24]" />
        )}

        {/* Wallpaper Image with lightweight mobile thumbnail, async decode, and lazy load */}
        <img
          src={imgSrc}
          alt={seoAltText}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Vignette Gradient Overlay */}
        <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-black/60 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10" />

        {/* Top Controls: Resolution Badge & Favorite Button */}
        <div className="absolute top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 flex items-center justify-between z-20 pointer-events-none opacity-95 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <span className="pointer-events-auto px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase bg-black/80 md:bg-black/60 md:backdrop-blur-md text-white border border-white/10 shadow-xs">
            {resolutionBadge}
          </span>

          <button
            onClick={(e) => onToggleFavorite(wallpaper.id, e)}
            className={`pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-black/70 hover:bg-black/85 md:bg-black/50 md:backdrop-blur-md text-white hover:text-rose-400 border border-white/10'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save wallpaper'}
            aria-label="Save wallpaper"
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Vignette Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-95 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10" />

        {/* Bottom Bar: Pexels Style Author Info + Signature Download Button */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 flex items-center justify-between text-white z-20 opacity-95 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          {/* Author avatar & name */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1 sm:pr-2">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-black/60 md:bg-white/20 md:backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[10px] sm:text-[11px] font-bold shrink-0 shadow-xs">
              {authorInitial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-white drop-shadow-sm truncate">
                  {wallpaper.authorName}
                </span>
                {(wallpaper.authorProfile || wallpaper.authorLink) && (
                  <a
                    href={wallpaper.authorProfile || wallpaper.authorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-300 hover:text-white transition-colors"
                    title="View creator profile"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] text-zinc-300 drop-shadow-sm truncate capitalize">
                {wallpaper.category}
              </p>
            </div>
          </div>

          {/* Pexels Signature Download Button */}
          <button
            onClick={handleQuickDownload}
            className={`shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold shadow-md transition-all cursor-pointer ${
              quickDownloading
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white active:scale-95'
            }`}
            title="Download Free 4K Master"
            aria-label="Download 4K wallpaper"
          >
            {quickDownloading ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Free Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
