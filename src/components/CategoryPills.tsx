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
    <div className="w-full space-y-3">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar touch-pan-x [-webkit-overflow-scrolling:touch] select-none">
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-cyan-500 text-black border-cyan-400 font-semibold shadow-sm'
                  : 'bg-[#10121a] hover:bg-[#161824] text-zinc-300 hover:text-white border-white/[0.08]'
              }`}
            >
              {getIcon(cat.icon)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Bar: Orientation Segmented Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Orientation Switcher */}
        <div className="flex items-center gap-1 bg-[#10121a] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => onChangeOrientation('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              orientation === 'all'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => onChangeOrientation('landscape')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              orientation === 'landscape'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3 h-3 text-cyan-400" />
            Desktop 16:9
          </button>
          <button
            onClick={() => onChangeOrientation('portrait')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              orientation === 'portrait'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3 h-3 text-purple-400" />
            Mobile 9:16
          </button>
        </div>

        {/* Count Label */}
        <div className="text-[11px] text-zinc-500 font-mono">
          Showing 4K & Ultra HD Backgrounds
        </div>
      </div>
    </div>
  );
};
