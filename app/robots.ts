// Next.js App Router dynamic Robots route
export type RobotsConfig = {
  rules: {
    userAgent?: string | string[];
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
  };
  sitemap?: string | string[];
  host?: string;
};

export default function robots(): RobotsConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeldrop.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
