/**
 * Vercel Serverless Function: Dual-Source Wallpaper Proxy
 * Route: /api/wallpapers
 * 
 * Supports:
 * - Wallhaven API: Anime, Fantasy, Cyberpunk, Digital illustrations (Forced SFW purity=100)
 * - Pexels API: Realistic photography, architecture, landscape, and general curated 4K views
 * 
 * Normalized Structure:
 * {
 *   id: string;
 *   url: string;        // High-res download link
 *   thumbnail: string;  // Preview image
 *   source: 'pexels' | 'wallhaven';
 * }
 */

interface VercelReq {
  method?: string;
  url?: string;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string | string[]>;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (data: unknown) => VercelRes;
  setHeader: (name: string, value: string) => VercelRes;
  end: () => void;
}

export interface UnifiedWallpaperResponseItem {
  id: string;
  url: string;
  thumbnail: string;
  source: 'pexels' | 'wallhaven';
  title: string;
  authorName: string;
  authorProfile?: string;
  width: number;
  height: number;
  category: string;
  orientation: 'landscape' | 'portrait' | 'square';
  src?: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

function shouldUseWallhaven(query: string, category: string): boolean {
  const q = (query || '').toLowerCase().trim();
  const c = (category || '').toLowerCase().trim();

  const wallhavenKeywords = [
    'anime',
    'fantasy',
    'cyberpunk',
    'digital art',
    'illustration',
    'manga',
    'comic',
    'art',
    'scifi',
    'sci-fi',
    'synthwave',
    'gaming',
    'game',
    'waifu',
    'genshin',
    'concept art',
    'pixel art',
  ];

  return (
    c === 'anime' ||
    c === 'fantasy' ||
    c === 'cyberpunk' ||
    wallhavenKeywords.some((kw) => q.includes(kw) || c.includes(kw))
  );
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let queryParam = '';
    let categoryParam = '';
    let pageParam = '1';
    let perPageParam = '40';

    if (req.query) {
      queryParam = (req.query.query as string)?.trim() || '';
      categoryParam = (req.query.category as string)?.trim() || '';
      pageParam = (req.query.page as string) || '1';
      perPageParam = (req.query.per_page as string) || (req.query.perPage as string) || '40';
    } else if (req.url) {
      const parsedUrl = new URL(req.url, 'http://localhost');
      queryParam = parsedUrl.searchParams.get('query')?.trim() || '';
      categoryParam = parsedUrl.searchParams.get('category')?.trim() || '';
      pageParam = parsedUrl.searchParams.get('page') || '1';
      perPageParam =
        parsedUrl.searchParams.get('per_page') ||
        parsedUrl.searchParams.get('perPage') ||
        '40';
    }

    const isWallhaven = shouldUseWallhaven(queryParam, categoryParam);

    // =========================================================================
    // 1. WALLHAVEN API ROUTE
    // =========================================================================
    if (isWallhaven) {
      const wallhavenQuery = queryParam || categoryParam || 'anime';
      const wallhavenApiKey = process.env.WALLHAVEN_API_KEY?.trim() || '';
      const apiKeyParam = wallhavenApiKey ? `apikey=${encodeURIComponent(wallhavenApiKey)}&` : '';
      const wallhavenUrl = `https://wallhaven.cc/api/v1/search?${apiKeyParam}q=${encodeURIComponent(
        wallhavenQuery
      )}&purity=100&sorting=random&page=${encodeURIComponent(pageParam)}`;

      console.log(`[Vercel Serverless /api/wallpapers] Routing to Wallhaven:`, {
        query: wallhavenQuery,
        page: pageParam,
        hasKey: Boolean(wallhavenApiKey),
      });

      try {
        const upstream = await fetch(wallhavenUrl, {
          headers: {
            'User-Agent': 'PixelDrop-WallpaperApp/2.0',
            Accept: 'application/json',
          },
        });

        if (upstream.ok) {
          const data = await upstream.json();
          const items = data.data || [];

          const normalizedWallpapers: UnifiedWallpaperResponseItem[] = items.map(
            (item: Record<string, unknown>) => {
              const width = Number(item.dimension_x) || 1920;
              const height = Number(item.dimension_y) || 1080;
              const orientation: 'landscape' | 'portrait' | 'square' =
                width > height ? 'landscape' : width < height ? 'portrait' : 'square';

              const thumbs = item.thumbs as Record<string, string> | undefined;
              const highResUrl = String(item.path || item.url || '');
              const thumbUrl = String(thumbs?.large || thumbs?.small || highResUrl);

              const displayCategory = categoryParam || (item.category as string) || 'anime';
              const cleanTitle = `${String(wallhavenQuery).charAt(0).toUpperCase() + String(wallhavenQuery).slice(1)} Illustration 4K`;

              return {
                id: `wallhaven-${String(item.id)}`,
                url: highResUrl,        // High-res download link
                thumbnail: thumbUrl,    // Preview image
                source: 'wallhaven',    // Source indicator
                title: cleanTitle,
                authorName: 'Wallhaven Artist',
                authorProfile: String(item.url || 'https://wallhaven.cc'),
                width,
                height,
                category: displayCategory,
                orientation,
                src: {
                  original: highResUrl,
                  large2x: highResUrl,
                  large: thumbUrl,
                  medium: thumbUrl,
                  small: String(thumbs?.small || thumbUrl),
                  portrait: thumbUrl,
                  landscape: highResUrl,
                  tiny: String(thumbs?.small || thumbUrl),
                },
              };
            }
          );

          const legacyPhotos = normalizedWallpapers.map((w) => ({
            id: w.id,
            url: w.url,
            photographer: w.authorName,
            photographer_url: w.authorProfile || '',
            photographer_id: 0,
            width: w.width,
            height: w.height,
            src: w.src!,
            alt: w.title,
          }));

          res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
          return res.status(200).json({
            page: Number(pageParam),
            per_page: Number(perPageParam),
            total_results: data.meta?.total || normalizedWallpapers.length,
            source: 'wallhaven',
            wallpapers: normalizedWallpapers,
            photos: legacyPhotos,
          });
        }
      } catch (err) {
        console.error('[Vercel Serverless] Wallhaven fetch error, falling back to Pexels:', err);
      }
    }

    // =========================================================================
    // 2. PEXELS API ROUTE
    // =========================================================================
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        page: Number(pageParam),
        per_page: Number(perPageParam),
        photos: [],
        wallpapers: [],
        total_results: 0,
        fallback: true,
        source: 'pexels',
        message: 'PEXELS_API_KEY not configured on server',
      });
    }

    const pexelsQuery = queryParam || (categoryParam && categoryParam !== 'all' ? categoryParam : '');
    const endpoint = pexelsQuery
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&page=${pageParam}&per_page=${perPageParam}`
      : `https://api.pexels.com/v1/curated?page=${pageParam}&per_page=${perPageParam}`;

    const upstream = await fetch(endpoint, {
      headers: {
        Authorization: apiKey.trim(),
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        status: upstream.status,
        photos: [],
        wallpapers: [],
        total_results: 0,
        fallback: true,
      });
    }

    const data = await upstream.json();
    const photos = data.photos || [];

    const normalizedWallpapers: UnifiedWallpaperResponseItem[] = photos.map(
      (photo: Record<string, unknown>) => {
        const width = Number(photo.width) || 1920;
        const height = Number(photo.height) || 1080;
        const orientation: 'landscape' | 'portrait' | 'square' =
          width > height ? 'landscape' : width < height ? 'portrait' : 'square';

        const src = photo.src as Record<string, string> | undefined;
        const highResUrl = String(src?.original || src?.large2x || photo.url || '');
        const thumbUrl = String(src?.large || src?.medium || highResUrl);

        return {
          id: `pexels-${String(photo.id)}`,
          url: highResUrl,        // High-res download link
          thumbnail: thumbUrl,    // Preview image
          source: 'pexels',       // Source indicator
          title: String(photo.alt || `${pexelsQuery || 'Curated'} 4K Wallpaper`).trim(),
          authorName: String(photo.photographer || 'Pexels Creator'),
          authorProfile: String(photo.photographer_url || ''),
          width,
          height,
          category: categoryParam || 'all',
          orientation,
          src: {
            original: highResUrl,
            large2x: String(src?.large2x || highResUrl),
            large: thumbUrl,
            medium: String(src?.medium || thumbUrl),
            small: String(src?.small || thumbUrl),
            portrait: String(src?.portrait || thumbUrl),
            landscape: String(src?.landscape || highResUrl),
            tiny: String(src?.tiny || thumbUrl),
          },
        };
      }
    );

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({
      page: Number(pageParam),
      per_page: Number(perPageParam),
      total_results: data.total_results || normalizedWallpapers.length,
      source: 'pexels',
      wallpapers: normalizedWallpapers,
      photos: photos,
    });
  } catch (err) {
    console.error('[/api/wallpapers] Serverless execution error:', err);
    return res.status(500).json({
      error: 'Vercel Serverless Function error proxying wallpapers API',
      photos: [],
      wallpapers: [],
      total_results: 0,
      fallback: true,
    });
  }
}
