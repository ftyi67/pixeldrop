import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  X,
  Sparkles,
  Droplets,
  Zap,
  Mountain,
  Layers,
  Flame,
  Moon,
  Car,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Monitor,
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

// Category chips requested: #Cyberpunk, #Nature, #Minimalist, #Anime, #AMOLED, #Cars
const QUICK_FILTER_CHIPS: {
  id: WallpaperCategory;
  tag: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}[] = [
  {
    id: 'cyberpunk',
    tag: '#Cyberpunk',
    label: 'Cyberpunk & Neon',
    icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    gradient: 'from-amber-500/20 to-pink-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'nature',
    tag: '#Nature',
    label: 'Nature 4K',
    icon: <Mountain className="w-3.5 h-3.5 text-emerald-400" />,
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'minimalist',
    tag: '#Minimalist',
    label: 'Minimalist Clean',
    icon: <Layers className="w-3.5 h-3.5 text-zinc-300" />,
    gradient: 'from-zinc-500/20 to-slate-500/20 text-zinc-200 border-zinc-500/30',
  },
  {
    id: 'anime',
    tag: '#Anime',
    label: 'Anime & Fantasy',
    icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
    gradient: 'from-rose-500/20 to-purple-500/20 text-rose-300 border-rose-500/30',
  },
  {
    id: 'amoled',
    tag: '#AMOLED',
    label: 'Deep AMOLED',
    icon: <Moon className="w-3.5 h-3.5 text-indigo-300" />,
    gradient: 'from-indigo-500/20 to-violet-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'cars',
    tag: '#Cars',
    label: 'Supercars & Racing',
    icon: <Car className="w-3.5 h-3.5 text-cyan-400" />,
    gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30',
  },
];

export const PixelDropHero: React.FC<PixelDropHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalCount,
  isPexelsActive = true,
}) => {
  return (
    <section className="relative w-full pt-8 pb-10 overflow-hidden">
      {/* Ambient Floating Gradient Orbs */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="pointer-events-none absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse"
        style={{ animationDuration: '10s' }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/10 blur-[140px]"
      />

      {/* Main Glassmorphism Hero Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-5xl px-4 sm:px-6"
      >
        <div className="relative rounded-3xl border border-white/[0.12] bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent p-6 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden">
          {/* Subtle Pixel Grid decorative background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Brand & Status Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            {/* PixelDrop Brand Icon Badge (Glowing droplet inside a pixel grid) */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-black/40 border border-white/[0.12] backdrop-blur-md shadow-inner">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/30">
                <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                      backgroundSize: '4px 4px',
                    }}
                  />
                  <Droplets className="w-3.5 h-3.5 text-cyan-300 relative z-10" />
                </div>
              </div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-white font-['Space_Grotesk',sans-serif]">
                Pixel<span className="text-cyan-400">Drop</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-[10px] text-zinc-400 font-mono">Micro-SaaS Engine</span>
            </div>

            {/* Live Feed Status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-400 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isPexelsActive ? 'Pexels 4K API Live' : 'Pexels Stream Ready'}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-zinc-400 font-mono">
                <span>{totalCount.toLocaleString()}+ Indexed</span>
              </div>
            </div>
          </motion.div>

          {/* Multilingual Headline & Subheadline */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-['Space_Grotesk',sans-serif]"
            >
              PixelDrop <span className="text-white/40 font-light">|</span>{' '}
              <span className="bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                HD & 4K Wallpapers
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl font-medium text-zinc-400 mt-1 font-sans">
                Fond d'écran 4K Gratuit
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto"
            >
              Drop into thousands of ultra-high-res aesthetic backgrounds for{' '}
              <span className="text-white font-medium inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-purple-400 inline" /> Mobile
              </span>
              ,{' '}
              <span className="text-white font-medium inline-flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-indigo-400 inline" /> PC
              </span>{' '}
              & Tablet. Instant dynamic resolution cropping and free direct downloads.
            </motion.p>
          </div>

          {/* Interactive Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative flex items-center rounded-2xl bg-black/60 border border-white/15 p-1.5 backdrop-blur-xl shadow-xl transition-all focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
              <div className="pl-3.5 text-zinc-400">
                <Search className="w-5 h-5 text-indigo-400" />
              </div>
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher / Search 4K wallpapers (e.g., Tokyo night, mountains, neon cyber, BMW)..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center pr-2">
                <span className="px-2 py-1 rounded-md bg-white/[0.06] text-[10px] font-mono text-zinc-400 border border-white/10">
                  500ms Debounce
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick-Filter Category Chips requested: #Cyberpunk, #Nature, #Minimalist, #Anime, #AMOLED, #Cars */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto"
          >
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mr-1 hidden sm:inline-block">
              Trending:
            </span>

            {QUICK_FILTER_CHIPS.map((chip) => {
              const isSelected = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  id={`hero-chip-${chip.id}`}
                  onClick={() => onSelectCategory(chip.id)}
                  className={`group px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-cyan-400/50 shadow-md shadow-indigo-500/20 scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10'
                  }`}
                >
                  {chip.icon}
                  <span className="font-semibold">{chip.tag}</span>
                  <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 hidden md:inline">
                    ({chip.label})
                  </span>
                </button>
              );
            })}

            {selectedCategory !== 'all' && (
              <button
                onClick={() => onSelectCategory('all')}
                className="px-2.5 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 transition-colors cursor-pointer"
                title="Reset to all wallpapers"
              >
                Reset All
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
