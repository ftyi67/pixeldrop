import React, { useState } from 'react';
import { X, Key, Check, ExternalLink, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { getPexelsApiKey, setPexelsApiKey } from '../services/pexels';
import { getPixabayApiKey, setPixabayApiKey } from '../services/multiApiAggregator';

interface PexelsKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const PexelsKeyModal: React.FC<PexelsKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [pexelsKey, setPexelsKey] = useState(getPexelsApiKey());
  const [pixabayKey, setPixabayKey] = useState(getPixabayApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPexelsApiKey(pexelsKey);
    setPixabayApiKey(pixabayKey);
    setIsSaved(true);
    onKeyUpdated();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-zinc-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multi-API Stream Setup</h3>
            <p className="text-xs text-zinc-400">Pexels + Pixabay Multi-Source Aggregation</p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
          WallCraft aggregates live 4K wallpapers from both <strong>Pexels</strong> and <strong>Pixabay</strong> via <code className="text-indigo-300 font-mono text-[11px]">Promise.allSettled</code>. Enter your keys below or rely on our pre-warmed curated catalog fallback.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Pexels API Input */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                Pexels API Key
              </label>
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
              >
                Get Free Pexels Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              placeholder="e.g. process.env.NEXT_PUBLIC_PEXELS_API_KEY..."
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Pixabay API Input */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Pixabay API Key
              </label>
              <a
                href="https://pixabay.com/api/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                Get Free Pixabay Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              placeholder="e.g. process.env.NEXT_PUBLIC_PIXABAY_API_KEY..."
              value={pixabayKey}
              onChange={(e) => setPixabayKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Free & Unlimited Calls
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Aggregated via Promise.allSettled
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? 'API Keys Active!' : 'Save & Refresh Aggregator'}</span>
            </button>
            {(pexelsKey || pixabayKey) && (
              <button
                type="button"
                onClick={() => {
                  setPexelsKey('');
                  setPixabayKey('');
                  setPexelsApiKey('');
                  setPixabayApiKey('');
                  onKeyUpdated();
                }}
                className="px-3 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
