// Next.js App Router dynamic XML Sitemap route
// Dynamically generates sitemap entries for the home page, gradient tool, and top 20 trending queries to optimize search engine indexing.

export type SitemapItem = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

// Top 20 trending category search queries targeted for high-velocity SEO indexing (FR + EN)
export const TOP_20_TRENDING_SEARCH_QUERIES = [
  { slug: 'cyberpunk', query: 'cyberpunk', priority: 0.95 },
  { slug: 'nature', query: 'nature', priority: 0.95 },
  { slug: 'minimalist', query: 'minimalist', priority: 0.95 },
  { slug: 'anime', query: 'anime', priority: 0.92 },
  { slug: 'amoled', query: 'amoled', priority: 0.92 },
  { slug: 'cars', query: 'cars', priority: 0.92 },
  { slug: 'dark', query: 'dark', priority: 0.90 },
  { slug: 'space', query: 'space', priority: 0.90 },
  { slug: 'city', query: 'city', priority: 0.90 },
  { slug: 'tech', query: 'tech', priority: 0.88 },
  { slug: 'abstract', query: 'abstract', priority: 0.88 },
  { slug: 'fond-decran-4k', query: 'fond decran 4k', priority: 0.95 },
  { slug: 'mountains', query: 'mountains', priority: 0.85 },
  { slug: 'ocean', query: 'ocean', priority: 0.85 },
  { slug: 'gaming', query: 'gaming setup', priority: 0.85 },
  { slug: 'neon-tokyo', query: 'tokyo neon', priority: 0.85 },
  { slug: 'sunset', query: 'sunset', priority: 0.85 },
  { slug: 'forest', query: 'forest', priority: 0.82 },
  { slug: 'retrowave', query: 'retrowave', priority: 0.82 },
  { slug: 'supercars', query: 'supercars', priority: 0.82 },
];

export default function sitemap(): SitemapItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeldrop.app';
  const currentDate = new Date().toISOString();

  // Dynamic routes for the top 20 trending category search queries
  const trendingCategoryRoutes: SitemapItem[] = TOP_20_TRENDING_SEARCH_QUERIES.map((item) => ({
    url: `${baseUrl}/?category=${encodeURIComponent(item.slug)}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: item.priority,
  }));

  return [
    // 1. Home Page (Highest indexing priority)
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    // 2. CSS Gradient Studio Tool
    {
      url: `${baseUrl}/gradient`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.90,
    },
    // Privacy, GDPR & AdSense Compliance
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.50,
    },
    // 3. Top 20 Trending Category Search Queries
    ...trendingCategoryRoutes,
  ];
}
