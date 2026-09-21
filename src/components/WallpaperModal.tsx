import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Heart,
  Tag,
  ExternalLink,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sliders,
  Keyboard,
  HelpCircle,
} from 'lucide-react';
import { Wallpaper, DownloadResolution } from '../types';
import { AdSensePlaceholder } from './AdSensePlaceholder';
import { downloadWallpaperDirectly, getOriginalHighResUrl } from '../utils/downloadHelper';
import { fetchAggregatedWallpapers } from '../services/multiApiAggregator';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTagClick: (tag: string) => void;
  onOpenPrivacyModal: () => void;
  onSelectWallpaper?: (wallpaper: Wallpaper) => void;
  categoryWallpapers?: Wallpaper[];
  categoryName?: string;
  onNextWallpaper?: () => void;
  onPrevWallpaper?: () => void;
}

// Stop words filter for extracting primary aesthetic keywords
const STOP_WORDS = new Set([
  'wallpaper', 'wallpapers', '4k', 'ultra', 'hd', 'fond', "d'écran", 'decran',
  'free', 'gratuit', 'background', 'backgrounds', 'photo', 'image', 'curated', 'by',
  'high', 'resolution', 'desktop', 'mobile', 'for', 'and', 'the', 'pexels', 'wallhaven',
  'unsplash', 'pixabay', 'artist', 'creator', 'illustration', 'collection', 'setup'
]);

