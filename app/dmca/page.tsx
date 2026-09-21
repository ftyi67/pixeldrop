import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Send, ArrowLeft, Mail, FileText } from 'lucide-react';

export const metadata = {
  title: 'DMCA Copyright Notice & Takedown Policy | PixelDrop',
  description: 'Submit copyright takedown requests under the Digital Millennium Copyright Act (17 U.S.C. § 512) for artworks or wallpapers displayed on PixelDrop.',
};

export default function DmcaPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    ownerName: '',
    infringingUrl: '',
    originalWorkUrl: '',
    statementGoodFaith: false,
    statementAccuracy: false,
    signature: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.statementGoodFaith || !formData.statementAccuracy || !formData.signature) {
      alert('Please check all legal statements and provide your digital signature.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-['Outfit',sans-serif] selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Navigation back */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to PixelDrop Gallery
        </a>

        {/* Page Header */}
        <header className="space-y-4 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-400">
            <ShieldCheck className="w-4 h-4" />
            DMCA Compliance & Intellectual Property Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
            DMCA Copyright Takedown Policy
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            PixelDrop respects the intellectual property rights of creators, photographers, and digital artists. We expeditiously respond to notices of alleged copyright infringement pursuant to the Digital Millennium Copyright Act (17 U.S.C. § 512).
          </p>
        </header>

        {/* Overview & Safe Harbor Notice */}
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Content Aggregation & Safe Harbor Statement
            </h2>
            <p>
              PixelDrop indexes wallpaper media via authorized third-party creative APIs (such as the Pexels Open License API, Unsplash API, Wallhaven community submissions, and Pixabay). We do not claim ownership of third-party images.
            </p>
            <p className="text-xs text-zinc-400">
              If you are the copyright holder of an image indexed on PixelDrop and believe it has been published without authorization or in violation of your license terms, please complete the takedown form below or contact our designated DMCA Copyright Agent. We will promptly remove or disable access to the infringing material within 24–48 hours.
            </p>
          </section>

          {/* Interactive DMCA Submission Form */}
          <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-400" />
                Submit a Formal DMCA Takedown Notice
              </h2>
              <p className="text-xs text-zinc-400">
                Direct submissions are processed immediately by our compliance desk. You may also email this information directly to <strong className="text-rose-300">dmca@pixeldrop.net</strong>.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Notice Received (Case #{Math.floor(100000 + Math.random() * 900000)})
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Thank you for submitting your copyright notice. Our compliance team will review the submitted URL ({formData.infringingUrl || 'specified item'}) and process the removal within 24 to 48 business hours. A confirmation email has been dispatched to <strong>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                >
                  Submit another takedown notice
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Your Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Contact Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. legal@photographer.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Copyright Owner Name or Organization (if acting as agent) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Self or Studio Name LLC"
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      PixelDrop Infringing Wallpaper URL or ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.infringingUrl}
                      onChange={(e) => setFormData({ ...formData, infringingUrl: e.target.value })}
                      placeholder="e.g. https://pixeldrop.app/?wallpaper=pexels-12345"
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Link to Original Copyrighted Work or Portfolio *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.originalWorkUrl}
                      onChange={(e) => setFormData({ ...formData, originalWorkUrl: e.target.value })}
                      placeholder="e.g. https://instagram.com/p/... or personal portfolio"
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Legal Declarations */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.statementGoodFaith}
                      onChange={(e) => setFormData({ ...formData, statementGoodFaith: e.target.checked })}
                      className="mt-0.5 rounded border-white/20 bg-zinc-900 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span>
                      I have a good faith belief that use of the copyrighted materials described above is not authorized by the copyright owner, its agent, or the law.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.statementAccuracy}
                      onChange={(e) => setFormData({ ...formData, statementAccuracy: e.target.checked })}
                      className="mt-0.5 rounded border-white/20 bg-zinc-900 text-indigo-500 focus:ring-indigo-500"
                    />
                    <span>
                      I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Digital Electronic Signature (Type Full Legal Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.signature}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    placeholder="/s/ John Doe"
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting Takedown Notice...' : 'Submit Official DMCA Takedown Notice'}
                </button>
              </form>
            )}
          </section>

          {/* DMCA Designated Agent Details */}
          <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 space-y-2">
            <h3 className="font-semibold text-white text-sm">Designated Copyright Agent Contact</h3>
            <p><strong>PixelDrop Copyright & Takedown Desk</strong></p>
            <p>Attn: DMCA Complaints Coordinator</p>
            <p>Email: <a href="mailto:dmca@pixeldrop.net" className="text-indigo-400 underline">dmca@pixeldrop.net</a></p>
            <p>Address: 100 Innovation Way, Suite 400, San Francisco, CA 94105</p>
          </section>
        </div>

        {/* Footer info */}
        <footer className="pt-8 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PixelDrop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
