import React from 'react';
import { WallpaperCategory } from '../types';

interface PixelDropHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: WallpaperCategory;
  onSelectCategory: (category: WallpaperCategory) => void;
  totalCount: number;
}

const POPULAR_TAGS: {
  id: WallpaperCategory;
  label: string;
}[] = [
  { id: 'all', label: 'All 4K' },
  { id: 'trending', label: 'Trending' },
  { id: 'nature', label: 'Nature' },
  { id: 'amoled', label: 'Dark & AMOLED' },
  { id: 'anime', label: 'Anime' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'cars', label: 'Cars' },
  { id: 'space', label: 'Space & Galaxy' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'city', label: 'City & Architecture' },
  { id: 'abstract', label: 'Abstract 3D' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'tech', label: 'Tech & Code' },
];

export const PixelDropHero: React.FC<PixelDropHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalCount,
}) => {
  // Title logic matching Pexels
  const getDisplayTitle = () => {
    if (searchQuery.trim()) {
      return `Free "${searchQuery}" 4K Wallpapers`;
    }
    if (selectedCategory && selectedCategory !== 'all') {
      const formatted = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      return `${formatted} 4K Wallpapers`;
    }
    return 'Free 4K Wallpapers';
  };

  return (
    <section className="relative w-full pt-4 pb-2 select-none">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Pexels Style Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
            {getDisplayTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Over {totalCount > 0 ? totalCount.toLocaleString() : '12,000+'} free ultra high-definition 4K &amp; 8K wallpapers for desktop, mobile and tablet.
          </p>
        </div>

        {/* Pexels Style Horizontal Topic / Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x [-webkit-overflow-scrolling:touch]">
          {POPULAR_TAGS.map((tag) => {
            const isActive = selectedCategory === tag.id && !searchQuery;
            return (
              <button
                key={tag.id}
                onClick={() => {
                  onSelectCategory(tag.id);
                  if (searchQuery) onSearchChange('');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-sm font-semibold'
                    : 'bg-zinc-100/80 hover:bg-zinc-200 dark:bg-[#1a1c24] dark:hover:bg-[#222530] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
