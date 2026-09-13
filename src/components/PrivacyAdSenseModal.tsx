import React from 'react';
import { X, ShieldCheck, Lock, Globe, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrivacyAdSenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyAdSenseModal: React.FC<PrivacyAdSenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-adsense-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="privacy-adsense-modal-container"
        className="w-full max-w-3xl my-8 bg-zinc-950/90 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 relative max-h-[90vh] overflow-y-auto backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Privacy Policy & Google AdSense Compliance
              </h2>
              <p className="text-xs text-zinc-400">
                Transparent data usage, GDPR, CCPA, and DoubleClick DART cookie disclosures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {/* Section 1: AdSense & DART Cookies */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              1. Google AdSense & DoubleClick DART Cookie Policy
            </h3>
            <p className="text-xs text-zinc-300 mb-2">
              WallCraft uses Google AdSense to serve advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on WallCraft.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 pl-1">
              <li>
                Google&apos;s use of the <strong className="text-zinc-200">DART cookie</strong> enables it to serve ads to users based on their visit to our sites and other sites on the Internet.
              </li>
              <li>
                Users may opt out of the use of the DART cookie by visiting the{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  Google Ad and Content Network privacy policy
                </a>.
              </li>
              <li>
                Third-party ad servers or ad networks use technology that sends advertisements directly to your browser. They automatically receive your IP address when this occurs.
              </li>
            </ul>
          </div>

          {/* Section 2: GDPR European Economic Area (EEA) Rights */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              2. GDPR Compliance (General Data Protection Regulation)
            </h3>
            <p className="text-xs text-zinc-300 mb-2">
              If you are a resident of the European Economic Area (EEA), you have data protection rights under the EU General Data Protection Regulation. WallCraft guarantees:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Explicit consent prior to personalized cookies</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Right to access & download saved preferences</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Right to erase stored browser cache</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero selling of personal telemetry records</span>
              </div>
            </div>
          </div>

          {/* Section 3: California Consumer Privacy Act (CCPA) */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-400" />
              3. CCPA: Do Not Sell My Personal Information
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Under the California Consumer Privacy Act (CCPA), California residents have the right to request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data. <strong>WallCraft does not sell any personal information to third parties.</strong>
            </p>
          </div>

          {/* Section 4: Public APIs Attribution (Pexels & Waifu.pics) */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              4. Media License & API Disclosures
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              All wallpapers served through WallCraft are sourced via the official Pexels Free API and community repositories. Content is licensed for non-commercial personal customization and digital display setups. All photographers and creators maintain their copyright and attribution links.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Last updated: September 2026 • WallCraft Compliance Bureau
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
