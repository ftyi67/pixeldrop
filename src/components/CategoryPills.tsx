import React from 'react';
import { WallpaperCategory, WallpaperOrientation } from '../types';
import { Monitor, Smartphone, Grid } from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: WallpaperCategory;
  onSelectCategory: (category: WallpaperCategory) => void;
  orientation: WallpaperOrientation;
  onChangeOrientation: (orientation: WallpaperOrientation) => void;
  totalCount: number;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  orientation,
  onChangeOrientation,
  totalCount,
}) => {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-1 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs">
      {/* Left side: Results Count / Label */}
      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium">
        <span className="font-semibold text-zinc-900 dark:text-white">
          {totalCount > 0 ? `${totalCount} Wallpapers` : 'Wallpapers'}
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">•</span>
        <span className="hidden sm:inline">4K &amp; Ultra HD</span>
      </div>

      {/* Right side: Pexels Style Orientation Segmented Controls */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#1a1c24] p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => onChangeOrientation('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            orientation === 'all'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-semibold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title="All aspect ratios"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>All Orientations</span>
        </button>

        <button
          onClick={() => onChangeOrientation('landscape')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            orientation === 'landscape'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-semibold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title="Desktop 16:9 Widescreen"
        >
          <Monitor className="w-3.5 h-3.5 text-emerald-500" />
          <span>Horizontal</span>
        </button>

        <button
          onClick={() => onChangeOrientation('portrait')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            orientation === 'portrait'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-semibold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title="Mobile 9:16 Portrait"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
          <span>Vertical</span>
        </button>
      </div>
    </div>
  );
};
