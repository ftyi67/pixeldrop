import React from 'react';
import { ExternalLink, Info, Sparkles } from 'lucide-react';

interface AdSensePlaceholderProps {
  format: 'banner-728x90' | 'square-250x250' | 'infeed-300x250' | 'modal-banner';
  slotId?: string;
  className?: string;
  onLearnMore?: () => void;
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  format,
  slotId = 'ca-pub-demo-slot',
  className = '',
  onLearnMore,
}) => {
  if (format === 'modal-banner' || format === 'banner-728x90') {
    return (
      <div
        id={`adsense-banner-${slotId}`}
        className={`w-full max-w-2xl mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-3 sm:p-4 text-zinc-300 shadow-lg relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] ${className}`}
      >
        {/* Subtle glass glow line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* AdSense Top Header */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 select-none pb-1.5">
          <span className="flex items-center gap-1.5 font-mono tracking-wider uppercase font-semibold text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AdSense Sponsor Display
          </span>
          <button
            onClick={onLearnMore}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Google AdSense & AdChoices Info"
          >
            <span>AdChoices</span>
            <Info className="w-3 h-3" />
          </button>
        </div>

        {/* Banner Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-white tracking-wide">
                4K Ultrawide Monitors & Color-Accurate OLEDs
              </p>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                Elevate your desktop setup with 144Hz HDR displays built for creative wallpapers.
              </p>
            </div>
          </div>

          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    );
  }

  // Square Ad 250x250 (injected naturally into the Masonry Grid)
  return (
    <div
      id={`adsense-square-${slotId}`}
      className={`w-full max-w-[280px] min-h-[260px] mx-auto p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] shadow-xl break-inside-avoid ${className}`}
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      {/* Header */}
      <div className="w-full flex items-center justify-between text-[10px] text-zinc-400 select-none">
        <span className="font-mono uppercase tracking-wider flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Sponsored 250×250
        </span>
        <button
          onClick={onLearnMore}
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>AdChoices</span>
          <Info className="w-3 h-3" />
        </button>
      </div>

      {/* Body */}
      <div className="my-auto py-3 flex flex-col items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-indigo-300 shadow-inner">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-semibold text-white">
          Architectural & Studio Workspaces
        </h4>
        <p className="text-[11px] text-zinc-400 px-1 leading-relaxed">
          Clean accessories and ergonomic monitor arms for clean, distraction-free setups.
        </p>
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-white text-xs font-medium border border-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
        >
          <span>View Sponsor</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-[9px] text-zinc-500 select-none pt-2 border-t border-white/[0.06]">
        Google AdSense Verified Placement
      </div>
    </div>
  );
};
