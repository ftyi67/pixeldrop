import React from 'react';
import { FileText, ShieldAlert, CheckCircle, Scale, AlertTriangle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | PixelDrop - Free 4K & Ultra HD Wallpapers',
  description: 'Terms and Conditions governing the use of PixelDrop, personal wallpaper licensing, intellectual property rights, and platform usage.',
};

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400">
            <Scale className="w-4 h-4" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Effective Date: September 14, 2026. Welcome to PixelDrop. By accessing or using our website, services, and digital wallpaper tools, you agree to be bound by these Terms of Service.
          </p>
        </header>

        {/* Terms Sections */}
        <div className="space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              1. Platform Overview & Service Description
            </h2>
            <p>
              PixelDrop provides users with high-resolution digital wallpaper curation, search aggregation, instant multi-device cropping (Desktop 16:9, Mobile 9:16, Tablet 4:3), and CSS gradient generation tools for personal digital customization.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              2. Digital Wallpaper License & Permitted Usage
            </h2>
            <p>
              All wallpapers hosted or indexed through PixelDrop are provided free of charge for <strong>personal, non-commercial desktop and mobile background usage</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-zinc-400 pl-2">
              <li>
                <strong className="text-zinc-200">Permitted:</strong> Applying wallpapers as backgrounds on your personal devices (smartphones, PCs, monitors, tablets, smart TVs).
              </li>
              <li>
                <strong className="text-zinc-200">Permitted:</strong> Using generated CSS gradients for personal and open-source interface projects.
              </li>
              <li>
                <strong className="text-rose-400">Strictly Prohibited:</strong> Selling, licensing, sublicensing, or distributing wallpaper files for monetary gain.
              </li>
              <li>
                <strong className="text-rose-400">Strictly Prohibited:</strong> Minting or tokenizing wallpapers as Non-Fungible Tokens (NFTs) or digital collectibles.
              </li>
              <li>
                <strong className="text-rose-400">Strictly Prohibited:</strong> Packaging wallpapers into commercial wallpaper apps, print-on-demand merchandise, or competing stock services without express authorization from original rights holders.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              3. Intellectual Property Rights & Content Ownership
            </h2>
            <p>
              Photographs, 3D renderings, and illustrations displayed on PixelDrop remain the intellectual property and copyright of their respective authors, photographers, and participating platforms (including Pexels, Wallhaven, Unsplash, and Pixabay).
            </p>
            <p className="text-xs text-zinc-400">
              PixelDrop does not claim ownership over third-party creative content. We provide direct photographer attribution links on every wallpaper preview modal to celebrate and support independent creators.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              4. Prohibited Activities
            </h2>
            <p>
              You agree not to engage in any of the following prohibited behaviors:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-zinc-400 pl-2">
              <li>Using automated scripts, bots, spiders, or scrapers to bulk-download images or exhaust bandwidth.</li>
              <li>Attempting to interfere with server infrastructure or launch denial-of-service (DoS) attacks.</li>
              <li>Bypassing or manipulating our advertising placements, rate limits, or security filters.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white">5. Disclaimer of Warranties & Limitation of Liability</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              The platform and all wallpapers are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, either express or implied. PixelDrop does not warrant that the service will be uninterrupted, error-free, or completely free of harmful components. To the maximum extent permitted by applicable law, PixelDrop disclaims liability for any indirect, incidental, or consequential damages resulting from your use of the website.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white">6. Governing Law & Dispute Resolution</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles. Any dispute arising out of these terms shall be resolved through good-faith negotiation or competent courts located in San Francisco County, California.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white">7. Modifications to Terms</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              We reserve the right to revise or update these Terms of Service at any time. Continued use of PixelDrop after any updates constitutes your acceptance of the revised terms.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <footer className="pt-8 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PixelDrop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/dmca" className="hover:text-white transition-colors">DMCA Policy</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
