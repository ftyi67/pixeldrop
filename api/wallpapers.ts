/**
 * Vercel Serverless Function: 4-Source Multi-Aggregator Wallpaper Proxy
 * Route: /api/wallpapers
 * 
 * Supports:
 * 1. Pexels API: Realistic photography, landscape, architecture, curated 4K views
 * 2. Wallhaven API: Anime, fantasy, cyberpunk, digital illustrations (SFW purity=100)
 * 3. Unsplash API: Aesthetic, minimalist, architecture, interior, lifestyle
 * 4. Pixabay API: Illustrations, vectors, cartoon styles, graphics
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
  source: 'pexels' | 'wallhaven' | 'unsplash' | 'pixabay';
  photographer: string;
  width: number;
  height: number;
  title: string;
  authorName: string;
  authorProfile?: string;
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

function isWallhavenIntent(query: string, category: string): boolean {
  const text = `${query} ${category}`.toLowerCase();
  const keywords = [
    'anime', 'fantasy', 'cyberpunk', 'digital art', 'manga', 'comic',
    'scifi', 'sci-fi', 'synthwave', 'gaming', 'game', 'waifu',
    'genshin', 'concept art', 'pixel art', 'futuristic', 'mecha'
  ];
  return (
    category === 'anime' ||
    category === 'fantasy' ||
    category === 'cyberpunk' ||
    keywords.some((kw) => text.includes(kw))
  );
}

function isPixabayIllustrationIntent(query: string, category: string): boolean {
  const text = `${query} ${category}`.toLowerCase();
  const keywords = [
    'illustration', 'illustrations', 'vector', 'vectors', 'cartoon',
    'drawing', 'drawings', 'clipart', 'graphic', 'sketch', 'doodle', 'pattern'
  ];
  return keywords.some((kw) => text.includes(kw));
}

function isAestheticLifestyleIntent(query: string, category: string): boolean {
  const text = `${query} ${category}`.toLowerCase();
  const keywords = [
    'aesthetic', 'minimalist', 'minimal', 'architecture', 'lifestyle',
    'interior', 'coffee', 'cozy', 'travel', 'street', 'portrait', 'plants', 'nature'
  ];
  return (
    category === 'minimalist' ||
    category === 'nature' ||
    keywords.some((kw) => text.includes(kw))
  );
}

function interleaveAndShuffle<T>(...arrays: T[][]): T[] {
  const valid = arrays.filter((a) => a && a.length > 0);
  if (valid.length === 0) return [];
  if (valid.length === 1) return valid[0];
  const list: T[] = [];
  const maxLen = Math.max(...valid.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of valid) {
      if (i < arr.length) list.push(arr[i]);
    }
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.max(0, i - Math.floor(Math.random() * 3));
    const t = list[i];
    list[i] = list[j];
    list[j] = t;
  }
  return list;
}

export default async function handler(req: VercelReq, res: VercelRes) {
  try {
    const rawQuery = (typeof req.query?.query === 'string' ? req.query.query : '')?.trim() || '';
    const category = (typeof req.query?.category === 'string' ? req.query.category : '')?.trim() || '';
    const page = Math.max(1, parseInt((typeof req.query?.page === 'string' ? req.query.page : '1'), 10));
    const perPage = Math.min(
      80,
      Math.max(
        10,
        parseInt(
          (typeof req.query?.per_page === 'string'
            ? req.query.per_page
            : typeof req.query?.perPage === 'string'
            ? req.query.perPage
            : '40'),
          10
        )
      )
    );

    const isWh = isWallhavenIntent(rawQuery, category);
    const isPb = isPixabayIllustrationIntent(rawQuery, category);
    const isAes = isAestheticLifestyleIntent(rawQuery, category);

    // Fetchers
    const fetchWallhaven = async (count: number) => {
      try {
        const wQuery = rawQuery || category || 'anime';
        const whKey = process.env.WALLHAVEN_API_KEY?.trim() || '';
        const keyParam = whKey ? `apikey=${encodeURIComponent(whKey)}&` : '';
        const url = `https://wallhaven.cc/api/v1/search?${keyParam}q=${encodeURIComponent(
          wQuery
        )}&purity=100&sorting=random&page=${page}`;
        const resp = await fetch(url, {
          headers: { 'User-Agent': 'PixelDrop-WallpaperApp/3.0', Accept: 'application/json' },
        });
        if (!resp.ok) return [];
        const data = await resp.json();
        const items = data.data || [];
        return items.slice(0, count).map((item: Record<string, unknown>) => {
          const width = Number(item.dimension_x) || 1920;
          const height = Number(item.dimension_y) || 1080;
          const orientation: 'landscape' | 'portrait' | 'square' =
            width > height ? 'landscape' : width < height ? 'portrait' : 'square';
          const thumbs = item.thumbs as Record<string, string> | undefined;
          const highResUrl = String(item.path || item.url || '');
          const thumbUrl = String(thumbs?.large || thumbs?.small || highResUrl);
          const photographer = 'Wallhaven Artist';
          return {
            id: `wallhaven-${String(item.id)}`,
            url: highResUrl,
            thumbnail: thumbUrl,
            source: 'wallhaven' as const,
            photographer,
            width,
            height,
            title: `${wQuery.charAt(0).toUpperCase() + wQuery.slice(1)} Illustration 4K`,
            authorName: photographer,
            authorProfile: String(item.url || 'https://wallhaven.cc'),
            category: category || (item.category as string) || 'anime',
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
        });
      } catch {
        return [];
      }
    };

    const fetchPixabay = async (count: number, isIllus = false) => {
      try {
        const pbKey = process.env.PIXABAY_API_KEY?.trim();
        if (!pbKey) return [];
        const pbQuery = rawQuery || category || 'wallpaper';
        const imgType = isIllus ? 'illustration' : 'all';
        const limit = Math.min(Math.max(count, 3), 50);
        const url = `https://pixabay.com/api/?key=${encodeURIComponent(
          pbKey
        )}&q=${encodeURIComponent(pbQuery)}&image_type=${imgType}&safesearch=true&page=${page}&per_page=${limit}`;
        const resp = await fetch(url);
        if (!resp.ok) return [];
        const data = await resp.json();
        const hits = data.hits || [];
        return hits.map((hit: Record<string, unknown>) => {
          const width = Number(hit.imageWidth) || 1920;
          const height = Number(hit.imageHeight) || 1080;
          const orientation: 'landscape' | 'portrait' | 'square' =
            width > height ? 'landscape' : width < height ? 'portrait' : 'square';
          const highResUrl = String(hit.largeImageURL || hit.imageURL || hit.webformatURL || '');
          const thumbUrl = String(hit.webformatURL || hit.previewURL || highResUrl);
          const photographer = String(hit.user || 'Pixabay Creator');
          const tags = String(hit.tags || '');
          const title = `${(tags.split(',')[0] || pbQuery).trim()} 4K Wallpaper`;
          return {
            id: `pixabay-${String(hit.id)}`,
            url: highResUrl,
            thumbnail: thumbUrl,
            source: 'pixabay' as const,
            photographer,
            width,
            height,
            title,
            authorName: photographer,
            authorProfile: hit.user_id ? `https://pixabay.com/users/${hit.user}-${hit.user_id}/` : 'https://pixabay.com',
            category: category || (isIllus ? 'illustration' : 'all'),
            orientation,
            src: {
              original: highResUrl,
              large2x: highResUrl,
              large: thumbUrl,
              medium: thumbUrl,
              small: String(hit.previewURL || thumbUrl),
              portrait: thumbUrl,
              landscape: highResUrl,
              tiny: String(hit.previewURL || thumbUrl),
            },
          };
        });
      } catch {
        return [];
      }
    };

    const fetchUnsplash = async (count: number) => {
      try {
        const unsKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
        if (!unsKey) return [];
        const uQuery = rawQuery || (category && category !== 'all' ? category : '');
        const url = uQuery
          ? `https://api.unsplash.com/search/photos?client_id=${encodeURIComponent(
              unsKey
            )}&query=${encodeURIComponent(uQuery)}&page=${page}&per_page=${count}&orientation=landscape`
          : `https://api.unsplash.com/photos?client_id=${encodeURIComponent(
              unsKey
            )}&page=${page}&per_page=${count}&order_by=popular`;
        const resp = await fetch(url, { headers: { 'Accept-Version': 'v1' } });
        if (!resp.ok) return [];
        const data = await resp.json();
        const items = Array.isArray(data) ? data : data.results || [];
        return items.map((item: Record<string, unknown>) => {
          const width = Number(item.width) || 1920;
          const height = Number(item.height) || 1080;
          const orientation: 'landscape' | 'portrait' | 'square' =
            width > height ? 'landscape' : width < height ? 'portrait' : 'square';
          const urls = item.urls as Record<string, string> | undefined;
          const highResUrl = String(urls?.raw || urls?.full || urls?.regular || '');
          const thumbUrl = String(urls?.regular || urls?.small || urls?.thumb || highResUrl);
          const user = item.user as Record<string, unknown> | undefined;
          const photographer = String(user?.name || user?.username || 'Unsplash Creator');
          const userLinks = user?.links as Record<string, string> | undefined;
          const altDesc = String(item.alt_description || item.description || '').trim();
          return {
            id: `unsplash-${String(item.id)}`,
            url: highResUrl,
            thumbnail: thumbUrl,
            source: 'unsplash' as const,
            photographer,
            width,
            height,
            title: altDesc ? altDesc.charAt(0).toUpperCase() + altDesc.slice(1) : `${uQuery || 'Aesthetic'} 4K Wallpaper`,
            authorName: photographer,
            authorProfile: String(userLinks?.html || 'https://unsplash.com'),
            category: category || 'minimalist',
            orientation,
            src: {
              original: highResUrl,
              large2x: String(urls?.full || highResUrl),
              large: thumbUrl,
              medium: String(urls?.small || thumbUrl),
              small: String(urls?.small || thumbUrl),
              portrait: thumbUrl,
              landscape: highResUrl,
              tiny: String(urls?.thumb || thumbUrl),
            },
          };
        });
      } catch {
        return [];
      }
    };

    const fetchPexels = async (count: number) => {
      try {
        const pxKey = process.env.PEXELS_API_KEY?.trim();
        if (!pxKey) return [];
        const pxQuery = rawQuery || (category && category !== 'all' ? category : '');
        const url = pxQuery
          ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(pxQuery)}&page=${page}&per_page=${count}`
          : `https://api.pexels.com/v1/curated?page=${page}&per_page=${count}`;
        const resp = await fetch(url, { headers: { Authorization: pxKey } });
        if (!resp.ok) return [];
        const data = await resp.json();
        const photos = data.photos || [];
        return photos.map((photo: Record<string, unknown>) => {
          const width = Number(photo.width) || 1920;
          const height = Number(photo.height) || 1080;
          const orientation: 'landscape' | 'portrait' | 'square' =
            width > height ? 'landscape' : width < height ? 'portrait' : 'square';
          const src = photo.src as Record<string, string> | undefined;
          const highResUrl = String(src?.original || src?.large2x || photo.url || '');
          const thumbUrl = String(src?.large || src?.medium || highResUrl);
          const photographer = String(photo.photographer || 'Pexels Creator');
          return {
            id: `pexels-${String(photo.id)}`,
            url: highResUrl,
            thumbnail: thumbUrl,
            source: 'pexels' as const,
            photographer,
            width,
            height,
            title: String(photo.alt || `${pxQuery || 'Curated'} 4K Wallpaper`).trim(),
            authorName: photographer,
            authorProfile: String(photo.photographer_url || 'https://www.pexels.com'),
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
        });
      } catch {
        return [];
      }
    };

    let collected: UnifiedWallpaperResponseItem[] = [];
    const sourcesUsed: string[] = [];

    if (isWh) {
      const [wh, pb] = await Promise.all([
        fetchWallhaven(perPage),
        fetchPixabay(Math.floor(perPage / 2), true),
      ]);
      if (wh.length > 0) sourcesUsed.push('wallhaven');
      if (pb.length > 0) sourcesUsed.push('pixabay');
      collected = interleaveAndShuffle(wh, pb);
      if (collected.length === 0) {
        const px = await fetchPexels(perPage);
        if (px.length > 0) {
          sourcesUsed.push('pexels');
          collected = px;
        }
      }
    } else if (isPb) {
      const [pb, wh] = await Promise.all([
        fetchPixabay(perPage, true),
        fetchWallhaven(Math.floor(perPage / 2)),
      ]);
      if (pb.length > 0) sourcesUsed.push('pixabay');
      if (wh.length > 0) sourcesUsed.push('wallhaven');
      collected = interleaveAndShuffle(pb, wh);
      if (collected.length === 0) {
        const px = await fetchPexels(perPage);
        if (px.length > 0) {
          sourcesUsed.push('pexels');
          collected = px;
        }
      }
    } else if (isAes) {
      const half = Math.ceil(perPage / 2);
      const [uns, px] = await Promise.all([
        fetchUnsplash(half),
        fetchPexels(half),
      ]);
      if (uns.length > 0) sourcesUsed.push('unsplash');
      if (px.length > 0) sourcesUsed.push('pexels');
      collected = interleaveAndShuffle(uns, px);
      if (collected.length === 0) {
        const pb = await fetchPixabay(perPage, false);
        if (pb.length > 0) {
          sourcesUsed.push('pixabay');
          collected = pb;
        }
      }
    } else {
      const quarter = Math.ceil(perPage / 2);
      const [px, uns, pb, wh] = await Promise.all([
        fetchPexels(quarter),
        fetchUnsplash(quarter),
        fetchPixabay(quarter, false),
        fetchWallhaven(quarter),
      ]);
      if (px.length > 0) sourcesUsed.push('pexels');
      if (uns.length > 0) sourcesUsed.push('unsplash');
      if (pb.length > 0) sourcesUsed.push('pixabay');
      if (wh.length > 0) sourcesUsed.push('wallhaven');
      collected = interleaveAndShuffle(px, uns, pb, wh);
    }

    const legacyPhotos = collected.map((w) => ({
      id: w.id,
      url: w.url,
      photographer: w.photographer,
      photographer_url: w.authorProfile || '',
      photographer_id: 0,
      width: w.width,
      height: w.height,
      src: w.src!,
      alt: w.title,
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({
      page,
      per_page: perPage,
      total_results: Math.max(collected.length * 25, 250),
      source: sourcesUsed.length === 1 ? sourcesUsed[0] : sourcesUsed.length > 1 ? 'multi' : 'fallback',
      sources_used: sourcesUsed,
      wallpapers: collected,
      photos: legacyPhotos,
    });
  } catch (error) {
    console.error('[Vercel Serverless /api/wallpapers] Error:', error);
    return res.status(500).json({
      error: 'Server error aggregating wallpapers multi-source stream',
      wallpapers: [],
      photos: [],
      total_results: 0,
      fallback: true,
    });
  }
}