function extractKeywords(wp: Wallpaper): string {
  if (!wp) return '4k';
  // Try title words first
  const words = (wp.title || '')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (words.length > 0) {
    return words.slice(0, 2).join(' ');
  }

  // Next try tags
  if (wp.tags && wp.tags.length > 0) {
    const candidateTag = wp.tags.find((t) => !STOP_WORDS.has(t.toLowerCase()) && t.length > 2);
    if (candidateTag) return candidateTag;
  }

  // Next try category
  if (wp.category && wp.category !== 'all') {
    return wp.category;
  }

  return 'cyberpunk';
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  wallpaper,
  isFavorite,
  onClose,
  onToggleFavorite,
  onTagClick,
  onOpenPrivacyModal,
  onSelectWallpaper,
  categoryWallpapers = [],
  categoryName,
  onNextWallpaper,
  onPrevWallpaper,
}) => {
  const [downloadingRes, setDownloadingRes] = useState<DownloadResolution | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState(wallpaper?.fullUrl || wallpaper?.url || wallpaper?.imageUrl || '');

  // Slideshow Mode State
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowDelay, setSlideshowDelay] = useState<number>(4); // default 4 seconds
  const [slideshowProgress, setSlideshowProgress] = useState(0); // 0 to 100 percentage for visual countdown bar
  const [showSlideshowSettings, setShowSlideshowSettings] = useState(false);

  // Keyboard Navigation Helper State & Accessibility
  const [showKeyboardHelper, setShowKeyboardHelper] = useState(false);
  const [keyNavIndicator, setKeyNavIndicator] = useState<'left' | 'right' | null>(null);
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('');

  // Mobile Touch Swipe Gesture Support (Android & iPhone)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger if horizontal swipe is dominant and exceeds threshold (45px)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && onNextWallpaper) {
        setKeyNavIndicator('right');
        setTimeout(() => setKeyNavIndicator(null), 400);
        onNextWallpaper();
      } else if (deltaX > 0 && onPrevWallpaper) {
        setKeyNavIndicator('left');
        setTimeout(() => setKeyNavIndicator(null), 400);
        onPrevWallpaper();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // "Same Vibe" Related Wallpapers State
  const [relatedWallpapers, setRelatedWallpapers] = useState<Wallpaper[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [relatedKeyword, setRelatedKeyword] = useState('');

  // Keyboard navigation & Shortcuts (ESC to close, Left/Right for prev/next, Space for play/pause slideshow, ? for keyboard shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if focused on text input or textarea
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Escape') {
        if (showKeyboardHelper) {
          setShowKeyboardHelper(false);
        } else if (showSlideshowSettings) {
          setShowSlideshowSettings(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (onNextWallpaper) {
          setKeyNavIndicator('right');
          setTimeout(() => setKeyNavIndicator(null), 400);
          onNextWallpaper();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (onPrevWallpaper) {
          setKeyNavIndicator('left');
          setTimeout(() => setKeyNavIndicator(null), 400);
          onPrevWallpaper();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        // Spacebar toggles slideshow if not focused on an interactive button
        if (activeTag !== 'button') {
          e.preventDefault();
          setIsSlideshowActive((prev) => !prev);
        }
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowKeyboardHelper((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextWallpaper, onPrevWallpaper, showKeyboardHelper, showSlideshowSettings]);

  // Screen reader ARIA live announcement on wallpaper change
  useEffect(() => {
    if (wallpaper) {
      setAriaAnnouncement(`Displaying wallpaper: ${wallpaper.title} by ${wallpaper.authorName}`);
    }
  }, [wallpaper?.id]);

  // Slideshow auto-advance timer with smooth progress bar
  useEffect(() => {
    if (!isSlideshowActive || !wallpaper || !onNextWallpaper) {
      setSlideshowProgress(0);
      return;
    }

    const intervalMs = 100;
    const totalMs = slideshowDelay * 1000;
    let elapsedMs = 0;

    const timer = setInterval(() => {
      elapsedMs += intervalMs;
      const progressPercent = Math.min(100, (elapsedMs / totalMs) * 100);
      setSlideshowProgress(progressPercent);

      if (elapsedMs >= totalMs) {
        elapsedMs = 0;
        setSlideshowProgress(0);
        onNextWallpaper();
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [isSlideshowActive, slideshowDelay, wallpaper?.id, onNextWallpaper]);

  useEffect(() => {
    setImageLoaded(false);
    setModalImgSrc(wallpaper?.fullUrl || wallpaper?.url || wallpaper?.imageUrl || '');
  }, [wallpaper?.id, wallpaper?.fullUrl, wallpaper?.url, wallpaper?.imageUrl]);

  // Fetch "Same Vibe" Related Wallpapers based on extracted keyword
  useEffect(() => {
    if (!wallpaper) return;
    const keyword = extractKeywords(wallpaper);
    setRelatedKeyword(keyword);
    setIsLoadingRelated(true);

    let isMounted = true;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/wallpapers?query=${encodeURIComponent(keyword)}&per_page=12`);
        if (res.ok) {
          const data = await res.json();
          let items: Wallpaper[] = [];
          if (data.wallpapers && data.wallpapers.length > 0) {
            items = data.wallpapers.map((w: any) => ({
              id: w.id,
              url: w.url,
              thumbnail: w.thumbnail,
              fullUrl: w.url,
              thumbUrl: w.thumbnail,
              imageUrl: w.thumbnail,
              title: w.title || `${keyword} 4K Wallpaper`,
              authorName: w.authorName || (w.source === 'wallhaven' ? 'Wallhaven Artist' : 'Pexels Creator'),
              authorProfile: w.authorProfile || '',
              authorLink: w.authorProfile || '',
              category: (wallpaper.category || w.category || 'all') as any,
              width: w.width || 1920,
              height: w.height || 1080,
              tags: [keyword, '4k', 'wallpaper'],
              description: `Related 4K wallpaper for ${keyword}`,
              source: w.source || 'pexels',
              views: 1200 + Math.floor(Math.random() * 800),
              downloads: 400 + Math.floor(Math.random() * 400),
              likes: 90 + Math.floor(Math.random() * 200),
              orientation: w.width >= w.height ? 'landscape' : 'portrait',
            }));
          } else if (data.photos && data.photos.length > 0) {
            items = data.photos.map((p: any) => ({
              id: `pexels-${p.id}`,
              url: p.src?.original || p.src?.large2x || p.src?.large,
              thumbnail: p.src?.medium || p.src?.small,
              fullUrl: p.src?.original || p.src?.large2x,
              thumbUrl: p.src?.medium || p.src?.small,
              imageUrl: p.src?.medium || p.src?.small,
              title: p.alt || `${keyword} 4K Wallpaper`,
              authorName: p.photographer || 'Pexels Creator',
              authorProfile: p.photographer_url || '',
              authorLink: p.photographer_url || '',
              category: wallpaper.category || 'all',
              width: p.width || 1920,
              height: p.height || 1080,
              tags: [keyword, '4k'],
              description: `4K wallpaper of ${keyword}`,
              source: 'pexels',
              views: 1200,
              downloads: 500,
              likes: 120,
              orientation: p.width >= p.height ? 'landscape' : 'portrait',
            }));
          }

          // Filter out current wallpaper
          const filtered = items.filter((item) => item.id !== wallpaper.id && item.url !== wallpaper.url);

          if (isMounted) {
            if (filtered.length > 0) {
              setRelatedWallpapers(filtered.slice(0, 12));
            } else {
              // Fallback to client-side multi-api aggregator
              const fallbackRes = await fetchAggregatedWallpapers(1, 12, wallpaper.category, keyword);
              const fbFiltered = fallbackRes.wallpapers.filter((w) => w.id !== wallpaper.id);
              setRelatedWallpapers(fbFiltered.slice(0, 12));
            }
          }
        } else {
          // Fallback to client-side multi-api aggregator
          const fallbackRes = await fetchAggregatedWallpapers(1, 12, wallpaper.category, keyword);
          if (isMounted) {
            const fbFiltered = fallbackRes.wallpapers.filter((w) => w.id !== wallpaper.id);
            setRelatedWallpapers(fbFiltered.slice(0, 12));
          }
        }
      } catch {
        try {
          const fallbackRes = await fetchAggregatedWallpapers(1, 12, wallpaper.category, keyword);
          if (isMounted) {
            const fbFiltered = fallbackRes.wallpapers.filter((w) => w.id !== wallpaper.id);
            setRelatedWallpapers(fbFiltered.slice(0, 12));
          }
        } catch {
          // Silently handle
        }
      } finally {
        if (isMounted) setIsLoadingRelated(false);
      }
    };

    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [wallpaper?.id, wallpaper?.title, wallpaper?.category]);

  if (!wallpaper) return null;

  const handleDownload = async (resolution: DownloadResolution) => {
    setDownloadingRes(resolution);
    setDownloadStatus(
      resolution === 'original'
        ? 'Downloading raw uncompressed 4K master (10MB–20MB)...'
        : `Rendering high-definition ${resolution} (q=100)...`
    );

    try {
      await downloadWallpaperDirectly(wallpaper, resolution, (status) => {
        setDownloadStatus(status);
      });
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStatus('Download error, please retry.');
    } finally {
      setTimeout(() => {
        setDownloadingRes(null);
        setDownloadStatus('');
      }, 2000);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}?wallpaper=${wallpaper.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleSelectRelated = (relatedWp: Wallpaper) => {
    if (onSelectWallpaper) {
      onSelectWallpaper(relatedWp);
    }
    const scrollContainer = document.getElementById('wallpaper-modal-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categoryCapitalized = wallpaper.category.charAt(0).toUpperCase() + wallpaper.category.slice(1);
  const seoH2Headline = `${categoryCapitalized} - Fond d'écran 4K / HD Wallpaper for Mobile & PC`;
  const isWallhaven = wallpaper.source === 'wallhaven';
  const isPixabay = wallpaper.source === 'pixabay';
  const isUnsplash = wallpaper.source === 'unsplash';
  const licenseName = isWallhaven
    ? 'Wallhaven Community SFW License'
    : isPixabay
    ? 'Pixabay Content License'
    : isUnsplash
    ? 'Unsplash License'
    : 'Pexels Open License';
  const apiVerifiedName = isWallhaven
    ? 'Verified by Wallhaven API'
    : isPixabay
    ? 'Verified by Pixabay API'
    : isUnsplash
    ? 'Verified by Unsplash API'
    : 'Verified by Pexels API';
  const apiVerifiedUrl = isWallhaven
    ? 'https://wallhaven.cc'
    : isPixabay
    ? 'https://pixabay.com'
    : isUnsplash
    ? 'https://unsplash.com'
    : 'https://www.pexels.com';

  const seoAltText = `PixelDrop - Fond d'écran ${categoryCapitalized} 4K by ${wallpaper.authorName}`;

  const seoParagraph = `Téléchargez gratuitement ce fond d'écran 4K ultra-haute définition "${wallpaper.title}" par ${wallpaper.authorName}. Optimisé instantanément pour mobile (9:16 OLED, 1080x1920), PC & bureau (16:9 widescreen, 1920x1080) et tablette (4:3 Retina, 2048x1536). Download free ultra-HD 4K ${wallpaper.category} wallpaper royalty-free under the ${licenseName} for personal customization, background staging, and creative aesthetic setups.`;

  return (
    <div
      id="wallpaper-details-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Wallpaper details for ${wallpaper.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto overscroll-contain animate-in fade-in duration-200 safe-inset"
      onClick={onClose}
    >
      {/* Invisible Screen Reader Announcement for Dynamic Wallpaper Navigation */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      <div
        id="wallpaper-modal-container"
        className="w-full max-w-4xl my-auto bg-zinc-950/85 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100 relative max-h-[92vh] max-h-[92dvh] backdrop-blur-2xl gpu-layer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Glass Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {wallpaper.category}
              </span>
              {categoryWallpapers.length > 0 && (
                <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                  {Math.max(1, categoryWallpapers.findIndex((w) => w.id === wallpaper.id) + 1)} / {categoryWallpapers.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>{isWallhaven ? 'Artwork by' : 'Photo by'}</span>
              <a
                href={wallpaper.authorLink || wallpaper.authorProfile || (isWallhaven ? 'https://wallhaven.cc' : 'https://www.pexels.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-200 font-medium hover:text-white flex items-center gap-1 hover:underline truncate max-w-[120px] sm:max-w-[200px]"
              >
                {wallpaper.authorName}
                <ExternalLink className="w-3 h-3 text-zinc-400 flex-shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Slideshow Mode Button with Dropdown Settings */}
            <div className="relative flex items-center">
              <div className="flex items-center rounded-xl bg-white/[0.06] border border-white/[0.08] overflow-hidden p-0.5">
                <button
                  id="btn-toggle-slideshow"
                  onClick={() => setIsSlideshowActive((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSlideshowActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  title={isSlideshowActive ? 'Pause slideshow (Space)' : 'Play slideshow (Space)'}
                  aria-label="Toggle slideshow mode"
                >
                  {isSlideshowActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Slideshow</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Slideshow</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-slideshow-settings"
                  onClick={() => setShowSlideshowSettings((prev) => !prev)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    showSlideshowSettings
                      ? 'bg-white/20 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08]'
                  }`}
                  title="Configure slideshow delay"
                  aria-label="Slideshow delay settings"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Configurable Delay Popover */}
              {showSlideshowSettings && (
                <div
                  id="slideshow-settings-popover"
                  className="absolute right-0 top-full mt-2 w-56 p-3 rounded-2xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl z-30 space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      Cycle Delay
                    </span>
                    <span className="font-mono text-cyan-400">{slideshowDelay}s</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1">
                    {[2, 3, 5, 8].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          setSlideshowDelay(sec);
                          setShowSlideshowSettings(false);
                        }}
                        className={`py-1 rounded-lg text-xs font-medium font-mono transition-all cursor-pointer ${
                          slideshowDelay === sec
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-white/[0.06] text-[10px] text-zinc-400 leading-tight">
                    Automatically cycles through {categoryName || wallpaper.category} wallpapers.
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Helper Button & Popover */}
            <div className="relative flex items-center">
              <button
                id="btn-keyboard-shortcuts-helper"
                onClick={() => setShowKeyboardHelper((prev) => !prev)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  showKeyboardHelper
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm'
                    : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-white/[0.08]'
                }`}
                title="Keyboard navigation shortcuts (?)"
                aria-label="Keyboard navigation helper"
                aria-expanded={showKeyboardHelper}
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {showKeyboardHelper && (
                <div
                  id="keyboard-helper-popover"
                  className="absolute right-0 top-full mt-2 w-64 p-3.5 rounded-2xl bg-zinc-900/95 border border-white/15 shadow-2xl backdrop-blur-2xl z-40 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 text-left"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                      Keyboard Navigation
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Accessible</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Next wallpaper</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[11px] text-cyan-300 font-semibold">
                        →
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Previous wallpaper</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[11px] text-cyan-300 font-semibold">
                        ←
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Toggle slideshow</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[11px] text-indigo-300 font-semibold">
                        Space
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Close modal</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[11px] text-zinc-400 font-semibold">
                        Esc
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300 pt-1 border-t border-white/[0.06]">
                      <span className="text-zinc-400">Mobile (Touch)</span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/30 text-[10px] text-cyan-300 font-semibold">
                        Swipe ← / →
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] text-zinc-400 leading-tight">
                    Swipe or press arrow keys to cycle through the {categoryName || wallpaper.category} collection.
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCopyShareLink}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
              title="Copy share link"
              aria-label="Share wallpaper"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => onToggleFavorite(wallpaper.id, e)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isFavorite
                  ? 'bg-rose-500/90 text-white border-rose-400 shadow-md'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-rose-400 border-white/[0.08]'
              }`}
              title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
              aria-label="Favorite wallpaper"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div id="wallpaper-modal-scroll" className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 custom-scrollbar">
          {/* High-Res Image Display Stage (Clean & Elegant, Touch Swipe enabled for iPhone & Android) */}
          <div
            className="w-full flex items-center justify-center bg-zinc-900/50 rounded-2xl p-2 sm:p-4 border border-white/[0.06] relative overflow-hidden min-h-[260px] sm:min-h-[300px] group touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Ambient backlight glow matching image tone */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
              style={{ backgroundColor: wallpaper.color || '#6366f1' }}
            />

            {/* Slideshow Progress Bar (Top of Image Stage) */}
            {isSlideshowActive && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 transition-all duration-100 ease-linear"
                  style={{ width: `${slideshowProgress}%` }}
                />
              </div>
            )}

            {/* Slideshow Active Indicator Pill */}
            {isSlideshowActive && (
              <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/30 text-[11px] font-medium text-cyan-300 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Slideshow Active ({slideshowDelay}s)</span>
              </div>
            )}

            {/* Previous Wallpaper Navigation Button */}
            {onPrevWallpaper && (
              <button
                id="btn-prev-wallpaper"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevWallpaper();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-xl hover:scale-110 opacity-70 hover:opacity-100 cursor-pointer"
                title="Previous wallpaper (Left arrow)"
                aria-label="Previous wallpaper"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next Wallpaper Navigation Button */}
            {onNextWallpaper && (
              <button
                id="btn-next-wallpaper"
                onClick={(e) => {
                  e.stopPropagation();
                  onNextWallpaper();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-xl hover:scale-110 opacity-70 hover:opacity-100 cursor-pointer"
                title="Next wallpaper (Right arrow)"
                aria-label="Next wallpaper"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Key Press Visual Feedback Indicator */}
            {keyNavIndicator && (
              <div
                className={`absolute z-30 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-cyan-500/80 text-black shadow-2xl backdrop-blur-md animate-in zoom-in-75 duration-150 pointer-events-none ${
                  keyNavIndicator === 'left' ? 'left-8' : 'right-8'
                }`}
                aria-hidden="true"
              >
                {keyNavIndicator === 'left' ? (
                  <ChevronLeft className="w-8 h-8 stroke-[3]" />
                ) : (
                  <ChevronRight className="w-8 h-8 stroke-[3]" />
                )}
              </div>
            )}

            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-spin opacity-50" />
              </div>
            )}

            <img
              src={modalImgSrc}
              alt={seoAltText}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                const fallback = wallpaper.imageUrl || wallpaper.thumbUrl || wallpaper.url;
                if (fallback && fallback !== modalImgSrc) {
                  setModalImgSrc(fallback);
                }
              }}
              className={`max-h-[52vh] w-auto max-w-full rounded-xl object-contain shadow-2xl relative z-10 transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Accessible Keyboard & Mobile Swipe Navigation Hint Strip */}
          <div
            id="keyboard-nav-hint-strip"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400"
            aria-label="Keyboard and swipe navigation shortcuts"
          >
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="hidden sm:inline">Use keyboard or swipe:</span>
              <span className="sm:hidden text-[11px] text-zinc-300">Swipe photo or:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={onPrevWallpaper}
                  disabled={!onPrevWallpaper}
                  className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/15 font-mono text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                  aria-label="Previous wallpaper"
                >
                  <kbd>←</kbd>
                  <span className="hidden md:inline text-[10px]">Prev</span>
                </button>
                <button
                  onClick={onNextWallpaper}
                  disabled={!onNextWallpaper}
                  className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/15 font-mono text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                  aria-label="Next wallpaper"
                >
                  <kbd>→</kbd>
                  <span className="hidden md:inline text-[10px]">Next</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="hidden sm:inline text-zinc-400">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-[10px] text-zinc-300 mr-1">
                  Space
                </kbd>
                slideshow
              </span>
              <button
                onClick={() => setShowKeyboardHelper((prev) => !prev)}
                className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                aria-label="All keyboard shortcuts"
              >
                <span>Shortcuts</span>
                <kbd className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-400/30">
                  ?
                </kbd>
              </button>
            </div>
          </div>

          {/* Download Center: Primary Original 4K + High-Quality Cropped Resolutions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                Download Max-Quality Wallpapers
              </span>
              {downloadStatus && (
                <span className="text-xs font-mono text-indigo-400 animate-pulse">
                  {downloadStatus}
                </span>
              )}
            </div>

            {/* 1. Primary Download Button: Original 4K / Ultra HD (Max Quality) */}
            <button
              id="btn-download-original-4k"
              onClick={() => handleDownload('original')}
              disabled={downloadingRes !== null}
              className="w-full group p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] border border-indigo-400/30 text-white shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-between cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    Original 4K / Ultra HD (Max Quality)
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/20 text-white border border-white/30 font-bold">
                      RAW MASTER
                    </span>
                  </div>
                  <div className="text-xs text-indigo-100/90 font-mono mt-0.5">
                    Raw uncompressed file (10MB–20MB) • No compression applied
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 group-hover:bg-white/25 transition-colors">
                <Download className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                  Download 4K
                </span>
              </div>
            </button>

            {/* 2. Cropped Resolutions Grid (True 4K UHD Desktop, QHD Mobile, Retina Tablet) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Button 1: Desktop (16:9) True 4K UHD */}
              <button
                id="btn-download-desktop"
                onClick={() => handleDownload('desktop')}
                disabled={downloadingRes !== null}
                className="group p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] hover:border-indigo-500/50 transition-all flex items-center justify-between cursor-pointer text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      Desktop (16:9)
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">3840 × 2160 True 4K</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </button>

              {/* Button 2: Mobile (9:16) QHD */}
              <button
                id="btn-download-mobile"
                onClick={() => handleDownload('mobile')}
                disabled={downloadingRes !== null}
                className="group p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] hover:border-purple-500/50 transition-all flex items-center justify-between cursor-pointer text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                      Mobile (9:16)
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">1440 × 2560 QHD</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </button>

              {/* Button 3: Tablet (4:3) Retina */}
              <button
                id="btn-download-tablet"
                onClick={() => handleDownload('tablet')}
                disabled={downloadingRes !== null}
                className="group p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] hover:border-pink-500/50 transition-all flex items-center justify-between cursor-pointer text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                    <Tablet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-pink-300 transition-colors">
                      Tablet (4:3)
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">2048 × 1536 Retina</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Leaderboard Banner 728x90 Under Download Actions (Mandated SEO/AdSense Integration) */}
          <div className="w-full pt-1">
            <AdSensePlaceholder
              format="banner-728x90"
              slotId={`leaderboard-modal-${wallpaper.id}`}
              onLearnMore={onOpenPrivacyModal}
            />
          </div>

          {/* "Same Vibe" / Related Wallpapers Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Same Vibe &amp; Similar 4K Wallpapers
                </h3>
              </div>
              {relatedKeyword && (
                <span className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/10">
                  #{relatedKeyword}
                </span>
              )}
            </div>

            {isLoadingRelated ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video rounded-xl bg-white/[0.03] animate-pulse border border-white/[0.05]" />
                ))}
              </div>
            ) : relatedWallpapers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedWallpapers.slice(0, 8).map((relWp) => (
                  <button
                    key={relWp.id}
                    onClick={() => handleSelectRelated(relWp)}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-300 bg-zinc-900 focus:outline-none cursor-pointer text-left"
                  >
                    <img
                      src={relWp.thumbnail || relWp.imageUrl || relWp.url}
                      alt={relWp.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-semibold text-white truncate block">
                        {relWp.title}
                      </span>
                      <span className="text-[9px] text-zinc-400 truncate block">
                        by {relWp.authorName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">
                No directly related wallpapers found. Explore more in the gallery below.
              </p>
            )}
          </div>

          {/* SEO Section: Auto-Generated H2 Tag, Descriptive Paragraph, and Dynamically Extracted Tags */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3.5">
            {/* SEO H2 Tag */}
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {seoH2Headline}
            </h2>

            {/* SEO Descriptive Paragraph */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {seoParagraph}
            </p>

            {/* Dynamically Extracted Tags for Search & SEO Crawlers */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
                <Tag className="w-3 h-3 text-indigo-400" />
                <span>Related Wallpaper Tags:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onTagClick(tag);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-xl text-xs bg-white/[0.05] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Creative Licensing & API Attribution */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400 border-t border-white/[0.04]">
              <span>Free to use under {licenseName}. No attribution required.</span>
              <a
                href={apiVerifiedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                {apiVerifiedName} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
