import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Scale,
  Mail,
  Cookie,
  Eye,
  Lock,
  Globe,
  CheckCircle2,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { LegalTab } from './Footer';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Synchronize initialTab if it changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // DMCA Form state
  const [dmcaForm, setDmcaForm] = useState({
    name: '',
    email: '',
    owner: '',
    infringingUrl: '',
    originalUrl: '',
    goodFaith: false,
    perjury: false,
    signature: '',
  });
  const [dmcaSubmitted, setDmcaSubmitted] = useState(false);

  // Contact Form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="legal-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="legal-modal-container"
        className="w-full max-w-4xl my-6 bg-zinc-950/95 border border-white/10 rounded-3xl shadow-2xl text-zinc-100 relative max-h-[92vh] flex flex-col backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Legal & Privacy Center
              </h2>
              <p className="text-xs text-zinc-400">
                Google AdSense Publisher Disclosures, Terms of Service & DMCA Compliance
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

        {/* Legal Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto shrink-0 bg-zinc-900/40">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('dmca')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dmca'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            DMCA Takedown Policy
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact & Inquiries
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-indigo-400" />
                  Google AdSense & DoubleClick DART Cookies
                </h3>
                <p>
                  PixelDrop uses Google AdSense and trusted third-party advertising partners (including Adsterra) to serve ads when you visit our website. These partners may use cookies and web beacons to serve advertisements based on your prior visits to PixelDrop and other websites across the Internet.
                </p>
                <p className="text-zinc-400">
                  You may opt out of personalized advertising at any time by visiting{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    Google Ads Settings <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  or by managing preferences at{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    aboutads.info <ExternalLink className="w-3 h-3" />
                  </a>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Cookies & Local Storage Usage
                </h3>
                <p>
                  PixelDrop utilizes browser local storage to save your UI preferences (dark/light theme, saved favorite wallpapers, and cookie consent choices). We do not track or profile personal identities.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  GDPR & CCPA Consumer Rights
                </h3>
                <p>
                  Residents of the EEA and California possess statutory rights regarding access, deletion, and restriction of personal data. PixelDrop does NOT sell personal information to third parties.
                </p>
              </div>

              <div className="text-[11px] text-zinc-500 pt-2 border-t border-white/[0.06]">
                Direct privacy inquiries to <strong className="text-zinc-300">privacy@pixeldrop.net</strong>. Full documentation is available on our dedicated privacy page.
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  Digital Wallpaper Personal Use License
                </h3>
                <p>
                  PixelDrop grants you a revocable, non-exclusive license to download and apply wallpapers from our collections for personal, non-commercial screen backgrounds on smartphones, computers, and tablets.
                </p>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs">
                  <strong>Restrictions:</strong> You may not repackage, sublicense, resell, or distribute raw wallpaper files in commercial databases, print products, or NFT marketplaces.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h3 className="text-sm font-bold text-white">Photographer & Creator Rights</h3>
                <p>
                  All photography and digital artwork remain the property of their respective creators. Attribution links to authors are provided on every wallpaper detail page.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DMCA TAKEDOWN POLICY & FORM */}
          {activeTab === 'dmca' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  DMCA Compliance Statement
                </h3>
                <p>
                  PixelDrop respects intellectual property and complies with 17 U.S.C. § 512. If you believe your copyrighted work has been improperly indexed or displayed, please submit the notification below.
                </p>
              </div>

              {dmcaSubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Takedown Request Submitted
                  </div>
                  <p className="text-xs">
                    Our copyright agent has received your request. We will review the provided URL and take appropriate action within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setDmcaSubmitted(false)}
                    className="text-xs text-emerald-400 underline cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!dmcaForm.goodFaith || !dmcaForm.perjury || !dmcaForm.signature) {
                      alert('Please complete all checkboxes and sign the form.');
                      return;
                    }
                    setDmcaSubmitted(true);
                  }}
                  className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Interactive Takedown Notice Form
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Legal Name"
                      value={dmcaForm.name}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Contact Email"
                      value={dmcaForm.email}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, email: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="PixelDrop Infringing Wallpaper URL or ID"
                    value={dmcaForm.infringingUrl}
                    onChange={(e) => setDmcaForm({ ...dmcaForm, infringingUrl: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="url"
                    required
                    placeholder="Original Work URL or Proof of Copyright"
                    value={dmcaForm.originalUrl}
                    onChange={(e) => setDmcaForm({ ...dmcaForm, originalUrl: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="space-y-2 text-xs text-zinc-400">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={dmcaForm.goodFaith}
                        onChange={(e) => setDmcaForm({ ...dmcaForm, goodFaith: e.target.checked })}
                        className="mt-0.5"
                      />
                      <span>I have a good faith belief that the use is unauthorized.</span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={dmcaForm.perjury}
                        onChange={(e) => setDmcaForm({ ...dmcaForm, perjury: e.target.checked })}
                        className="mt-0.5"
                      />
                      <span>I swear under penalty of perjury that this information is accurate.</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Type Full Name as Electronic Signature"
                    value={dmcaForm.signature}
                    onChange={(e) => setDmcaForm({ ...dmcaForm, signature: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit DMCA Takedown Notice
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Contact PixelDrop Support
                </h3>
                <p>
                  For advertising inquiries, Google AdSense questions, wallpaper feedback, or general support, please use the form below or email <strong className="text-cyan-300">support@pixeldrop.net</strong>.
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Message Sent
                  </div>
                  <p className="text-xs">
                    Thank you! Your message has been sent to our team. We typically respond within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', email: '', topic: 'general', message: '' });
                    }}
                    className="text-xs text-emerald-400 underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={contactForm.topic}
                    onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="general">General Inquiry / Suggestion</option>
                    <option value="advertising">Advertising & Partnerships</option>
                    <option value="dmca">DMCA / Copyright</option>
                    <option value="bug">Report an Issue</option>
                  </select>
                  <textarea
                    required
                    rows={4}
                    placeholder="Your message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 shrink-0 bg-zinc-950">
          <span>PixelDrop Legal & Publisher Desk</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
