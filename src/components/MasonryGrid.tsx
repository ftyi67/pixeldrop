import React, { useEffect, useRef, useCallback } from 'react';
import { WallpaperCard } from './WallpaperCard';
import { AdSensePlaceholder } from './AdSensePlaceholder';
import { Wallpaper } from '../types';
import { Loader2, ArrowDown, Image as ImageIcon } from 'lucide-react';

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
  const loadingRef = useRef(isLoadingMore);
  loadingRef.current = isLoadingMore;

  const triggerLoadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      onLoadMore();
    }
  }, [hasMore, onLoadMore]);

  // Primary: Intersection Observer with 800px pre-trigger margin
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          triggerLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '800px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, triggerLoadMore]);

  // Secondary Fallback: Window scroll listener to guarantee infinite scroll on all devices
  useEffect(() => {
    if (!hasMore) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!loadingRef.current && hasMore) {
            const scrollY = window.scrollY || window.pageYOffset;
            const viewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollY + viewportHeight >= documentHeight - 900) {
              triggerLoadMore();
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, triggerLoadMore]);

  if (wallpapers.length === 0 && !isLoadingMore) {
    return (
      <div className="w-full py-20 px-4 text-center rounded-2xl border border-white/[0.08] bg-[#0e1017] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">
          No wallpapers found matching this criteria
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
          Try picking a different genre or reset your search query to explore the full 4K library.
        </p>
        <button
          onClick={onResetSearch}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* High-Performance Responsive Masonry Columns */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
        {wallpapers.map((wallpaper, index) => {
          const isFavorite = favorites.includes(wallpaper.id);
          const showAd = (index + 1) % 15 === 0;

          return (
            <React.Fragment key={wallpaper.id}>
              <WallpaperCard
                wallpaper={wallpaper}
                isFavorite={isFavorite}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
              />

              {showAd && (
                <div className="mb-3 sm:mb-4 break-inside-avoid block w-full">
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

      {/* Infinite Scroll Trigger Sentinel & Status */}
      <div
        ref={sentinelRef}
        id="infinite-scroll-sentinel"
        className="w-full py-8 flex flex-col items-center justify-center gap-3 min-h-[90px]"
      >
        {isLoadingMore ? (
          <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-300 bg-[#12141d] px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading 4K wallpapers...</span>
          </div>
        ) : hasMore ? (
          <button
            onClick={triggerLoadMore}
            className="group flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white bg-[#12141d] hover:bg-[#181a26] px-6 py-2.5 rounded-full border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span>Scroll for more or click to load</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        ) : (
          <div className="text-xs text-zinc-500 py-3 font-mono">
            All wallpapers loaded
          </div>
        )}
      </div>
    </div>
  );
};
