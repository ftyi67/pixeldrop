import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, FolderTree, Sparkles, Key } from 'lucide-react';

interface NextjsInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextjsInstructionsModal: React.FC<NextjsInstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectStructure = `pixeldrop-nextjs/
├── app/
│   ├── api/
│   │   ├── wallpapers/
│   │   │   └── route.ts       # Secure server-side multi-source proxy
│   │   └── download/
│   │       └── route.ts       # 4K master download stream proxy (bypasses 403 Forbidden)
│   ├── layout.tsx             # Root layout with Multilingual SEO Meta & AdSense
│   ├── page.tsx               # Home Page with PixelDrop Hero & Multi-API Aggregator
│   ├── sitemap.ts             # MetadataRoute.Sitemap with categories
│   ├── robots.ts              # MetadataRoute.Robots SEO crawler rules
│   ├── gradient/
│   │   └── page.tsx           # CSS Gradient Generator route
│   └── privacy/
│       └── page.tsx           # GDPR, CCPA & AdSense Compliance
├── components/
│   ├── PixelDropHero.tsx      # Glassmorphism Hero with #AMOLED, #Cars, etc.
│   ├── MasonryGrid.tsx        # Zero CLS dynamic aspect-ratio & 40-item infinite scroll
│   ├── WallpaperCard.tsx      # Optimized card with dynamic aspect ratio
│   ├── WallpaperModal.tsx     # 3-button Smart Resizer (Desktop, Mobile, Tablet)
│   ├── AdSensePlaceholder.tsx # 728x90 Leaderboard & 250x250 In-Feed units
│   ├── CookieConsentBanner.tsx# GDPR/CCPA Consent Manager
│   └── GradientGenerator.tsx  # Canvas 4K PNG & CSS Studio
├── services/
│   ├── multiApiAggregator.ts  # Promise.allSettled Pexels + Pixabay aggregator
│   └── pexels.ts              # Pexels API client requesting internal /api/wallpapers
├── types/
│   └── index.ts               # Unified Wallpaper & Category types
├── public/
│   ├── ads.txt                # Google AdSense authorized sellers file
│   ├── sitemap.xml            # Static search engine sitemap
│   └── robots.txt             # SEO crawler directives
├── .env.local                 # PEXELS_API_KEY (Server-side developer secret)
└── package.json`;

  const installCommands = `# 1. Create fresh Next.js (App Router) project
npx create-next-app@latest pixeldrop --typescript --tailwind --eslint --app

# 2. Install required icons and animation packages
npm install lucide-react motion

# 3. Add Server-Side API Key to .env.local (Never exposed to browser)
echo "PEXELS_API_KEY=your_pexels_secret_key" >> .env.local

# 4. Deploy instantly to Vercel
npx vercel`;

  const adsTxtSnippet = `# Google AdSense ads.txt compliance file
# Place in public/ads.txt
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`;

  return (
    <div
      id="nextjs-instructions-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="nextjs-instructions-modal-container"
        className="w-full max-w-3xl my-8 bg-zinc-950/90 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 relative max-h-[90vh] overflow-y-auto backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Next.js (App Router) & Vercel Architecture
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  SEO & Pexels
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Pexels API infinite scroll, automated OpenGraph metadata, and Google AdSense setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm text-zinc-300">
          {/* Section 1: Quick Deployment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Vercel Terminal Setup & Pexels API Key
              </span>
              <button
                onClick={() => copyCode('install', installCommands)}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'install' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] font-mono text-[11px] text-indigo-300 overflow-x-auto">
              {installCommands}
            </pre>
          </div>

          {/* Section 2: Directory Architecture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                <FolderTree className="w-4 h-4 text-purple-400" />
                App Router Directory Tree
              </span>
              <button
                onClick={() => copyCode('tree', projectStructure)}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'tree' ? 'Copied' : 'Copy Tree'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] font-mono text-[11px] text-zinc-400 overflow-x-auto leading-relaxed">
              {projectStructure}
            </pre>
          </div>

          {/* Section 3: AdSense Verification File ads.txt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Google AdSense Verification (public/ads.txt)
              </span>
              <button
                onClick={() => copyCode('adstxt', adsTxtSnippet)}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'adstxt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'adstxt' ? 'Copied' : 'Copy snippet'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] font-mono text-[11px] text-emerald-400 overflow-x-auto">
              {adsTxtSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Optimized for Next.js 14/15 App Router & React 19
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
