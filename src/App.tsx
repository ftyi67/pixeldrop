import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Wallpaper,
  WallpaperCategory,
  WallpaperOrientation,
} from './types';
import {
  fetchAggregatedWallpapers,
} from './services/multiApiAggregator';
import { useDebounce } from './hooks/useDebounce';
import { useSystemTheme } from './hooks/useSystemTheme';
import { Navbar } from './components/Navbar';
import { PixelDropHero } from './components/PixelDropHero';
import { CategoryPills } from './components/CategoryPills';
import { MasonryGrid } from './components/MasonryGrid';
import { WallpaperModal } from './components/WallpaperModal';
import { GradientGenerator } from './components/GradientGenerator';
import { AdSensePlaceholder } from './components/AdSensePlaceholder';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { PrivacyAdSenseModal } from './components/PrivacyAdSenseModal';
import { NextjsInstructionsModal } from './components/NextjsInstructionsModal';
import {
  Sparkles,
  ShieldCheck,
  Code2,
  Heart,
  Search,
  ExternalLink,
  Layers,
} from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'wallcraft_favorites_v2';

export default function App() {
  // System preference detection hook with persistent user override
  const {
    themePreference,
    resolvedTheme,
    isDark,
    setThemePreference,
    toggleTheme,
  } = useSystemTheme();

  const [activeTab, setActiveTab] = useState<'wallpapers' | 'gradient' | 'favorites'>('wallpapers');
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory>('all');
  const [orientation, setOrientation] = useState<WallpaperOrientation>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search query (500ms delay to eliminate keystroke refetches & layout jitter)
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Infinite Scroll & Wallpapers State
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalIndexed, setTotalIndexed] = useState(12000);

  // Modals state
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isNextjsModalOpen, setIsNextjsModalOpen] = useState(false);

  // Favorites state with local storage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync route / tab from URL query params or hash
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'gradient' || window.location.hash === '#gradient') {
        setActiveTab('gradient');
      }
      const wallpaperId = params.get('wallpaper');
      if (wallpaperId && wallpapers.length > 0) {
        const found = wallpapers.find((w) => w.id === wallpaperId);
        if (found) setSelectedWallpaper(found);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, [wallpapers]);

  // Initial and Category/Search load using Multi-API Aggregator (Promise.allSettled)
  const loadInitialWallpapers = useCallback(async () => {
    setIsLoadingMore(true);
    console.log('🔄 [App.tsx] loadInitialWallpapers started:', {
      category: selectedCategory,
      debouncedSearchQuery: debouncedSearch,
    });
    try {
      const res = await fetchAggregatedWallpapers(1, 40, selectedCategory, debouncedSearch);
      console.log('✨ [App.tsx] Wallpapers received:', {
        count: res.wallpapers.length,
        hasMore: res.hasMore,
        total: res.total,
        sources: res.sources,
      });
      setWallpapers(res.wallpapers);
      setPage(1);
      setHasMore(res.hasMore);
      setTotalIndexed(res.total);
    } catch (err) {
      console.error('❌ [App.tsx] Failed to load initial aggregated wallpapers:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    loadInitialWallpapers();
  }, [loadInitialWallpapers]);

  // Infinite Scroll Handler: Fetches the next batch of 40 aggregated wallpapers
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    console.log('📜 [App.tsx] Loading page:', nextPage, {
      category: selectedCategory,
      query: debouncedSearch,
    });

    try {
      const res = await fetchAggregatedWallpapers(nextPage, 40, selectedCategory, debouncedSearch);
      console.log('📜 [App.tsx] Loaded more wallpapers:', {
        nextPage,
        newItemsCount: res.wallpapers.length,
      });
      setWallpapers((prev) => {
        const existingIds = new Set(prev.map((w) => w.id));
        const uniqueNext = res.wallpapers.filter((w) => !existingIds.has(w.id));
        return [...prev, ...uniqueNext];
      });
      setPage(nextPage);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error('❌ [App.tsx] Infinite scroll aggregated fetch error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage error handling
      }
      return updated;
    });
  };

  // Filtered Wallpapers computation (Orientation & Favorites Tab)
  const filteredWallpapers = useMemo(() => {
    let list = wallpapers;

    if (activeTab === 'favorites') {
      list = list.filter((w) => favorites.includes(w.id));
    }

    if (orientation !== 'all') {
      list = list.filter((w) => w.orientation === orientation);
    }

    return list;
  }, [wallpapers, activeTab, orientation, favorites]);

  // Tag click handler: filters search by tag
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setSelectedCategory('all');
    setActiveTab('wallpapers');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#09090b] text-[#f4f4f5]' : 'bg-slate-50 text-slate-900'
      } flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 font-['Outfit',sans-serif] transition-colors duration-300`}
    >
      {/* Background ambient lighting for modern glassmorphism */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar with Persistent Theme Controls */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'gradient') {
            window.location.hash = 'gradient';
          } else {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenNextjsModal={() => setIsNextjsModalOpen(true)}
        themePreference={themePreference}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
        onSetThemePreference={setThemePreference}
      />

      {/* Top AdSense Leaderboard 728x90 */}
      <div className="w-full px-4 pt-4 pb-2 relative z-10">
        <AdSensePlaceholder
          format="banner-728x90"
          slotId="top-leaderboard-728x90"
          onLearnMore={() => setIsPrivacyModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 relative z-10">
        {activeTab === 'gradient' ? (
          /* CSS Gradient Studio (Separate clean view / route) */
          <GradientGenerator onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />
        ) : (
          /* Wallpapers Gallery & Infinite Scroll Grid */
          <div className="space-y-6">
            {/* Interactive PixelDrop Welcome Hero Section */}
            {activeTab === 'wallpapers' && (
              <PixelDropHero
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                }}
                totalCount={totalIndexed}
              />
            )}

            {/* Category Pills & Orientation Filters */}
            <CategoryPills
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSearchQuery('');
              }}
              orientation={orientation}
              onChangeOrientation={setOrientation}
              totalCount={wallpapers.length}
            />

            {/* Favorites Tab Header if active */}
            {activeTab === 'favorites' && (
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Your Saved Favorites ({favorites.length})</span>
                </div>
                <button
                  onClick={() => setActiveTab('wallpapers')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                >
                  Browse Full Gallery
                </button>
              </div>
            )}

            {/* Active Search Filter Banner */}
            {searchQuery && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/50 border border-white/[0.08] backdrop-blur-xl text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Searching 4K wallpapers for &ldquo;
                    <strong className="text-white font-semibold">{searchQuery}</strong>
                    &rdquo;
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Pinterest-style Masonry Grid with Seamless 40-item Infinite Scroll */}
            <MasonryGrid
              wallpapers={filteredWallpapers}
              favorites={favorites}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onSelect={(wp) => setSelectedWallpaper(wp)}
              onToggleFavorite={toggleFavorite}
              onResetSearch={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOrientation('all');
              }}
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              onLoadMore={handleLoadMore}
            />
          </div>
        )}
      </main>

      {/* Global SEO Footer & Google AdSense Publisher Compliance Notice in Modern Glassmorphism */}
      <footer className="w-full mt-16 border-t border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl text-zinc-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-white text-sm tracking-tight">
                  WallCraft Micro-SaaS
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                High-volume wallpaper utility with 40-item infinite scrolling, Pexels dynamic pixel resizing (Desktop, Mobile, Tablet), and Google AdSense compliance.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-indigo-300 font-semibold">
                  Pexels API
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-emerald-400 font-semibold">
                  GDPR & CCPA
                </span>
              </div>
            </div>

            {/* Col 2: Categories Directory */}
            <div>
              <h4 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider">
                Popular Categories
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('nature');
                      setActiveTab('wallpapers');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    4K Alpine & Ocean Landscapes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('cyberpunk');
                      setActiveTab('wallpapers');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Cyberpunk & Tokyo Neon Alleyways
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('minimalist');
                      setActiveTab('wallpapers');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Minimalist Architecture & Concrete
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('dark');
                      setActiveTab('wallpapers');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    AMOLED Deep Obsidian Wallpapers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('anime');
                      setActiveTab('wallpapers');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Anime & Cherry Blossom Scenery
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Tools & Utilities */}
            <div>
              <h4 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider">
                Creator Utilities
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => setActiveTab('gradient')}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Layers className="w-3 h-3 text-indigo-400" />
                    CSS Gradient Studio (Canvas PNG)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsNextjsModalOpen(true)}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Code2 className="w-3 h-3 text-purple-400" />
                    Next.js App Router Architecture
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.pexels.com/license/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    Pexels License Agreement <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: AdSense & Privacy Disclosures */}
            <div>
              <h4 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Legal & AdSense Notice
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Google AdSense & DART Cookie Disclosure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    GDPR European Consent Rights
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    CCPA: Do Not Sell My Info
                  </button>
                </li>
                <li>
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    AdChoices Personalization Settings <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
            <p>
              © {new Date().getFullYear()} WallCraft Micro-SaaS. Powered by Pexels API and dynamic image processing.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsPrivacyModalOpen(true)} className="hover:underline cursor-pointer">
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={() => setIsPrivacyModalOpen(true)} className="hover:underline cursor-pointer">
                Cookie Settings
              </button>
              <span>•</span>
              <button onClick={() => setIsNextjsModalOpen(true)} className="hover:underline cursor-pointer">
                Next.js App Router
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Simplified Glassmorphism Modal with 3 Minimal Download Buttons & SEO Section */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        isFavorite={selectedWallpaper ? favorites.includes(selectedWallpaper.id) : false}
        onClose={() => setSelectedWallpaper(null)}
        onToggleFavorite={toggleFavorite}
        onTagClick={handleTagClick}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* GDPR / CCPA Cookie Consent Banner */}
      <CookieConsentBanner onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />

      {/* Privacy Policy & Google AdSense Compliance Modal */}
      <PrivacyAdSenseModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Next.js & Vercel Developer Guide Modal */}
      <NextjsInstructionsModal
        isOpen={isNextjsModalOpen}
        onClose={() => setIsNextjsModalOpen(false)}
      />
    </div>
  );
}
