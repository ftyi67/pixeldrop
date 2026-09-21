import React from 'react';
import { ShieldCheck, Lock, Globe, Cookie, Eye, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | PixelDrop - Free 4K & Ultra HD Wallpapers',
  description: 'PixelDrop Privacy Policy: Transparent disclosures regarding Google AdSense, DoubleClick DART cookies, analytics, GDPR compliance, and CCPA consumer rights.',
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            AdSense Publisher & Privacy Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Effective Date: September 14, 2026 • Last Reviewed: September 2026.
            At PixelDrop, your privacy is a paramount priority. This Privacy Policy details the types of information we collect, how we use it, and your legal rights under GDPR, CCPA, and global data privacy standards.
          </p>
        </header>

        {/* Policy Sections */}
        <div className="space-y-8 text-sm sm:text-base text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cookie className="w-5 h-5 text-indigo-400" />
              1. Google AdSense & Third-Party Advertising Partners
            </h2>
            <p>
              PixelDrop partners with third-party advertising networks, including <strong>Google AdSense</strong> and <strong>Adsterra</strong>, to serve advertisements when you browse our wallpaper library. These advertising partners may use cookies, web beacons, and JavaScript to deliver relevant advertisements and assess campaign efficacy.
            </p>
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs sm:text-sm text-zinc-300 space-y-2">
              <p className="font-semibold text-white">Google DoubleClick DART Cookie Notice:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>
                  Google, as a third-party vendor, utilizes cookies to serve ads on PixelDrop based on your previous visits to this site and other websites across the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline hover:text-indigo-300"
                  >
                    Google Ads Settings
                  </a>{' '}
                  or by visiting the Network Advertising Initiative at{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline hover:text-indigo-300"
                  >
                    aboutads.info
                  </a>.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              2. Information We Collect & Log Files
            </h2>
            <p>
              PixelDrop follows standard web hosting practices by maintaining server log files. The data collected by log files includes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs sm:text-sm pl-2">
              <li>Internet Protocol (IP) addresses (anonymized where mandated by law)</li>
              <li>Browser type, device architecture, and operating system</li>
              <li>Internet Service Provider (ISP)</li>
              <li>Date and timestamp of visits</li>
              <li>Referring and exit pages, and click paths</li>
            </ul>
            <p className="text-xs text-zinc-400">
              This information is solely utilized to analyze trends, administer the application, track user navigation across wallpaper collections, and optimize site delivery speed. This data is not linked to any personally identifiable information.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              3. Cookies and Local Storage
            </h2>
            <p>
              We utilize cookies and browser <code className="text-indigo-300 bg-white/[0.06] px-1.5 py-0.5 rounded">localStorage</code> to enhance your browsing experience:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="text-white block mb-1">Essential Storage</strong>
                Stores your theme preference (Dark/Light/System) and your saved wallpaper favorites directly in your browser.
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="text-white block mb-1">Consent Preferences</strong>
                Stores your cookie consent settings and banner dismissal state to respect your privacy choices on repeat visits.
              </div>
            </div>
            <p className="text-xs text-zinc-400 pt-1">
              You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              4. GDPR Privacy Rights (European Economic Area)
            </h2>
            <p>
              Under the EU General Data Protection Regulation (GDPR), users located in the EEA are entitled to key privacy rights:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-zinc-400 pl-2">
              <li><strong>Right to access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>Right to rectification:</strong> You have the right to request correction of inaccurate information.</li>
              <li><strong>Right to erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You have the right to request erasure of your personal data under certain conditions.</li>
              <li><strong>Right to restrict processing:</strong> You have the right to request restrictions on the processing of your data.</li>
              <li><strong>Right to data portability:</strong> You have the right to request the transfer of your data to another organization.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              5. CCPA/CPRA Privacy Rights (Do Not Sell My Information)
            </h2>
            <p>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific statutory rights:
            </p>
            <p className="font-semibold text-emerald-400 text-xs sm:text-sm">
              PixelDrop does NOT sell or rent your personal information to any third parties for monetary consideration.
            </p>
            <p className="text-xs text-zinc-400">
              You have the right to request disclosure of categories of personal information collected, request deletion of personal information, and exercise your rights without experiencing discriminatory treatment. To make a request, please reach out via our contact page.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white">6. Children&apos;s Privacy (COPPA Compliance)</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              PixelDrop does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child provided this kind of information on our website, we strongly encourage you to contact us immediately, and we will promptly remove such information from our records.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white">7. Contact Information & Data Protection Officer</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              If you have additional questions or require more information about our Privacy Policy, please contact our privacy compliance desk:
            </p>
            <div className="pt-2 text-xs sm:text-sm">
              <p className="text-white font-semibold">PixelDrop Privacy Bureau</p>
              <p className="text-indigo-400">Email: privacy@pixeldrop.net</p>
              <p className="text-zinc-500">Address: 100 Innovation Way, Suite 400, San Francisco, CA 94105</p>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <footer className="pt-8 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} PixelDrop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/dmca" className="hover:text-white transition-colors">DMCA Policy</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
