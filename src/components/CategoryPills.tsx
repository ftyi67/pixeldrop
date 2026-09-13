import React from 'react';
import { WallpaperCategory, WallpaperOrientation } from '../types';
import {
  Sparkles,
  Mountain,
  Zap,
  Layers,
  Flame,
  Cpu,
  Moon,
  Shapes,
  Globe,
  Building2,
  Monitor,
  Smartphone,
  Car,
} from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: WallpaperCategory;
  onSelectCategory: (category: WallpaperCategory) => void;
  orientation: WallpaperOrientation;
  onChangeOrientation: (orientation: WallpaperOrientation) => void;
  totalCount: number;
  isPexelsActive: boolean;
}

const CATEGORY_ITEMS: { id: WallpaperCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All 4K', icon: 'Sparkles' },
  { id: 'cyberpunk', label: 'Cyberpunk & Neon', icon: 'Zap' },
  { id: 'nature', label: 'Nature & Landscape', icon: 'Mountain' },
  { id: 'minimalist', label: 'Minimalist & Japandi', icon: 'Layers' },
  { id: 'anime', label: 'Anime & Fantasy', icon: 'Flame' },
  { id: 'amoled', label: 'AMOLED Deep Black', icon: 'Moon' },
  { id: 'cars', label: 'Supercars & Racing', icon: 'Car' },
  { id: 'dark', label: 'Dark Aesthetic', icon: 'Moon' },
  { id: 'tech', label: 'Tech & Matrix', icon: 'Cpu' },
  { id: 'space', label: 'Space & Nebula', icon: 'Globe' },
  { id: 'city', label: 'City & Urban', icon: 'Building2' },
  { id: 'abstract', label: 'Abstract & 3D', icon: 'Shapes' },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  orientation,
  onChangeOrientation,
  totalCount,
  isPexelsActive,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'Mountain': return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Layers': return <Layers className="w-3.5 h-3.5 text-amber-200" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Moon': return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
      case 'Car': return <Car className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Shapes': return <Shapes className="w-3.5 h-3.5 text-pink-400" />;
      case 'Globe': return <Globe className="w-3.5 h-3.5 text-sky-400" />;
      case 'Building2': return <Building2 className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Category Pills Slider in Ultra-Modern Frosted Glass */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {CATEGORY_ITEMS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-200 shrink-0 cursor-pointer backdrop-blur-md ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40 scale-105'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              {getIcon(cat.icon)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Bar: Orientation Filters + Pexels Live Status */}
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

        {/* Right Status Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-xs text-zinc-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isPexelsActive ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
              }`}
            />
            <span className="font-mono text-[11px]">
              {isPexelsActive ? 'Pexels API Connected' : 'Curated 4K Pexels Stream'}
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
