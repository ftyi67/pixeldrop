import React, { useState, useEffect } from 'react';
import {
  Search,
  Layers,
  Heart,
  ShieldCheck,
  Code2,
  X,
  Droplets,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { ThemePreference, ActiveTheme } from '../hooks/useSystemTheme';

interface NavbarProps {
  activeTab: 'wallpapers' | 'favorites';
  setActiveTab: (tab: 'wallpapers' | 'favorites') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  onOpenPrivacyModal: () => void;
  onOpenNextjsModal: () => void;
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
  themePreference = 'system',
  resolvedTheme = 'dark',
  onToggleTheme,
  onSetThemePreference,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('search-wallpapers-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090d]/95 backdrop-blur-md transition-colors duration-200 safe-top"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & PixelDrop Brand */}
        <div
          onClick={() => setActiveTab('wallpapers')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0c12] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Droplets className="w-4 h-4 text-cyan-400 relative z-10" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                Pixel<span className="text-cyan-400">Drop</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                4K PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Ultra HD Wallpaper Studio
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            className={`relative flex items-center rounded-xl bg-[#10121a] border transition-all ${
              isSearchFocused
                ? 'border-cyan-500/60 ring-2 ring-cyan-500/20 shadow-md shadow-cyan-500/10'
                : 'border-white/[0.08] hover:border-white/20'
            }`}
          >
            <Search className="w-4 h-4 text-zinc-500 ml-3.5 shrink-0" />
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
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-3 p-1 rounded text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="mr-3 text-[10px] font-mono text-zinc-500 border border-white/10 px-1.5 py-0.5 rounded bg-white/[0.02]">
                /
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wallpapers Tab */}
          <button
            id="nav-tab-wallpapers"
            onClick={() => setActiveTab('wallpapers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'wallpapers'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Discover</span>
          </button>

          {/* Favorites Tab */}
          <button
            id="nav-tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors relative cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            title="Saved Wallpapers"
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />

          {/* Architecture Modal */}
          <button
            onClick={onOpenNextjsModal}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="App Architecture & Stack"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              id="btn-theme-toggle"
              onClick={() => onToggleTheme?.()}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowThemeMenu((prev) => !prev);
              }}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer relative"
              title={`Theme: ${themePreference === 'system' ? 'System (Auto)' : themePreference === 'dark' ? 'Dark' : 'Light'}`}
              aria-label="Toggle dark/light mode"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-cyan-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {showThemeMenu && (
              <div
                className="absolute right-0 mt-2 w-36 py-1 bg-[#10121a] border border-white/10 rounded-xl shadow-xl z-50 text-xs text-zinc-300"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                <button
                  onClick={() => {
                    onSetThemePreference?.('system');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-white/[0.06] transition-colors"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>System (OS)</span>
                </button>
                <button
                  onClick={() => {
                    onSetThemePreference?.('dark');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-white/[0.06] transition-colors"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </button>
                <button
                  onClick={() => {
                    onSetThemePreference?.('light');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-white/[0.06] transition-colors"
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
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Privacy & Legal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative flex items-center rounded-xl bg-[#10121a] border border-white/[0.08]">
          <Search className="w-4 h-4 text-zinc-500 ml-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search wallpapers (nature, anime, 4K)..."
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
