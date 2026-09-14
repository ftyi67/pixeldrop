/**
 * Vercel Serverless Function: Pexels API Wallpaper Proxy
 * Route: /api/wallpapers
 * 
 * Works out-of-the-box on Vercel without requiring a persistent Express server.
 * Reads PEXELS_API_KEY securely from Vercel Environment Variables.
 */

// Using generic types to avoid requiring @vercel/node dependency
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

export default async function handler(req: VercelReq, res: VercelRes) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract query parameters with fallbacks
    let queryParam = '';
    let pageParam = '1';
    let perPageParam = '40';

    if (req.query) {
      queryParam = (req.query.query as string)?.trim() || '';
      pageParam = (req.query.page as string) || '1';
      perPageParam = (req.query.per_page as string) || (req.query.perPage as string) || '40';
    } else if (req.url) {
      const parsedUrl = new URL(req.url, 'http://localhost');
      queryParam = parsedUrl.searchParams.get('query')?.trim() || '';
      pageParam = parsedUrl.searchParams.get('page') || '1';
      perPageParam =
        parsedUrl.searchParams.get('per_page') ||
        parsedUrl.searchParams.get('perPage') ||
        '40';
    }

    const apiKey = process.env.PEXELS_API_KEY;

    console.log('⚡ [Vercel Serverless /api/wallpapers] Request received:', {
      query: queryParam,
      page: pageParam,
      per_page: perPageParam,
      hasApiKey: Boolean(apiKey),
    });

    // Graceful fallback if environment variable is not set on Vercel
    if (!apiKey) {
      console.warn(
        '[/api/wallpapers] PEXELS_API_KEY is not defined in Vercel Environment Variables. Fallback mode enabled.'
      );
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).json({
        page: Number(pageParam),
        per_page: Number(perPageParam),
        photos: [],
        total_results: 0,
        fallback: true,
        message: 'PEXELS_API_KEY not configured on Vercel environment variables',
      });
    }

    const endpoint = queryParam
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(queryParam)}&page=${pageParam}&per_page=${perPageParam}`
      : `https://api.pexels.com/v1/curated?page=${pageParam}&per_page=${perPageParam}`;

    console.log('🌐 [Vercel Serverless /api/wallpapers] Calling upstream Pexels:', endpoint);

    const upstream = await fetch(endpoint, {
      headers: {
        Authorization: apiKey.trim(),
      },
    });

    console.log('📡 [Vercel Serverless /api/wallpapers] Pexels status:', upstream.status, upstream.statusText);

    if (!upstream.ok) {
      console.error(
        `[/api/wallpapers] Pexels upstream error: ${upstream.status} ${upstream.statusText}`
      );
      return res.status(upstream.status).json({
        status: upstream.status,
        photos: [],
        total_results: 0,
        fallback: true,
      });
    }

    const data = await upstream.json();
    console.log('✅ [Vercel Serverless /api/wallpapers] Upstream returned photos:', data.photos?.length || 0);

    // Cache successful responses for 1 hour at edge / CDN
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[/api/wallpapers] Serverless execution error:', err);
    return res.status(500).json({
      error: 'Vercel Serverless Function error proxying Pexels API',
      photos: [],
      total_results: 0,
      fallback: true,
    });
  }
}
