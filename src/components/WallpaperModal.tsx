import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Wallpaper, DownloadResolution } from '../types';
import { AdSensePlaceholder } from './AdSensePlaceholder';
import { getPexelsResizedUrl, downloadWallpaperDirect } from '../services/pexels';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTagClick: (tag: string) => void;
  onOpenPrivacyModal: () => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  wallpaper,
  isFavorite,
  onClose,
  onToggleFavorite,
  onTagClick,
  onOpenPrivacyModal,
}) => {
  const [downloadingRes, setDownloadingRes] = useState<DownloadResolution | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setImageLoaded(false);
  }, [wallpaper?.id]);

  if (!wallpaper) return null;

  const handleDownload = async (resolution: DownloadResolution) => {
    setDownloadingRes(resolution);
    setDownloadStatus(
      resolution === 'original'
        ? 'Downloading raw uncompressed 4K master (10MB–20MB)...'
        : `Rendering high-definition ${resolution} (q=100)...`
    );

    // 1. Primary Original 4K / Ultra HD: raw photo.src.original with NO URL modifications
    const rawOriginalUrl = (wallpaper.url || wallpaper.rawSrc?.original || wallpaper.fullUrl || '').split('?')[0];

    // 2. Cropped high-quality resolutions with auto=compress completely removed and q=100
    let targetUrl: string;
    if (resolution === 'original' || wallpaper.source === 'wallhaven') {
      targetUrl = rawOriginalUrl;
    } else if (resolution === 'desktop') {
      targetUrl = `${rawOriginalUrl}?cs=tinysrgb&fit=crop&w=3840&h=2160&q=100`;
    } else if (resolution === 'mobile') {
      targetUrl = `${rawOriginalUrl}?cs=tinysrgb&fit=crop&w=1440&h=2560&q=100`;
    } else if (resolution === 'tablet') {
      targetUrl = `${rawOriginalUrl}?cs=tinysrgb&fit=crop&w=2048&h=1536&q=100`;
    } else {
      targetUrl = rawOriginalUrl;
    }

    // Standardized PixelDrop-4K filename format
    const cleanId = wallpaper.id.replace(/^pexels-|^pixabay-|^wallhaven-|^unsplash-/, '');
    const filename =
      resolution === 'original'
        ? `PixelDrop-4K-${cleanId}.jpg`
        : `PixelDrop-4K-${cleanId}-${resolution}.jpg`;

    try {
      // 3. File Blob Handling: fetch(imageUrl) -> response.blob() -> URL.createObjectURL(blob)
      const res = await fetch(targetUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP fetch error ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      setDownloadStatus('Download complete!');
    } catch (err) {
      console.warn('CORS restricted direct blob stream, falling back to direct anchor trigger:', err);
      // Fallback: direct anchor trigger
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStatus('Download initiated!');
    } finally {
      setTimeout(() => {
        setDownloadingRes(null);
        setDownloadStatus('');
      }, 1500);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}?wallpaper=${wallpaper.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="wallpaper-modal-container"
        className="w-full max-w-4xl my-auto bg-zinc-950/85 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100 relative max-h-[92vh] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Glass Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {wallpaper.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>{isWallhaven ? 'Artwork by' : 'Photo by'}</span>
              <a
                href={wallpaper.authorLink || wallpaper.authorProfile || (isWallhaven ? 'https://wallhaven.cc' : 'https://www.pexels.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-200 font-medium hover:text-white flex items-center gap-1 hover:underline"
              >
                {wallpaper.authorName}
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 custom-scrollbar">
          {/* High-Res Image Display Stage (Clean & Elegant, No Bulky Simulators) */}
          <div className="w-full flex items-center justify-center bg-zinc-900/50 rounded-2xl p-2 sm:p-4 border border-white/[0.06] relative overflow-hidden min-h-[300px]">
            {/* Ambient backlight glow matching image tone */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
              style={{ backgroundColor: wallpaper.color || '#6366f1' }}
            />

            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-spin opacity-50" />
              </div>
            )}

            <img
              src={wallpaper.fullUrl}
              alt={seoAltText}
              onLoad={() => setImageLoaded(true)}
              className={`max-h-[52vh] w-auto max-w-full rounded-xl object-contain shadow-2xl relative z-10 transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
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
