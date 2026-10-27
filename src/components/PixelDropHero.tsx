import React from 'react';
import {
  Search,
  X,
  Flame,
  Zap,
  Mountain,
  Layers,
  Moon,
  Car,
  Globe,
  Tv,
} from 'lucide-react';
import { WallpaperCategory } from '../types';

interface PixelDropHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: WallpaperCategory;
  onSelectCategory: (category: WallpaperCategory) => void;
  totalCount: number;
  isPexelsActive?: boolean;
}

const TRENDING_TAGS: {
  id: WallpaperCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'trending', label: 'Trending', icon: <Flame className="w-3.5 h-3.5 text-rose-400" /> },
  { id: 'nature', label: 'Nature', icon: <Mountain className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'anime', label: 'Anime', icon: <Tv className="w-3.5 h-3.5 text-purple-400" /> },
  { id: 'minimalist', label: 'Minimalist', icon: <Layers className="w-3.5 h-3.5 text-zinc-300" /> },
  { id: 'amoled', label: 'AMOLED', icon: <Moon className="w-3.5 h-3.5 text-cyan-400" /> },
  { id: 'cars', label: 'Supercars', icon: <Car className="w-3.5 h-3.5 text-blue-400" /> },
  { id: 'space', label: 'Space', icon: <Globe className="w-3.5 h-3.5 text-indigo-400" /> },
];

export const PixelDropHero: React.FC<PixelDropHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalCount,
}) => {
  return (
    <section className="relative w-full pt-4 pb-6">
      <div className="relative mx-auto max-w-4xl text-center space-y-4 px-4 sm:px-6">
        {/* Editorial Headline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>4K Ultra HD & RAW Collection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-['Space_Grotesk',sans-serif]">
            Curated 4K Wallpaper Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            High-resolution wallpapers for desktop, mobile and ultrawide setups. Instant aspect-ratio cropping and free direct downloads.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative flex items-center rounded-xl bg-[#11131c] border border-white/10 p-1 transition-all focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-lg shadow-black/50">
            <div className="pl-3 text-zinc-500">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search nature, cyberpunk, Tokyo night, anime, 4K..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors mr-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Trending Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
            Quick:
          </span>
          {TRENDING_TAGS.map((tag) => {
            const isSelected = selectedCategory === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => onSelectCategory(tag.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-500 text-black border-cyan-400 font-semibold shadow-sm'
                    : 'bg-[#10121a] hover:bg-[#161824] text-zinc-300 hover:text-white border-white/[0.08]'
                }`}
              >
                {tag.icon}
                <span>{tag.label}</span>
              </button>
            );
          })}

          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white bg-transparent hover:bg-white/[0.06] border border-white/10 transition-colors cursor-pointer"
            >
              All Wallpapers
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
