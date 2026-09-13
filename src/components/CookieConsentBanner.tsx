import React, { useState, useEffect } from 'react';
import { Shield, Settings, Check, X, ExternalLink } from 'lucide-react';
import { ConsentSettings } from '../types';

interface CookieConsentBannerProps {
  onOpenPrivacyModal: () => void;
}

const STORAGE_KEY = 'wallcraft_cookie_consent_v2';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>({
    hasConsented: false,
    necessary: true,
    analytics: true,
    marketing: true,
    doNotSellCCPA: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConsent(parsed);
        setIsVisible(false);
      } else {
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (updated: ConsentSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...updated, timestamp: Date.now() }));
    } catch {
      // Storage fallback
    }
    setConsent(updated);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      hasConsented: true,
      necessary: true,
      analytics: true,
      marketing: true,
      doNotSellCCPA: false,
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      hasConsented: true,
      necessary: true,
      analytics: false,
      marketing: false,
      doNotSellCCPA: true,
    });
  };

  const handleSavePreferences = () => {
    saveConsent({
      ...consent,
      hasConsented: true,
    });
  };

  if (!isVisible) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 lg:left-auto lg:right-8 lg:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl shadow-2xl text-zinc-100 relative">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Privacy & AdSense Consent
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-indigo-300 border border-indigo-500/30 font-bold">
                  GDPR & CCPA
                </span>
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
              We and our advertising partners (including Google AdSense) utilize cookies and device identifiers to personalize wallpaper downloads, analyze traffic, and display relevant, non-intrusive advertisements. You can customize your preferences or opt out at any time.
            </p>

            {/* Expandable Preferences */}
            {showPreferences && (
              <div className="mt-3.5 pt-3.5 border-t border-white/[0.08] space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="font-semibold text-white">Strictly Necessary</span>
                    <p className="text-[11px] text-zinc-400">Essential for wallpaper resizing, theme saving, and secure utility access.</p>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-400 uppercase font-bold">Active</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="font-semibold text-white">Google AdSense & Marketing</span>
                    <p className="text-[11px] text-zinc-400">Enables relevant contextual ads supporting free wallpaper hosting.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <span className="font-semibold text-white">CCPA: Do Not Sell My Information</span>
                    <p className="text-[11px] text-zinc-400">California Consumer Privacy Act opt-out preference.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.doNotSellCCPA}
                      onChange={(e) => setConsent({ ...consent, doNotSellCCPA: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{showPreferences ? 'Hide Options' : 'Customize'}</span>
                </button>
                <span className="text-zinc-600">•</span>
                <button
                  onClick={onOpenPrivacyModal}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Policy</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {showPreferences ? (
                  <button
                    onClick={handleSavePreferences}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Save My Choices
                  </button>
                ) : (
                  <button
                    onClick={handleRejectNonEssential}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium border border-white/[0.08] transition-all cursor-pointer"
                  >
                    Decline Optional
                  </button>
                )}

                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
