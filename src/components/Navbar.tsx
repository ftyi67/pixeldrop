import React, { useState } from 'react';
import {
  Search,
  Palette,
  Layers,
  Heart,
  ShieldCheck,
  Code2,
  X,
  Key,
  Droplets,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { getPexelsApiKey } from '../services/pexels';
import { getPixabayApiKey } from '../services/multiApiAggregator';
import { ThemePreference, ActiveTheme } from '../hooks/useSystemTheme';

interface NavbarProps {
  activeTab: 'wallpapers' | 'gradient' | 'favorites';
  setActiveTab: (tab: 'wallpapers' | 'gradient' | 'favorites') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  onOpenPrivacyModal: () => void;
  onOpenNextjsModal: () => void;
  onOpenPexelsModal: () => void;
  themePreference?: ThemePreference;
  resolvedTheme?: ActiveTheme;
  onToggleTheme?: () => void;
  onSetThemePreference?: (pref: ThemePreference) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onOpenPrivacyModal,
  onOpenNextjsModal,
  onOpenPexelsModal,
  themePreference = 'system',
  resolvedTheme = 'dark',
  onToggleTheme,
  onSetThemePreference,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const hasPexels = Boolean(getPexelsApiKey());
  const hasPixabay = Boolean(getPixabayApiKey());
  const hasKeys = hasPexels || hasPixabay;

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-zinc-950/70 backdrop-blur-2xl transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & PixelDrop Brand */}
        <div
          onClick={() => setActiveTab('wallpapers')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Glowing Droplet inside a Pixel Grid SVG/Icon Badge */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)`,
                  backgroundSize: '5px 5px',
                }}
              />
              <Droplets className="w-5 h-5 text-cyan-300 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors font-['Space_Grotesk',sans-serif]">
                Pixel<span className="text-cyan-400">Drop</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                4K UHD
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block font-light">
              Fond d'écran 4K Gratuit & Micro-SaaS
            </p>
          </div>
        </div>

        {/* Global Search Bar (Glassmorphism design with Lucide search) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            className={`relative flex items-center rounded-2xl bg-white/[0.04] border transition-all ${
              isSearchFocused
                ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10 bg-white/[0.07]'
                : 'border-white/[0.08] hover:border-white/20'
            }`}
          >
            <Search className="w-4 h-4 text-zinc-400 ml-3.5 shrink-0" />
            <input
              id="search-wallpapers-input"
              type="text"
              placeholder="Search nature, cyberpunk, minimalist, anime, 4K..."
              value={searchQuery}
              onFocus={() => {
                setIsSearchFocused(true);
                if (activeTab !== 'wallpapers') setActiveTab('wallpapers');
              }}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-3 p-1 rounded-full text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Wallpapers Tab */}
          <button
            id="nav-tab-wallpapers"
            onClick={() => setActiveTab('wallpapers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'wallpapers'
                ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/25'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          {/* Gradient Studio Tab */}
          <button
            id="nav-tab-gradient"
            onClick={() => setActiveTab('gradient')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'gradient'
                ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/25'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">CSS Gradient</span>
          </button>

          {/* Favorites Tab */}
          <button
            id="nav-tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all relative cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Saved Wallpapers"
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <div className="w-px h-5 bg-white/[0.08] mx-0.5 hidden sm:block" />

          {/* Multi-API Key Settings Trigger */}
          <button
            onClick={onOpenPexelsModal}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              hasKeys
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08]'
            }`}
            title="Configure Pexels & Pixabay API Keys"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">{hasKeys ? 'APIs Active' : 'API Keys'}</span>
          </button>

          {/* Next.js & SEO Guide */}
          <button
            onClick={onOpenNextjsModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            title="Next.js App Router Architecture & SEO"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Theme Switcher with OS Auto-Detection & Persistent Override */}
          <div className="relative">
            <button
              id="btn-theme-toggle"
              onClick={() => onToggleTheme?.()}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowThemeMenu((prev) => !prev);
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer relative group"
              title={`Theme: ${themePreference === 'system' ? 'System (Auto)' : themePreference === 'dark' ? 'Dark' : 'Light'} • Click to toggle, right-click for options`}
              aria-label="Toggle dark/light mode"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              )}
              {themePreference === 'system' && (
                <span
                  className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-zinc-950"
                  title="System preference active"
                />
              )}
            </button>

            {/* Quick Theme Selector Flyout */}
            {showThemeMenu && (
              <div
                className="absolute right-0 mt-2 w-36 py-1.5 bg-zinc-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-xl z-50 text-xs text-zinc-300"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                <button
                  onClick={() => {
                    onSetThemePreference?.('system');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-white/[0.08] transition-colors ${
                    themePreference === 'system' ? 'text-indigo-400 font-semibold' : ''
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>System (OS)</span>
                </button>
                <button
                  onClick={() => {
                    onSetThemePreference?.('dark');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-white/[0.08] transition-colors ${
                    themePreference === 'dark' ? 'text-indigo-400 font-semibold' : ''
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </button>
                <button
                  onClick={() => {
                    onSetThemePreference?.('light');
                    setShowThemeMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-white/[0.08] transition-colors ${
                    themePreference === 'light' ? 'text-indigo-400 font-semibold' : ''
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Privacy & AdSense Modal */}
          <button
            onClick={onOpenPrivacyModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            title="Privacy, GDPR & Google AdSense Setup"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative flex items-center rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <Search className="w-4 h-4 text-zinc-400 ml-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search nature, anime, cyberpunk wallpapers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'wallpapers') setActiveTab('wallpapers');
            }}
            className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mr-3 text-zinc-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
