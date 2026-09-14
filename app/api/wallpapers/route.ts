/**
 * PixelDrop - Dual-Source Server-Side Wallpaper Proxy (Next.js Route Handler)
 * Route: /api/wallpapers
 * 
 * Securely proxies and intelligently routes wallpaper requests:
 * 1. Wallhaven API: For anime, fantasy, cyberpunk, and digital illustrations (forced SFW purity=100)
 * 2. Pexels API: For realistic photos, nature, architecture, and general curated 4K views
 * 
 * Normalizes both sources into a unified structure:
 * {
 *   id: string;
 *   url: string;        // High-res download link
 *   thumbnail: string;  // Preview image
 *   source: 'pexels' | 'wallhaven';
 * }
 * 
 * Keeps process.env.PEXELS_API_KEY and process.env.WALLHAVEN_API_KEY strictly server-side.
 */

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

// Helper to determine if query/category maps to Wallhaven (digital art, anime, cyberpunk, fantasy)
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('query')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || searchParams.get('perPage') || '40';

    const isWallhaven = shouldUseWallhaven(rawQuery, category);

    // =========================================================================
    // 1. WALLHAVEN API (Anime, Fantasy, Cyberpunk, Digital Art)
    // =========================================================================
    if (isWallhaven) {
      const wallhavenQuery = rawQuery || category || 'anime';
      const wallhavenApiKey = process.env.WALLHAVEN_API_KEY?.trim() || '';
      
      // purity=100 forces strict SFW content
      const apiKeyParam = wallhavenApiKey ? `apikey=${encodeURIComponent(wallhavenApiKey)}&` : '';
      const wallhavenUrl = `https://wallhaven.cc/api/v1/search?${apiKeyParam}q=${encodeURIComponent(
        wallhavenQuery
      )}&purity=100&sorting=random&page=${encodeURIComponent(page)}`;

      console.log(`[Next.js /api/wallpapers] Routing to Wallhaven API:`, {
        query: wallhavenQuery,
        page,
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

          // Normalize to required unified format
          const normalizedWallpapers: UnifiedWallpaperResponseItem[] = items.map(
            (item: Record<string, unknown>) => {
              const width = Number(item.dimension_x) || 1920;
              const height = Number(item.dimension_y) || 1080;
              const orientation: 'landscape' | 'portrait' | 'square' =
                width > height ? 'landscape' : width < height ? 'portrait' : 'square';

              const thumbs = item.thumbs as Record<string, string> | undefined;
              const highResUrl = String(item.path || item.url || '');
              const thumbUrl = String(thumbs?.large || thumbs?.small || highResUrl);

              const displayCategory = category || (item.category as string) || 'anime';
              const cleanTitle = `${String(wallhavenQuery).charAt(0).toUpperCase() + String(wallhavenQuery).slice(1)} Illustration 4K`;

              return {
                id: `wallhaven-${String(item.id)}`,
                url: highResUrl,        // High-res download link (Required)
                thumbnail: thumbUrl,    // Preview image (Required)
                source: 'wallhaven',    // Source indicator (Required)
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

          // Backwards-compatible photos array
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

          return Response.json(
            {
              page: Number(page),
              per_page: Number(perPage),
              total_results: data.meta?.total || normalizedWallpapers.length,
              source: 'wallhaven',
              wallpapers: normalizedWallpapers,
              photos: legacyPhotos,
            },
            {
              status: 200,
              headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
              },
            }
          );
        }

        console.warn(`[Next.js /api/wallpapers] Wallhaven returned status ${upstream.status}, falling back to Pexels.`);
      } catch (whErr) {
        console.error('[Next.js /api/wallpapers] Wallhaven fetch failed, falling back to Pexels:', whErr);
      }
    }

    // =========================================================================
    // 2. PEXELS API (Realistic Photos, Architecture, Nature, Curated Views)
    // =========================================================================
    const pexelsKey = process.env.PEXELS_API_KEY;

    if (!pexelsKey) {
      console.warn('[Next.js /api/wallpapers] PEXELS_API_KEY missing from environment.');
      return Response.json(
        {
          error: 'PEXELS_API_KEY is not configured on the server.',
          page: Number(page),
          per_page: Number(perPage),
          total_results: 0,
          source: 'pexels',
          wallpapers: [],
          photos: [],
          fallback: true,
        },
        { status: 200 }
      );
    }

    const pexelsQuery = rawQuery || (category && category !== 'all' ? category : '');
    const pexelsEndpoint = pexelsQuery
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&page=${page}&per_page=${perPage}`
      : `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;

    console.log(`[Next.js /api/wallpapers] Routing to Pexels API:`, {
      endpoint: pexelsEndpoint,
      page,
      perPage,
    });

    const res = await fetch(pexelsEndpoint, {
      headers: {
        Authorization: pexelsKey.trim(),
      },
    });

    if (!res.ok) {
      return Response.json(
        {
          error: `Pexels API responded with status ${res.status}`,
          status: res.status,
          page: Number(page),
          per_page: Number(perPage),
          total_results: 0,
          source: 'pexels',
          wallpapers: [],
          photos: [],
          fallback: true,
        },
        { status: res.status }
      );
    }

    const pexelsData = await res.json();
    const photos = pexelsData.photos || [];

    // Normalize to required unified format
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
          url: highResUrl,        // High-res download link (Required)
          thumbnail: thumbUrl,    // Preview image (Required)
          source: 'pexels',       // Source indicator (Required)
          title: String(photo.alt || `${pexelsQuery || 'Curated'} 4K Wallpaper`).trim(),
          authorName: String(photo.photographer || 'Pexels Creator'),
          authorProfile: String(photo.photographer_url || ''),
          width,
          height,
          category: category || 'all',
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

    return Response.json(
      {
        page: Number(page),
        per_page: Number(perPage),
        total_results: pexelsData.total_results || normalizedWallpapers.length,
        source: 'pexels',
        wallpapers: normalizedWallpapers,
        photos: photos,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('[Next.js /api/wallpapers] Server proxy error:', error);
    return Response.json(
      {
        error: 'Internal server error while fetching wallpapers.',
        wallpapers: [],
        photos: [],
        total_results: 0,
      },
      { status: 500 }
    );
  }
}
