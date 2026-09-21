import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Sparkles,
  ChevronRight,
  Share2,
  Check,
  HelpCircle,
  Layers,
  Flame,
  ArrowLeft,
  X,
  ExternalLink,
} from 'lucide-react';
import { SEO_ARTICLES, SEOArticle } from '../data/articles';
import { WallpaperCategory } from '../types';

interface ArticlesViewProps {
  onSelectCategoryFilter?: (category: WallpaperCategory) => void;
  onNavigateToGallery?: () => void;
  isDark?: boolean;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  onSelectCategoryFilter,
  onNavigateToGallery,
  isDark = true,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<SEOArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const categories = ['all', 'Guides 4K', 'OLED & AMOLED', 'Aesthetic & Trends', 'Tech & Setup', 'Résolutions'];

  const filteredArticles = useMemo(() => {
    return SEO_ARTICLES.filter((art) => {
      const matchCat = activeCategory === 'all' || art.category === activeCategory;
      const q = searchFilter.toLowerCase().trim();
      const matchSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.targetKeywords.some((kw) => kw.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchFilter]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/articles/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(slug);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleExploreWallpapers = (catFilter?: string) => {
    if (catFilter && onSelectCategoryFilter) {
      onSelectCategoryFilter(catFilter as WallpaperCategory);
    }
    if (onNavigateToGallery) {
      onNavigateToGallery();
    }
  };

  // If viewing a single full article
  if (selectedArticle) {
    return (
      <article
        id={`article-reader-${selectedArticle.slug}`}
        className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn"
      >
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux Articles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyLink(selectedArticle.slug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/25 transition-all cursor-pointer"
              title="Copier le lien permanent de l'article"
            >
              {copiedId === selectedArticle.slug ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lien Copié !</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager l'article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${selectedArticle.categoryColor}`}
            >
              {selectedArticle.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedArticle.readTime}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Mis à jour le {selectedArticle.updatedAt}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight font-['Space_Grotesk',sans-serif]">
            {selectedArticle.title}
          </h1>

          <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
            {selectedArticle.description}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src={selectedArticle.author.avatar}
              alt={selectedArticle.author.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
              loading="lazy"
            />
            <div>
              <div className="text-xs font-bold text-white">{selectedArticle.author.name}</div>
              <div className="text-[11px] text-zinc-400">{selectedArticle.author.role}</div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
          <img
            src={selectedArticle.coverImage}
            alt={selectedArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>PixelDrop Editorial • 4K Display Labs</span>
            <span className="bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
              Ultra HD 3840×2160 Native
            </span>
          </div>
        </div>

        {/* Quick Table of Contents */}
        <nav
          aria-label="Table des matières"
          className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Table des matières du guide</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {selectedArticle.sections.map((sec, idx) => (
              <li key={sec.id} className="hover:text-white transition-colors">
                <a href={`#${sec.id}`} className="flex items-center gap-2 py-0.5">
                  <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{sec.heading}</span>
                </a>
              </li>
            ))}
            {selectedArticle.faqs.length > 0 && (
              <li className="hover:text-white transition-colors">
                <a href="#questions-frequentes" className="flex items-center gap-2 py-0.5">
                  <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Foire aux questions (FAQ)</span>
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* Article Body Sections */}
        <div className="space-y-8 text-zinc-300 leading-relaxed">
          {selectedArticle.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-3.5 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
                {section.heading}
              </h2>

              <div className="space-y-2.5 text-sm sm:text-base text-zinc-300">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {section.callout && (
                <div
                  className={`p-4 rounded-xl border space-y-1 text-xs sm:text-sm ${
                    section.callout.type === 'tip'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : section.callout.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{section.callout.title}</span>
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                    {section.callout.text}
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* Interactive FAQ Section with Schema FAQPage Accordion */}
          {selectedArticle.faqs.length > 0 && (
            <section id="questions-frequentes" className="space-y-4 pt-4 border-t border-white/[0.08] scroll-mt-24">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-white">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3>Foire aux questions (FAQ)</h3>
              </div>

              <div className="space-y-2.5">
                {selectedArticle.faqs.map((faq, fIdx) => {
                  const isExpanded = expandedFaqIndex === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="rounded-xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : fIdx)}
                        className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                            isExpanded ? 'rotate-90 text-cyan-400' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="px-3.5 pb-4 sm:px-4 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.04] pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Call-to-Action to Browse Matching Wallpapers */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-zinc-900 border border-indigo-500/30 text-center space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Prêt à sublimer votre écran avec ces conseils ?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
              Accédez à notre catalogue de milliers de fonds d'écran 4K Ultra HD gratuits, prêts à être
              téléchargés sans filigrane ni perte de compression.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleExploreWallpapers(selectedArticle.recommendedCategoryFilter)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Découvrir les fonds d'écran liés</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedArticle(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs sm:text-sm text-zinc-300 hover:text-white font-medium transition-all cursor-pointer"
              >
                Voir les autres articles
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Articles Directory / Catalog Hub
  return (
    <div id="articles-hub-container" className="w-full space-y-6">
      {/* Editorial Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-black/80 border border-white/[0.08] backdrop-blur-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PixelDrop Editorial • Guides & SEO Knowledge Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
            Articles, Guides d'Experts & Conseils 4K
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Consultez nos articles complets sur les meilleures résolutions, l'optimisation des écrans OLED
            pour économiser la batterie, et les astuces d'installation sans compression sur Windows 11, Mac,
            iOS et Android.
          </p>

          {/* Internal Quick Search Bar */}
          <div className="pt-2 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un guide (ex: AMOLED, 4K, Windows 11, Aesthetic)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3.5 py-2 pl-10 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-zinc-400 hidden sm:inline-block font-mono">
              {filteredArticles.length} guides rédigés
            </span>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat === 'all' ? 'Tous les Guides' : cat}
            </button>
          );
        })}
      </div>

      {/* Articles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => {
              setSelectedArticle(article);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group rounded-2xl bg-zinc-900/60 border border-white/[0.08] hover:border-cyan-400/40 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* Cover Image */}
            <div className="relative w-full h-44 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${article.categoryColor}`}
                >
                  {article.category}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  <span>{article.publishedAt}</span>
                </div>

                <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h2>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Tags & Read Action */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>

                <span className="text-[10px] text-zinc-500 font-mono">
                  {article.sections.length} sections
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <BookOpen className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm text-zinc-400">Aucun guide ne correspond à votre recherche.</p>
          <button
            type="button"
            onClick={() => {
              setSearchFilter('');
              setActiveCategory('all');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
