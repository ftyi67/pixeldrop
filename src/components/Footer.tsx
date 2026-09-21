import React from 'react';
import { Droplets, ShieldCheck, Heart, Layers, ExternalLink, Sparkles, Mail, FileText, Scale, BookOpen } from 'lucide-react';
import { WallpaperCategory } from '../types';

export type LegalTab = 'privacy' | 'terms' | 'dmca' | 'contact';

interface FooterProps {
  onSelectCategory?: (category: WallpaperCategory) => void;
  onOpenGradient?: () => void;
  onOpenFavorites?: () => void;
  onOpenArticles?: () => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenGradient,
  onOpenFavorites,
  onOpenArticles,
  onOpenLegal,
}) => {
  const currentYear = new Date().getFullYear();

  const handleLegalClick = (tab: LegalTab, fallbackHref: string) => {
    if (onOpenLegal) {
      onOpenLegal(tab);
    } else {
      window.location.href = fallbackHref;
    }
  };

  return (
    <footer id="global-footer" className="w-full mt-16 border-t border-white/[0.08] bg-zinc-950/90 backdrop-blur-2xl text-zinc-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Consumer Mission */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <span className="font-extrabold text-white text-base tracking-tight font-['Space_Grotesk',sans-serif]">
                Pixel<span className="text-cyan-400">Drop</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
              Your destination for free 4K and Ultra HD wallpapers. Discover thousands of curated backgrounds for Mobile, PC, and Tablet with instant resolution cropping and live CSS gradient studio.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-zinc-400">
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-cyan-300 font-semibold">
                Ultra HD 4K
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-emerald-400 font-semibold">
                100% Free
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-purple-300 font-semibold">
                Raw Quality
              </span>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div>
            <h4 className="font-semibold text-white text-xs mb-3.5 uppercase tracking-wider">
              Popular Collections
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectCategory?.('nature')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Nature & 4K Landscapes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('cyberpunk')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cyberpunk & Tokyo Neon
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('anime')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Anime & Aesthetic Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('minimalist')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Minimalist & Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('dark')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  AMOLED Deep Black
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('space')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cosmos & Deep Space
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Discovery & Tools */}
          <div>
            <h4 className="font-semibold text-white text-xs mb-3.5 uppercase tracking-wider">
              Explore & Tools
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectCategory?.('trending')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Trending Wallpapers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenArticles?.()}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-cyan-300"
                >
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                  Articles & Guides 4K (SEO)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenGradient?.()}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3 h-3 text-indigo-400" />
                  CSS Gradient Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenFavorites?.()}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="w-3 h-3 text-rose-400" />
                  Saved Favorites
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('contact', '/contact')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3 text-cyan-400" />
                  Request a Wallpaper
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Publisher Policies */}
          <div>
            <h4 className="font-semibold text-white text-xs mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => handleLegalClick('privacy', '/privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-zinc-400" />
                  Privacy Policy (GDPR / CCPA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('terms', '/terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <Scale className="w-3 h-3 text-zinc-400" />
                  Terms of Service & License
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('dmca', '/dmca')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-rose-400" />
                  DMCA Copyright Takedown
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick('contact', '/contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-indigo-400" />
                  Contact & Support
                </button>
              </li>
              <li>
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-zinc-400"
                >
                  Google AdChoices Settings <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Clean Copyright and Essential Links */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>
            © {currentYear} PixelDrop. Free Ultra HD & 4K Wallpapers for personal use.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleLegalClick('privacy', '/privacy')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => handleLegalClick('terms', '/terms')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => handleLegalClick('dmca', '/dmca')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              DMCA Takedown
            </button>
            <span>•</span>
            <button
              onClick={() => handleLegalClick('contact', '/contact')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
