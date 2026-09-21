import React, { useState } from 'react';
import {
  Palette,
  Maximize2,
  Filter,
  X,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { PexelsColorPalette, PexelsResolutionRange } from '../types';

export interface AdvancedSearchFiltersProps {
  selectedColor: PexelsColorPalette;
  onChangeColor: (color: PexelsColorPalette) => void;
  selectedResolution: PexelsResolutionRange;
  onChangeResolution: (size: PexelsResolutionRange) => void;
  onResetFilters: () => void;
  activeCount: number;
  totalResults?: number;
  isDark?: boolean;
}

// Official Pexels API supported colors with display hex values & descriptive labels
export const PEXELS_COLOR_PALETTES: {
  id: string;
  name: string;
  hex: string;
  border?: string;
}[] = [
  { id: 'all', name: 'All Colors', hex: 'transparent' },
  { id: 'red', name: 'Ruby Red', hex: '#ef4444' },
  { id: 'orange', name: 'Vibrant Orange', hex: '#f97316' },
  { id: 'yellow', name: 'Golden Yellow', hex: '#eab308' },
  { id: 'green', name: 'Emerald Green', hex: '#22c55e' },
  { id: 'turquoise', name: 'Turquoise Cyan', hex: '#06b6d4' },
  { id: 'blue', name: 'Ocean Blue', hex: '#3b82f6' },
  { id: 'violet', name: 'Deep Violet', hex: '#8b5cf6' },
  { id: 'pink', name: 'Neon Pink', hex: '#ec4899' },
  { id: 'brown', name: 'Warm Brown', hex: '#78350f' },
  { id: 'black', name: 'AMOLED Black', hex: '#09090b', border: '#27272a' },
  { id: 'gray', name: 'Slate Gray', hex: '#71717a' },
  { id: 'white', name: 'Pure White', hex: '#f4f4f5', border: '#d4d4d8' },
];

// Official Pexels API size parameters with resolution specifications
export const PEXELS_RESOLUTION_RANGES: {
  id: PexelsResolutionRange;
  label: string;
  spec: string;
  description: string;
  badge: string;
}[] = [
  {
    id: 'all',
    label: 'All Resolutions',
    spec: 'Any Resolution',
    description: 'Displays all available resolutions and aspect ratios',
    badge: 'Standard',
  },
  {
    id: 'large',
    label: '4K UHD & 8K',
    spec: '≥ 3840×2160 (24MP+)',
    description: 'Pexels API &size=large (True 4K UHD, 8K Ultra High Definition)',
    badge: '4K Ultra',
  },
  {
    id: 'medium',
    label: '2K Quad HD',
    spec: '≥ 2560×1440 (12MP–24MP)',
    description: 'Pexels API &size=medium (Crisp 2K QHD Retina displays)',
    badge: '2K QHD',
  },
  {
    id: 'small',
    label: 'Full HD 1080p',
    spec: '≥ 1920×1080 (4MP–12MP)',
    description: 'Pexels API &size=small (1080p high performance mobile & web)',
    badge: '1080p FHD',
  },
];

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  selectedColor,
  onChangeColor,
  selectedResolution,
  onChangeResolution,
  onResetFilters,
  activeCount,
  totalResults,
  isDark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState('');
  const [showCustomHexInput, setShowCustomHexInput] = useState(false);

  const hasActiveFilters = selectedColor !== 'all' || selectedResolution !== 'all';

  const handleApplyCustomHex = (e: React.FormEvent) => {
    e.preventDefault();
    let hex = customHexInput.trim();
    if (!hex) return;
    if (!hex.startsWith('#')) hex = `#${hex}`;
    // Valid 3 or 6 char hex
    if (/^#[0-9A-Fa-f]{3,6}$/.test(hex)) {
      onChangeColor(hex);
      setCustomHexInput('');
      setShowCustomHexInput(false);
    }
  };

  const currentColorObj = PEXELS_COLOR_PALETTES.find((c) => c.id === selectedColor);
  const currentResolutionObj = PEXELS_RESOLUTION_RANGES.find((r) => r.id === selectedResolution);

  return (
    <div
      id="advanced-search-filters-container"
      className="w-full rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Top Header & Quick-Toggle Bar */}
      <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-zinc-200 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
            aria-expanded={isOpen}
            aria-controls="advanced-filters-panel"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pexels Advanced Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center ml-0.5">
                {(selectedColor !== 'all' ? 1 : 0) + (selectedResolution !== 'all' ? 1 : 0)}
              </span>
            )}
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {/* Quick inline status badges when collapsed */}
          {!isOpen && hasActiveFilters && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {selectedColor !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: currentColorObj?.hex || selectedColor }}
                  />
                  <span className="capitalize">{currentColorObj?.name || selectedColor}</span>
                  <button
                    onClick={() => onChangeColor('all')}
                    className="hover:text-rose-400 cursor-pointer ml-0.5"
                    title="Remove color filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedResolution !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300">
                  <Maximize2 className="w-3 h-3 text-indigo-400" />
                  <span>{currentResolutionObj?.label}</span>
                  <button
                    onClick={() => onChangeResolution('all')}
                    className="hover:text-rose-400 cursor-pointer ml-0.5"
                    title="Remove resolution filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Action: Parameter indicator + Reset Button */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Reset all advanced filters to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Pexels API Parameters Active</span>
          </div>
        </div>
      </div>

      {/* Expandable Filter Controls Panel */}
      <div
        id="advanced-filters-panel"
        className={`p-4 sm:p-5 space-y-5 transition-all duration-300 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Section 1: Color Palette Filter (Pexels API &color=...) */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Filter by Color Palette</span>
              <span className="text-[11px] text-zinc-400 font-normal font-mono">
                (Pexels API parameter: <code className="text-cyan-300">&color={selectedColor}</code>)
              </span>
            </div>

            {/* Custom Hex Toggle */}
            <button
              type="button"
              onClick={() => setShowCustomHexInput(!showCustomHexInput)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline font-medium cursor-pointer"
            >
              {showCustomHexInput ? 'Close Custom Hex' : '+ Custom Hex Color'}
            </button>
          </div>

          {/* Custom Hex Color Input Form */}
          {showCustomHexInput && (
            <form onSubmit={handleApplyCustomHex} className="flex items-center gap-2 pt-1 pb-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="#06B6D4"
                  value={customHexInput}
                  onChange={(e) => setCustomHexInput(e.target.value)}
                  className="px-3 py-1.5 pl-7 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 w-32"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                  #
                </span>
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Apply Hex
              </button>
            </form>
          )}

          {/* Color Swatch Pills Grid */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {PEXELS_COLOR_PALETTES.map((color) => {
              const isSelected = selectedColor === color.id;
              const isCustom = !PEXELS_COLOR_PALETTES.some((p) => p.id === selectedColor) && color.id === 'all';

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onChangeColor(color.id as PexelsColorPalette)}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 text-white ring-2 ring-cyan-400 shadow-md scale-105 font-semibold'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06]'
                  }`}
                  title={`Filter by ${color.name} (Pexels API &color=${color.id})`}
                >
                  {color.id === 'all' ? (
                    <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-zinc-400'}`} />
                  ) : (
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: color.hex,
                        border: color.border ? `1px solid ${color.border}` : '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-2.5 h-2.5 ${
                            color.id === 'white' || color.id === 'yellow' ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </span>
                  )}
                  <span>{color.name}</span>
                </button>
              );
            })}

            {/* If a custom hex code was entered, display active custom chip */}
            {!PEXELS_COLOR_PALETTES.some((p) => p.id === selectedColor) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: selectedColor }}
                />
                <span>Hex: {selectedColor}</span>
                <button
                  type="button"
                  onClick={() => onChangeColor('all')}
                  className="hover:text-rose-400 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Resolution Range Filter (Pexels API &size=...) */}
        <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <Maximize2 className="w-4 h-4 text-indigo-400" />
              <span>Filter by Resolution Range</span>
              <span className="text-[11px] text-zinc-400 font-normal font-mono">
                (Pexels API parameter: <code className="text-indigo-300">&size={selectedResolution}</code>)
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">Pexels Multi-Megapixel Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PEXELS_RESOLUTION_RANGES.map((res) => {
              const isSelected = selectedResolution === res.id;

              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onChangeResolution(res.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 ring-1 ring-indigo-400 text-white shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] text-zinc-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      {res.label}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/[0.08] text-zinc-300'
                      }`}
                    >
                      {res.badge}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-400 mb-1">{res.spec}</div>
                  <div className="text-[10px] text-zinc-400 leading-tight line-clamp-2">
                    {res.description}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative Footer Bar about Pexels API Query Parameters */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start sm:items-center gap-2.5 text-[11px] text-zinc-400">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <strong>Direct Pexels API Integration:</strong> Color filters pass{' '}
            <code className="text-zinc-300 font-mono">&color={selectedColor}</code> and resolution filters
            pass <code className="text-zinc-300 font-mono">&size={selectedResolution}</code> directly to
            the Pexels REST search endpoint for server-grounded precision.
          </div>
        </div>
      </div>
    </div>
  );
};
