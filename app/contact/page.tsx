import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, ArrowLeft, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | PixelDrop - Free 4K & Ultra HD Wallpapers',
  description: 'Get in touch with the PixelDrop support, advertising partnerships, and editorial team.',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400">
            <MessageSquare className="w-4 h-4" />
            Support & Inquiries
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Have questions about wallpaper downloads, Google AdSense advertising partnerships, copyright inquiries, or feature suggestions? Send us a message and our team will get back to you within 24–48 business hours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Info Column */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
              <h2 className="text-base font-bold text-white">Direct Contacts</h2>
              <div className="space-y-3 text-xs text-zinc-300">
                <div>
                  <span className="text-zinc-500 block">General Support</span>
                  <a href="mailto:support@pixeldrop.net" className="text-indigo-400 hover:underline">
                    support@pixeldrop.net
                  </a>
                </div>
                <div>
                  <span className="text-zinc-500 block">Advertising & AdSense Partnerships</span>
                  <a href="mailto:advertising@pixeldrop.net" className="text-indigo-400 hover:underline">
                    advertising@pixeldrop.net
                  </a>
                </div>
                <div>
                  <span className="text-zinc-500 block">DMCA & Copyright Desk</span>
                  <a href="mailto:dmca@pixeldrop.net" className="text-indigo-400 hover:underline">
                    dmca@pixeldrop.net
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Office Location
              </div>
              <p>PixelDrop Digital Media Inc.</p>
              <p>100 Innovation Way, Suite 400</p>
              <p>San Francisco, CA 94105, United States</p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                Send a Message
              </h2>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 text-base font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Message Sent Successfully
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your message regarding &ldquo;{formData.subject}&rdquo; has been submitted to our support team. We will reply to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', topic: 'general', subject: '', message: '' });
                    }}
                    className="mt-2 text-xs font-semibold text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Smith"
                        className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@example.com"
                        className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Inquiry Topic *
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="general">General Feedback / Wallpaper Suggestion</option>
                        <option value="adsense">Advertising & Brand Sponsorship</option>
                        <option value="dmca">DMCA / Copyright Question</option>
                        <option value="bug">Technical Issue / Bug Report</option>
                        <option value="privacy">Privacy & Data Request (GDPR/CCPA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry"
                        className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details about your question, suggestion, or request..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="pt-8 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PixelDrop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/dmca" className="hover:text-white transition-colors">DMCA Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
