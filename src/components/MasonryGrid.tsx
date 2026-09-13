import React, { useEffect, useRef } from 'react';
import { WallpaperCard } from './WallpaperCard';
import { AdSensePlaceholder } from './AdSensePlaceholder';
import { Wallpaper } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface MasonryGridProps {
  wallpapers: Wallpaper[];
  favorites: string[];
  isLoadingMore: boolean;
  hasMore: boolean;
  onSelect: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onResetSearch: () => void;
  onOpenPrivacyModal: () => void;
  onLoadMore: () => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  wallpapers,
  favorites,
  isLoadingMore,
  hasMore,
  onSelect,
  onToggleFavorite,
  onResetSearch,
  onOpenPrivacyModal,
  onLoadMore,
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for seamless infinite scroll (fetches next 40 images)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '400px 0px', // Trigger fetching 400px before reaching the bottom
        threshold: 0.05,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (wallpapers.length === 0 && !isLoadingMore) {
    return (
      <div className="w-full py-24 px-4 text-center rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">
          No wallpapers found matching this filter
        </h3>
        <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
          Try adjusting your search query or clear the active category filters to browse our infinite high-resolution 4K catalog.
        </p>
        <button
          onClick={onResetSearch}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Responsive Masonry Grid (Fast, volume-oriented CSS columns) */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {wallpapers.map((wallpaper, index) => {
          const isFavorite = favorites.includes(wallpaper.id);
          // Injected Square Ad 250x250 every 12th item naturally
          const showAd = (index + 1) % 12 === 0;

          return (
            <React.Fragment key={wallpaper.id}>
              {/* Wallpaper Card Component with stable key & layout-shift prevention */}
              <WallpaperCard
                wallpaper={wallpaper}
                isFavorite={isFavorite}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
              />

              {/* Native In-Feed Square Ad 250x250 */}
              {showAd && (
                <div className="mb-4 break-inside-avoid inline-block w-full">
                  <AdSensePlaceholder
                    format="square-250x250"
                    slotId={`feed-ad-${wallpaper.id}`}
                    onLearnMore={onOpenPrivacyModal}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Infinite Scroll Sentinel Target */}
      <div
        ref={sentinelRef}
        id="infinite-scroll-sentinel"
        className="w-full py-8 flex flex-col items-center justify-center gap-2"
      >
        {isLoadingMore ? (
          <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-400 bg-white/[0.04] px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-md">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Loading 40 more high-res wallpapers...</span>
          </div>
        ) : hasMore ? (
          <div className="text-[11px] text-zinc-400 font-mono">
            Scroll down to fetch 40 more wallpapers seamlessly
          </div>
        ) : (
          <div className="text-xs text-zinc-400 py-4">
            You have reached the end of the collection.
          </div>
        )}
      </div>
    </div>
  );
};
