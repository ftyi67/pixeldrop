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
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { Wallpaper, DownloadResolution } from '../types';
import { AdSensePlaceholder } from './AdSensePlaceholder';
import { downloadWallpaperDirectly } from '../utils/downloadHelper';
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

const STOP_WORDS = new Set([
  'wallpaper', 'wallpapers', '4k', 'ultra', 'hd', 'fond', "d'écran", 'decran',
  'free', 'gratuit', 'background', 'backgrounds', 'photo', 'image', 'curated', 'by',
  'high', 'resolution', 'desktop', 'mobile', 'for', 'and', 'the', 'pexels', 'wallhaven',
  'unsplash', 'pixabay', 'artist', 'creator', 'illustration', 'collection', 'setup'
]);

function extractKeywords(wp: Wallpaper): string {
  if (!wp) return '4k';
  const words = (wp.title || '')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (words.length > 0) return words.slice(0, 2).join(' ');
  if (wp.tags && wp.tags.length > 0) {
    const candidateTag = wp.tags.find((t) => !STOP_WORDS.has(t.toLowerCase()) && t.length > 2);
    if (candidateTag) return candidateTag;
  }
  if (wp.category && wp.category !== 'all') return wp.category;
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
  const [showResDropdown, setShowResDropdown] = useState(false);

  // Slideshow Mode State
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowDelay, setSlideshowDelay] = useState<number>(4);
  const [slideshowProgress, setSlideshowProgress] = useState(0);
  const [showSlideshowSettings, setShowSlideshowSettings] = useState(false);

  // Keyboard navigation & gestures
  const [showKeyboardHelper, setShowKeyboardHelper] = useState(false);
  const [keyNavIndicator, setKeyNavIndicator] = useState<'left' | 'right' | null>(null);
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('');

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

  // Related wallpapers
  const [relatedWallpapers, setRelatedWallpapers] = useState<Wallpaper[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [relatedKeyword, setRelatedKeyword] = useState('');

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Escape') {
        if (showKeyboardHelper) setShowKeyboardHelper(false);
        else if (showSlideshowSettings) setShowSlideshowSettings(false);
        else if (showResDropdown) setShowResDropdown(false);
        else onClose();
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
  }, [onClose, onNextWallpaper, onPrevWallpaper, showKeyboardHelper, showSlideshowSettings, showResDropdown]);

  useEffect(() => {
    if (wallpaper) {
      setAriaAnnouncement(`Displaying wallpaper: ${wallpaper.title} by ${wallpaper.authorName}`);
    }
  }, [wallpaper?.id]);

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

    return () => clearInterval(timer);
  }, [isSlideshowActive, slideshowDelay, wallpaper?.id, onNextWallpaper]);

  useEffect(() => {
    setImageLoaded(false);
    setModalImgSrc(wallpaper?.fullUrl || wallpaper?.url || wallpaper?.imageUrl || '');
    setShowResDropdown(false);
  }, [wallpaper?.id, wallpaper?.fullUrl, wallpaper?.url, wallpaper?.imageUrl]);

  // Fetch related wallpapers
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
              authorName: w.authorName || 'Creator',
              authorProfile: w.authorProfile || '',
              authorLink: w.authorProfile || '',
              category: (wallpaper.category || w.category || 'all') as any,
              width: w.width || 1920,
              height: w.height || 1080,
              tags: [keyword, '4k', 'wallpaper'],
              description: `Related 4K wallpaper for ${keyword}`,
              source: w.source || 'pexels',
              views: 1200,
              downloads: 400,
              likes: 90,
              orientation: w.width >= w.height ? 'landscape' : 'portrait',
            }));
          }
          const filtered = items.filter((item) => item.id !== wallpaper.id && item.url !== wallpaper.url);
          if (isMounted) {
            if (filtered.length > 0) {
              setRelatedWallpapers(filtered.slice(0, 8));
            } else {
              const fallbackRes = await fetchAggregatedWallpapers(1, 8, wallpaper.category, keyword);
              const fbFiltered = fallbackRes.wallpapers.filter((w) => w.id !== wallpaper.id);
              setRelatedWallpapers(fbFiltered.slice(0, 8));
            }
          }
        }
      } catch {
        // Silently handle
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
    setShowResDropdown(false);
    setDownloadStatus(
      resolution === 'original'
        ? 'Downloading raw uncompressed 4K master...'
        : `Rendering ${resolution} resolution...`
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
    if (onSelectWallpaper) onSelectWallpaper(relatedWp);
    const scrollContainer = document.getElementById('wallpaper-modal-scroll');
    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const authorInitial = wallpaper.authorName ? wallpaper.authorName.charAt(0).toUpperCase() : 'P';
  const categoryCapitalized = wallpaper.category.charAt(0).toUpperCase() + wallpaper.category.slice(1);
  const isWallhaven = wallpaper.source === 'wallhaven';
  const licenseName = isWallhaven ? 'Wallhaven SFW License' : 'Pexels Open License (Free to use)';

  return (
    <div
      id="wallpaper-details-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Wallpaper details for ${wallpaper.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200 safe-inset"
      onClick={onClose}
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      <div
        id="wallpaper-modal-container"
        className="w-full max-w-5xl my-auto bg-white dark:bg-[#121319] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-900 dark:text-zinc-100 relative max-h-[94vh] max-h-[94dvh] gpu-layer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pexels Style Header: Author on left, Pexels Green "Free Download" button on right */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121319] select-none">
          {/* Author info */}
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs border border-zinc-300 dark:border-zinc-700">
              {authorInitial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <a
                  href={wallpaper.authorLink || wallpaper.authorProfile || 'https://www.pexels.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm text-zinc-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1 truncate"
                >
                  <span className="truncate">{wallpaper.authorName}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                </a>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  Free to use
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {wallpaper.title || `${categoryCapitalized} Wallpaper`}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Pexels Signature "Free Download" Button with Dropdown Chevron */}
            <div className="relative flex items-center">
              <div className="inline-flex rounded-lg shadow-sm">
                <button
                  id="btn-modal-free-download"
                  onClick={() => handleDownload('original')}
                  disabled={downloadingRes !== null}
                  className="px-3.5 sm:px-4 py-2 rounded-l-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {downloadingRes ? (
                    <span className="animate-spin text-white">◷</span>
                  ) : (
                    <Download className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>Free Download</span>
                </button>
                <button
                  onClick={() => setShowResDropdown((prev) => !prev)}
                  className="px-2 py-2 rounded-r-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border-l border-emerald-400/40 transition-colors cursor-pointer"
                  title="Choose resolution"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Resolution Dropdown Popover */}
              {showResDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-white dark:bg-[#1a1c24] border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 space-y-1 animate-in fade-in duration-100">
                  <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Choose Size
                  </div>
                  <button
                    onClick={() => handleDownload('original')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Original (4K Raw)</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {wallpaper.width} × {wallpaper.height}
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Master
                    </span>
                  </button>

                  <button
                    onClick={() => handleDownload('desktop')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Desktop 16:9</div>
                      <div className="text-[10px] text-zinc-500 font-mono">3840 × 2160 UHD</div>
                    </div>
                    <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => handleDownload('mobile')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Mobile 9:16</div>
                      <div className="text-[10px] text-zinc-500 font-mono">1440 × 2560 QHD</div>
                    </div>
                    <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => handleDownload('tablet')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Tablet 4:3</div>
                      <div className="text-[10px] text-zinc-500 font-mono">2048 × 1536 Retina</div>
                    </div>
                    <Tablet className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => onToggleFavorite(wallpaper.id, e)}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-500 border-rose-200 dark:border-rose-500/30'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border-transparent'
              }`}
              title={isFavorite ? 'Remove from saved' : 'Save'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleCopyShareLink}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Slideshow button */}
            <button
              onClick={() => setIsSlideshowActive((prev) => !prev)}
              className={`p-2 rounded-lg transition-colors cursor-pointer hidden sm:block ${
                isSlideshowActive
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
              }`}
              title={isSlideshowActive ? 'Pause slideshow' : 'Start slideshow'}
            >
              {isSlideshowActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Stage & Details */}
        <div id="wallpaper-modal-scroll" className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 custom-scrollbar">
          {/* Wallpaper Image Stage */}
          <div
            className="w-full flex items-center justify-center bg-zinc-100 dark:bg-[#0c0d14] rounded-2xl p-2 sm:p-4 relative overflow-hidden min-h-[300px] select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slideshow progress bar */}
            {isSlideshowActive && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-30">
                <div
                  className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
                  style={{ width: `${slideshowProgress}%` }}
                />
              </div>
            )}

            {/* Previous Arrow */}
            {onPrevWallpaper && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevWallpaper();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                title="Previous (Left arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next Arrow */}
            {onNextWallpaper && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNextWallpaper();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                title="Next (Right arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {keyNavIndicator && (
              <div
                className={`absolute z-30 top-1/2 -translate-y-1/2 p-3 rounded-full bg-emerald-500 text-white shadow-xl ${
                  keyNavIndicator === 'left' ? 'left-8' : 'right-8'
                }`}
              >
                {keyNavIndicator === 'left' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            )}

            <img
              src={modalImgSrc}
              alt={wallpaper.title}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                const fallback = wallpaper.imageUrl || wallpaper.thumbUrl || wallpaper.url;
                if (fallback && fallback !== modalImgSrc) setModalImgSrc(fallback);
              }}
              className={`max-h-[58vh] w-auto max-w-full rounded-xl object-contain shadow-lg relative z-10 transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Quick Technical Details Row (Pexels Style) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-[#161822] border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] uppercase font-mono block text-zinc-400">Resolution</span>
                <span className="font-semibold text-zinc-900 dark:text-white font-mono">
                  {wallpaper.width} × {wallpaper.height}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono block text-zinc-400">Quality</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {wallpaper.width >= 3840 ? '4K Ultra HD' : wallpaper.width >= 2560 ? '2K Quad HD' : 'Full HD'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono block text-zinc-400">Aspect Ratio</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {wallpaper.orientation === 'landscape' ? '16:9 Desktop' : '9:16 Mobile'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">{licenseName}</span>
            </div>
          </div>

          {/* Download Center Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                Download Formats
              </span>
              {downloadStatus && (
                <span className="text-xs font-mono text-emerald-500 animate-pulse">{downloadStatus}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleDownload('original')}
                disabled={downloadingRes !== null}
                className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="font-bold">Original 4K</div>
                  <div className="text-[10px] opacity-90 font-mono">Raw Master</div>
                </div>
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownload('desktop')}
                disabled={downloadingRes !== null}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1c24] dark:hover:bg-[#222530] text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div>Desktop 16:9</div>
                  <div className="text-[10px] text-zinc-500 font-mono">3840 × 2160 UHD</div>
                </div>
                <Monitor className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                onClick={() => handleDownload('mobile')}
                disabled={downloadingRes !== null}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1c24] dark:hover:bg-[#222530] text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div>Mobile 9:16</div>
                  <div className="text-[10px] text-zinc-500 font-mono">1440 × 2560 QHD</div>
                </div>
                <Smartphone className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                onClick={() => handleDownload('tablet')}
                disabled={downloadingRes !== null}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1c24] dark:hover:bg-[#222530] text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div>Tablet 4:3</div>
                  <div className="text-[10px] text-zinc-500 font-mono">2048 × 1536 Retina</div>
                </div>
                <Tablet className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* AdSense Placement */}
          <div className="w-full pt-1">
            <AdSensePlaceholder
              format="banner-728x90"
              slotId={`leaderboard-modal-${wallpaper.id}`}
              onLearnMore={onOpenPrivacyModal}
            />
          </div>

          {/* Similar Wallpapers (Pexels "Similar Photos" section) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Similar 4K Wallpapers
              </h3>
              {relatedKeyword && (
                <span className="text-xs text-zinc-500">#{relatedKeyword}</span>
              )}
            </div>

            {isLoadingRelated ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : relatedWallpapers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedWallpapers.map((relWp) => (
                  <button
                    key={relWp.id}
                    onClick={() => handleSelectRelated(relWp)}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 transition-all cursor-pointer text-left"
                  >
                    <img
                      src={relWp.thumbnail || relWp.imageUrl || relWp.url}
                      alt={relWp.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[11px] font-semibold text-white truncate">
                        {relWp.title}
                      </span>
                      <span className="text-[10px] text-zinc-300 truncate">
                        by {relWp.authorName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Tags & Creative License */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#161822] border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {wallpaper.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onTagClick(tag);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-full text-xs bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Téléchargez gratuitement ce fond d&apos;écran 4K ultra-haute définition &ldquo;{wallpaper.title}&rdquo; par {wallpaper.authorName}. Royalty-free under {licenseName}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
