import React from 'react';
import { WallpaperCategory, WallpaperOrientation } from '../types';
import {
  Sparkles,
  Mountain,
  Zap,
  Layers,
  Flame,
  Wand2,
  Tv,
  Cpu,
  Moon,
  Shapes,
  Globe,
  Building2,
  Monitor,
  Smartphone,
  Car,
  Database,
} from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: WallpaperCategory;
  onSelectCategory: (category: WallpaperCategory) => void;
  orientation: WallpaperOrientation;
  onChangeOrientation: (orientation: WallpaperOrientation) => void;
  totalCount: number;
  isPexelsActive?: boolean;
}

// 7 primary requested categories: "All", "Trending", "Anime", "Fantasy", "Cyberpunk", "Nature", "Minimalist"
// Followed by popular secondary aesthetic genres
const CATEGORY_ITEMS: {
  id: WallpaperCategory;
  label: string;
  icon: string;
  sourceLabel: 'Pexels' | 'Wallhaven';
}[] = [
  { id: 'all', label: 'All 4K', icon: 'Sparkles', sourceLabel: 'Pexels' },
  { id: 'trending', label: 'Trending', icon: 'Flame', sourceLabel: 'Pexels' },
  { id: 'anime', label: 'Anime', icon: 'Tv', sourceLabel: 'Wallhaven' },
  { id: 'fantasy', label: 'Fantasy', icon: 'Wand2', sourceLabel: 'Wallhaven' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: 'Zap', sourceLabel: 'Wallhaven' },
  { id: 'nature', label: 'Nature', icon: 'Mountain', sourceLabel: 'Pexels' },
  { id: 'minimalist', label: 'Minimalist', icon: 'Layers', sourceLabel: 'Pexels' },
  { id: 'amoled', label: 'AMOLED', icon: 'Moon', sourceLabel: 'Pexels' },
  { id: 'cars', label: 'Supercars', icon: 'Car', sourceLabel: 'Pexels' },
  { id: 'space', label: 'Space', icon: 'Globe', sourceLabel: 'Pexels' },
  { id: 'city', label: 'Urban & City', icon: 'Building2', sourceLabel: 'Pexels' },
  { id: 'tech', label: 'Tech & Code', icon: 'Cpu', sourceLabel: 'Pexels' },
  { id: 'abstract', label: 'Abstract 3D', icon: 'Shapes', sourceLabel: 'Pexels' },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  orientation,
  onChangeOrientation,
  totalCount,
  isPexelsActive = true,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'Tv':
        return <Tv className="w-3.5 h-3.5 text-purple-400" />;
      case 'Wand2':
        return <Wand2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Mountain':
        return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-3.5 h-3.5 text-zinc-300" />;
      case 'Moon':
        return <Moon className="w-3.5 h-3.5 text-violet-300" />;
      case 'Car':
        return <Car className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Globe':
        return <Globe className="w-3.5 h-3.5 text-sky-400" />;
      case 'Building2':
        return <Building2 className="w-3.5 h-3.5 text-orange-400" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-teal-400" />;
      case 'Shapes':
        return <Shapes className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Category Pills Slider in Ultra-Modern Frosted Glass */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const isWallhavenSource = cat.sourceLabel === 'Wallhaven';

          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-200 shrink-0 cursor-pointer backdrop-blur-md ${
                isActive
                  ? isWallhavenSource
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25 border border-purple-400/50 scale-105 ring-2 ring-purple-500/30'
                    : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40 scale-105'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              {getIcon(cat.icon)}
              <span>{cat.label}</span>
              {isWallhavenSource && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono tracking-tight ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                  }`}
                >
                  Wallhaven
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Bar: Orientation Filters + Dual API Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5 text-xs">
        {/* Orientation Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.03] backdrop-blur-md p-1 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => onChangeOrientation('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              orientation === 'all'
                ? 'bg-white/10 text-white font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => onChangeOrientation('landscape')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              orientation === 'landscape'
                ? 'bg-white/10 text-white font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3 h-3 text-indigo-400" />
            Desktop 16:9
          </button>
          <button
            onClick={() => onChangeOrientation('portrait')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              orientation === 'portrait'
                ? 'bg-white/10 text-white font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3 h-3 text-purple-400" />
            Mobile 9:16
          </button>
        </div>

        {/* Right Status Badges: Dual API Proxy Indicators */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] flex items-center gap-1.5">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>Dual API: Pexels & Wallhaven SFW</span>
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-[11px] text-zinc-400 font-mono">
            <strong>{totalCount}</strong> Wallpapers Active
          </div>
        </div>
      </div>
    </div>
  );
};
