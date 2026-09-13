import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  Smartphone,
  Monitor,
  Maximize,
  Sliders,
} from 'lucide-react';
import { AdSensePlaceholder } from './AdSensePlaceholder';

interface GradientGeneratorProps {
  onOpenPrivacyModal?: () => void;
}

const PRESET_PALETTES = [
  { name: 'Cosmic Nebula', colors: ['#0f0c29', '#302b63', '#24243e'] },
  { name: 'Cyberpunk Neon', colors: ['#ff007f', '#7928ca', '#00dfd8'] },
  { name: 'Dark AMOLED Aurora', colors: ['#09090e', '#132238', '#00f2fe'] },
  { name: 'Warm Sunset Glow', colors: ['#ff512f', '#dd2476', '#f09819'] },
  { name: 'Minimalist Titanium', colors: ['#141416', '#28282e', '#454552'] },
  { name: 'Deep Sea Emerald', colors: ['#051923', '#003554', '#00a6fb'] },
  { name: 'Velvet Plum', colors: ['#200122', '#6f0000'] },
  { name: 'Warm Cream & Caramel', colors: ['#fdfaf5', '#e8dac5', '#966336'] },
];

export const GradientGenerator: React.FC<GradientGeneratorProps> = ({
  onOpenPrivacyModal,
}) => {
  const [color1, setColor1] = useState('#0f0c29');
  const [color2, setColor2] = useState('#302b63');
  const [color3, setColor3] = useState('#24243e');
  const [useThreeColors, setUseThreeColors] = useState(true);
  const [angle, setAngle] = useState(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);

  const getGradientCSS = () => {
    if (gradientType === 'radial') {
      return useThreeColors
        ? `radial-gradient(circle at center, ${color1} 0%, ${color2} 55%, ${color3} 100%)`
        : `radial-gradient(circle at center, ${color1} 0%, ${color2} 100%)`;
    }
    return useThreeColors
      ? `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
      : `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
  };

  const cssRule = `background: ${getGradientCSS()};`;

  const copyCSS = () => {
    navigator.clipboard.writeText(cssRule);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const handleRandomize = () => {
    const randomPreset = PRESET_PALETTES[Math.floor(Math.random() * PRESET_PALETTES.length)];
    setColor1(randomPreset.colors[0]);
    setColor2(randomPreset.colors[1]);
    if (randomPreset.colors[2]) {
      setColor3(randomPreset.colors[2]);
      setUseThreeColors(true);
    } else {
      setUseThreeColors(false);
    }
    setAngle(Math.floor(Math.random() * 360));
  };

  const exportCanvasImage = (width: number, height: number, label: string) => {
    setIsExporting(true);
    setExportMessage(`Generating ${width}x${height} PNG...`);
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (gradientType === 'radial') {
          const cx = width / 2;
          const cy = height / 2;
          const r = Math.max(width, height) / 2;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, color1);
          if (useThreeColors) {
            grad.addColorStop(0.5, color2);
            grad.addColorStop(1, color3);
          } else {
            grad.addColorStop(1, color2);
          }
          ctx.fillStyle = grad;
        } else {
          const rad = (angle * Math.PI) / 180;
          const cx = width / 2;
          const cy = height / 2;
          const length = Math.sqrt(width * width + height * height) / 2;

          const x0 = cx - Math.cos(rad) * length;
          const y0 = cy - Math.sin(rad) * length;
          const x1 = cx + Math.cos(rad) * length;
          const y1 = cy + Math.sin(rad) * length;

          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          grad.addColorStop(0, color1);
          if (useThreeColors) {
            grad.addColorStop(0.5, color2);
            grad.addColorStop(1, color3);
          } else {
            grad.addColorStop(1, color2);
          }
          ctx.fillStyle = grad;
        }

        ctx.fillRect(0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PixelDrop-gradient-${label}-${width}x${height}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1500);
          }
          setIsExporting(false);
          setExportMessage('');
        }, 'image/png');
      } catch (err) {
        console.error('Gradient export error:', err);
        setIsExporting(false);
        setExportMessage('');
      }
    }, 150);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Introduction in Glassmorphism Aesthetic */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              Pure Canvas Utility
            </span>
            <span className="text-xs text-zinc-400">Zero-Loss PNG Resolution</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
            PixelDrop CSS Gradient Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Craft custom OLED dark, cyberpunk, AMOLED, or atmospheric gradients. Export instant CSS snippets or download high-precision 4K PNGs for Desktop & Mobile.
          </p>
        </div>

        <button
          onClick={handleRandomize}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Randomize Palette</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Live Visual Preview Stage */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div
            ref={previewRef}
            className="w-full aspect-[16/10] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300 flex items-center justify-center"
            style={{ background: getGradientCSS() }}
          >
            {/* Live Watermark Badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono select-none border border-white/10">
              {gradientType === 'linear' ? `${angle}° Linear` : 'Radial Orb'}
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Trending Aesthetic Palettes:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PALETTES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setColor1(preset.colors[0]);
                    setColor2(preset.colors[1]);
                    if (preset.colors[2]) {
                      setColor3(preset.colors[2]);
                      setUseThreeColors(true);
                    } else {
                      setUseThreeColors(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                    }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AdSense In-Studio Banner */}
          <AdSensePlaceholder
            format="modal-banner"
            slotId="gradient-studio-bottom"
            onLearnMore={onOpenPrivacyModal}
          />
        </div>

        {/* Right Col: Controls, CSS Code & Download */}
        <div className="lg:col-span-5 space-y-4">
          {/* Controls Panel */}
          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Gradient Parameters
              </h3>
              {exportMessage && (
                <span className="text-xs text-indigo-400 font-mono animate-pulse">
                  {exportMessage}
                </span>
              )}
            </div>

            {/* Gradient Type Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGradientType('linear')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  gradientType === 'linear'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                Linear Flow
              </button>
              <button
                onClick={() => setGradientType('radial')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  gradientType === 'radial'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                Radial Glow
              </button>
            </div>

            {/* Color Pickers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Color Stops</span>
                <button
                  onClick={() => setUseThreeColors(!useThreeColors)}
                  className="text-xs text-indigo-400 font-medium hover:underline cursor-pointer"
                >
                  {useThreeColors ? 'Switch to 2 Colors' : 'Add 3rd Color Stop'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <span className="text-[10px] text-zinc-400 block mb-1">Color 1 (Start)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs font-mono font-medium text-zinc-200">{color1}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <span className="text-[10px] text-zinc-400 block mb-1">Color 2 (Mid/End)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-xs font-mono font-medium text-zinc-200">{color2}</span>
                  </div>
                </div>

                {useThreeColors && (
                  <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-[10px] text-zinc-400 block mb-1">Color 3 (End)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color3}
                        onChange={(e) => setColor3(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer border-none bg-transparent"
                      />
                      <span className="text-xs font-mono font-medium text-zinc-200">{color3}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Angle Slider (if Linear) */}
            {gradientType === 'linear' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Rotation Angle</span>
                  <span className="font-mono text-indigo-400 font-bold">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            )}

            {/* CSS Output snippet */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">CSS Code:</span>
                <button
                  onClick={copyCSS}
                  className="text-xs text-indigo-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {copiedCSS ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCSS ? 'Copied CSS!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-2xl bg-black/40 border border-white/[0.08] font-mono text-[11px] text-indigo-300 overflow-x-auto">
                {cssRule}
              </pre>
            </div>

            {/* High-Resolution Canvas PNG Download */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-semibold text-zinc-300 block">
                Export High-Resolution Canvas PNG:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => exportCanvasImage(1920, 1080, 'desktop')}
                  disabled={isExporting}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] hover:border-indigo-500/40 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Monitor className="w-4 h-4 text-indigo-400" />
                  <span>Desktop</span>
                  <span className="text-[10px] text-zinc-400 font-mono">1920×1080</span>
                </button>

                <button
                  onClick={() => exportCanvasImage(1080, 1920, 'mobile')}
                  disabled={isExporting}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] hover:border-purple-500/40 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Mobile</span>
                  <span className="text-[10px] text-zinc-400 font-mono">1080×1920</span>
                </button>

                <button
                  onClick={() => exportCanvasImage(3840, 2160, '4k')}
                  disabled={isExporting}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] hover:border-pink-500/40 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Maximize className="w-4 h-4 text-pink-400" />
                  <span>4K UHD</span>
                  <span className="text-[10px] text-zinc-400 font-mono">3840×2160</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
