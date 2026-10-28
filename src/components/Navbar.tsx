import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShieldCheck,
  Code2,
  X,
  Sun,
  Moon,
  Monitor,
  Compass,
  DownloadCloud,
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
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
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
      className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#121319]/95 md:backdrop-blur-md transition-colors duration-200 safe-top"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Pexels / 4KWallpapers Style Clean Brand */}
        <div
          onClick={() => {
            setActiveTab('wallpapers');
            setSearchQuery('');
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
        >
          {/* Minimalist Logo Mark */}
          <div className="w-8 h-8 rounded-lg bg-emerald-500 dark:bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <DownloadCloud className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Pixel<span className="text-emerald-500 dark:text-emerald-400">Drop</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              4K
            </span>
          </div>
        </div>

        {/* Pexels Style Centered Clean Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div
            className={`relative flex items-center rounded-full transition-all duration-200 ${
              isSearchFocused
                ? 'bg-white dark:bg-[#1a1c24] ring-2 ring-emerald-500/40 shadow-sm border border-emerald-500/50'
                : 'bg-zinc-100 dark:bg-[#1a1c24] border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 ml-4 shrink-0" />
            <input
              id="search-wallpapers-input"
              type="text"
              placeholder="Search free 4K wallpapers, anime, nature, dark setups..."
              value={searchQuery}
              onFocus={() => {
                setIsSearchFocused(true);
                if (activeTab !== 'wallpapers') setActiveTab('wallpapers');
              }}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-3 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="mr-3 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700/60 px-1.5 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-800/50">
                /
              </span>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Explore / Wallpapers Tab */}
          <button
            id="nav-tab-wallpapers"
            onClick={() => setActiveTab('wallpapers')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'wallpapers'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          {/* Favorites Tab */}
          <button
            id="nav-tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all relative cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
            title="Saved Wallpapers"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
            <span className="hidden sm:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {/* Theme Switcher */}
          <div className="relative">
            <button
              id="btn-theme-toggle"
              onClick={() => onToggleTheme?.()}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowThemeMenu((prev) => !prev);
              }}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
              title={`Theme: ${
                themePreference === 'system'
                  ? 'System'
                  : themePreference === 'dark'
                  ? 'Dark'
                  : 'Light'
              }`}
              aria-label="Toggle dark/light mode"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-emerald-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {showThemeMenu && (
              <div
                className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-[#1a1c24] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 text-xs text-zinc-700 dark:text-zinc-300"
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                <button
                  onClick={() => {
                    onSetThemePreference?.('system');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>System (OS)</span>
                </button>
                <button
                  onClick={() => {
                    onSetThemePreference?.('dark');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </button>
                <button
                  onClick={() => {
                    onSetThemePreference?.('light');
                    setShowThemeMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Architecture Modal */}
          <button
            onClick={onOpenNextjsModal}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="App Architecture & Stack"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Privacy & AdSense Modal */}
          <button
            onClick={onOpenPrivacyModal}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="Privacy & Legal"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative flex items-center rounded-full bg-zinc-100 dark:bg-[#1a1c24] border border-zinc-200 dark:border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 ml-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search 4K wallpapers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'wallpapers') setActiveTab('wallpapers');
            }}
            className="w-full bg-transparent px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
