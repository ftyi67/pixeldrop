/**
 * PixelDrop - 4-Source Multi-Aggregator Server-Side Wallpaper Proxy
 * Route: /app/api/wallpapers/route.ts
 * 
 * Supports 4 High-Resolution Wallpaper Providers:
 * 1. Pexels: Realistic photography, nature, landscapes, 4K curated collections
 * 2. Wallhaven: Anime, fantasy, cyberpunk, digital art, concept illustrations (forced SFW purity=100)
 * 3. Unsplash: Aesthetic, minimalist, architecture, interior, lifestyle imagery
 * 4. Pixabay: Illustrations, vectors, cartoon styles, drawings, graphics
 * 
 * Unified Normalized Schema for all 4 sources:
 * {
 *   id: string;
 *   url: string;
 *   thumbnail: string;
 *   source: 'pexels' | 'wallhaven' | 'unsplash' | 'pixabay';
 *   photographer: string;
 *   width: number;
 *   height: number;
 * }
 * 
 * Strictly keeps API keys server-side via process.env:
 * - PEXELS_API_KEY
 * - WALLHAVEN_API_KEY
 * - UNSPLASH_ACCESS_KEY
 * - PIXABAY_API_KEY
 */

export interface UnifiedWallpaperResponseItem {
  id: string;
  url: string;
  thumbnail: string;
  source: 'pexels' | 'wallhaven' | 'unsplash' | 'pixabay';
  photographer: string;
  width: number;
  height: number;
  // Companion properties for rich UI component compatibility:
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

// =============================================================================
// Intent Classification Helpers
// =============================================================================

function isWallhavenIntent(query: string, category: string): boolean {
  const q = (query || '').toLowerCase().trim();
  const c = (category || '').toLowerCase().trim();
  const text = `${q} ${c}`;

  const wallhavenKeywords = [
    'anime',
    'fantasy',
    'cyberpunk',
    'digital art',
    'manga',
    'comic',
    'scifi',
    'sci-fi',
    'synthwave',
    'gaming',
    'game',
    'waifu',
    'genshin',
    'concept art',
    'pixel art',
    'futuristic',
    'mecha',
  ];

  return (
    c === 'anime' ||
    c === 'fantasy' ||
    c === 'cyberpunk' ||
    wallhavenKeywords.some((kw) => text.includes(kw))
  );
}

function isPixabayIllustrationIntent(query: string, category: string): boolean {
  const q = (query || '').toLowerCase().trim();
  const c = (category || '').toLowerCase().trim();
  const text = `${q} ${c}`;

  const illustrationKeywords = [
    'illustration',
    'illustrations',
    'vector',
    'vectors',
    'cartoon',
    'drawing',
    'drawings',
    'clipart',
    'clip art',
    'graphic',
    'graphics',
    'sketch',
    'doodle',
    'pattern',
    'icon',
  ];

  return illustrationKeywords.some((kw) => text.includes(kw));
}

function isAestheticLifestyleIntent(query: string, category: string): boolean {
  const q = (query || '').toLowerCase().trim();
  const c = (category || '').toLowerCase().trim();
  const text = `${q} ${c}`;

  const aestheticKeywords = [
    'aesthetic',
    'minimalist',
    'minimal',
    'architecture',
    'lifestyle',
    'interior',
    'coffee',
    'cozy',
    'travel',
    'street',
    'portrait',
    'plants',
    'wood',
    'texture',
    'urban',
    'nature',
    'landscape',
  ];

  return (
    c === 'minimalist' ||
    c === 'nature' ||
    aestheticKeywords.some((kw) => text.includes(kw))
  );
}

// =============================================================================
// Helper: Interleave & Shuffle Utility
// =============================================================================

function interleaveAndShuffle<T>(...arrays: T[][]): T[] {
  const validArrays = arrays.filter((arr) => arr && arr.length > 0);
  if (validArrays.length === 0) return [];
  if (validArrays.length === 1) return validArrays[0];

  const interleaved: T[] = [];
  const maxLen = Math.max(...validArrays.map((arr) => arr.length));

  for (let i = 0; i < maxLen; i++) {
    for (const arr of validArrays) {
      if (i < arr.length) {
        interleaved.push(arr[i]);
      }
    }
  }

  // Gentle localized shuffle to create variety while preserving fair distribution
  for (let i = interleaved.length - 1; i > 0; i--) {
    const j = Math.max(0, i - Math.floor(Math.random() * 3));
    const temp = interleaved[i];
    interleaved[i] = interleaved[j];
    interleaved[j] = temp;
  }

  return interleaved;
}

// =============================================================================
// 1. WALLHAVEN API FETCHER (Anime, Fantasy, Cyberpunk, Digital Art)
// =============================================================================

async function fetchFromWallhaven(
  query: string,
  category: string,
  page: number,
  perPage: number
): Promise<UnifiedWallpaperResponseItem[]> {
  const wallhavenQuery = query || category || 'anime';
  const apiKey = process.env.WALLHAVEN_API_KEY?.trim() || '';
  const apiKeyParam = apiKey ? `apikey=${encodeURIComponent(apiKey)}&` : '';
  
  // purity=100 strictly enforces SFW content
  const endpoint = `https://wallhaven.cc/api/v1/search?${apiKeyParam}q=${encodeURIComponent(
    wallhavenQuery
  )}&purity=100&sorting=random&page=${encodeURIComponent(page)}`;

  console.log(`[Wallhaven Engine] Querying: "${wallhavenQuery}", page ${page}`);

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        'User-Agent': 'PixelDrop-WallpaperApp/3.0',
        Accept: 'application/json',
      },
    });

    if (!upstream.ok) {
      console.warn(`[Wallhaven Engine] Upstream returned HTTP ${upstream.status}`);
      return [];
    }

    const data = await upstream.json();
    const items = data.data || [];

    return items.slice(0, perPage).map((item: Record<string, unknown>) => {
      const width = Number(item.dimension_x) || 1920;
      const height = Number(item.dimension_y) || 1080;
      const orientation: 'landscape' | 'portrait' | 'square' =
        width > height ? 'landscape' : width < height ? 'portrait' : 'square';

      const thumbs = item.thumbs as Record<string, string> | undefined;
      const highResUrl = String(item.path || item.url || '');
      const thumbUrl = String(thumbs?.large || thumbs?.small || highResUrl);
      const photographer = 'Wallhaven Artist';

      const title = `${wallhavenQuery.charAt(0).toUpperCase() + wallhavenQuery.slice(1)} Illustration 4K`;

      return {
        id: `wallhaven-${String(item.id)}`,
        url: highResUrl,
        thumbnail: thumbUrl,
        source: 'wallhaven' as const,
        photographer,
        width,
        height,
        title,
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
  } catch (err) {
    console.error('[Wallhaven Engine] Fetch error:', err);
    return [];
  }
}

// =============================================================================
// 2. PIXABAY API FETCHER (Illustrations, Vectors, Cartoon Styles)
// =============================================================================

async function fetchFromPixabay(
  query: string,
  category: string,
  page: number,
  perPage: number,
  isIllustration = false
): Promise<UnifiedWallpaperResponseItem[]> {
  const apiKey = process.env.PIXABAY_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[Pixabay Engine] PIXABAY_API_KEY not configured on server.');
    return [];
  }

  const pixabayQuery = query || category || 'wallpaper';
  const imageType = isIllustration ? 'illustration' : 'all';
  const safePerPage = Math.min(Math.max(perPage, 3), 50);

  const endpoint = `https://pixabay.com/api/?key=${encodeURIComponent(
    apiKey
  )}&q=${encodeURIComponent(pixabayQuery)}&image_type=${encodeURIComponent(
    imageType
  )}&safesearch=true&page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(
    safePerPage
  )}`;

  console.log(`[Pixabay Engine] Querying: "${pixabayQuery}", type: ${imageType}, page ${page}`);

  try {
    const upstream = await fetch(endpoint);
    if (!upstream.ok) {
      console.warn(`[Pixabay Engine] Upstream returned HTTP ${upstream.status}`);
      return [];
    }

    const data = await upstream.json();
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
      const primaryTag = tags.split(',')[0]?.trim() || pixabayQuery;
      const title = `${primaryTag.charAt(0).toUpperCase() + primaryTag.slice(1)} 4K Wallpaper`;

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
        authorProfile: hit.user_id
          ? `https://pixabay.com/users/${hit.user}-${hit.user_id}/`
          : 'https://pixabay.com',
        category: category || (isIllustration ? 'illustration' : 'all'),
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
  } catch (err) {
    console.error('[Pixabay Engine] Fetch error:', err);
    return [];
  }
}

// =============================================================================
// 3. UNSPLASH API FETCHER (Aesthetic, Minimalist, Architecture, Lifestyle)
// =============================================================================

async function fetchFromUnsplash(
  query: string,
  category: string,
  page: number,
  perPage: number
): Promise<UnifiedWallpaperResponseItem[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!accessKey) {
    console.warn('[Unsplash Engine] UNSPLASH_ACCESS_KEY not configured on server.');
    return [];
  }

  const unsplashQuery = query || (category && category !== 'all' ? category : '');
  const endpoint = unsplashQuery
    ? `https://api.unsplash.com/search/photos?client_id=${encodeURIComponent(
        accessKey
      )}&query=${encodeURIComponent(unsplashQuery)}&page=${encodeURIComponent(
        page
      )}&per_page=${encodeURIComponent(perPage)}&orientation=landscape`
    : `https://api.unsplash.com/photos?client_id=${encodeURIComponent(
        accessKey
      )}&page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(
        perPage
      )}&order_by=popular`;

  console.log(`[Unsplash Engine] Querying: "${unsplashQuery || 'popular'}", page ${page}`);

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        'Accept-Version': 'v1',
      },
    });

    if (!upstream.ok) {
      console.warn(`[Unsplash Engine] Upstream returned HTTP ${upstream.status}`);
      return [];
    }

    const data = await upstream.json();
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
      const title = altDesc
        ? altDesc.charAt(0).toUpperCase() + altDesc.slice(1)
        : `${unsplashQuery || 'Aesthetic'} 4K Wallpaper`;

      return {
        id: `unsplash-${String(item.id)}`,
        url: highResUrl,
        thumbnail: thumbUrl,
        source: 'unsplash' as const,
        photographer,
        width,
        height,
        title,
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
  } catch (err) {
    console.error('[Unsplash Engine] Fetch error:', err);
    return [];
  }
}

// =============================================================================
// 4. PEXELS API FETCHER (Realistic Photography, Landscape, Curated 4K)
// =============================================================================

async function fetchFromPexels(
  query: string,
  category: string,
  page: number,
  perPage: number
): Promise<UnifiedWallpaperResponseItem[]> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[Pexels Engine] PEXELS_API_KEY not configured on server.');
    return [];
  }

  const pexelsQuery = query || (category && category !== 'all' ? category : '');
  const endpoint = pexelsQuery
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        pexelsQuery
      )}&page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(perPage)}`
    : `https://api.pexels.com/v1/curated?page=${encodeURIComponent(
        page
      )}&per_page=${encodeURIComponent(perPage)}`;

  console.log(`[Pexels Engine] Querying: "${pexelsQuery || 'curated'}", page ${page}`);

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!upstream.ok) {
      console.warn(`[Pexels Engine] Upstream returned HTTP ${upstream.status}`);
      return [];
    }

    const data = await upstream.json();
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

      const title = String(photo.alt || `${pexelsQuery || 'Curated'} 4K Wallpaper`).trim();

      return {
        id: `pexels-${String(photo.id)}`,
        url: highResUrl,
        thumbnail: thumbUrl,
        source: 'pexels' as const,
        photographer,
        width,
        height,
        title,
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
  } catch (err) {
    console.error('[Pexels Engine] Fetch error:', err);
    return [];
  }
}

// =============================================================================
// MAIN ROUTE HANDLER (GET /api/wallpapers)
// =============================================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('query')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(
      80,
      Math.max(10, parseInt(searchParams.get('per_page') || searchParams.get('perPage') || '40', 10))
    );

    console.log(`[Next.js Multi-Aggregator] Incoming request:`, {
      query: rawQuery,
      category,
      page,
      perPage,
    });

    const isWallhaven = isWallhavenIntent(rawQuery, category);
    const isPixabayIllustration = isPixabayIllustrationIntent(rawQuery, category);
    const isAesthetic = isAestheticLifestyleIntent(rawQuery, category);

    let collectedWallpapers: UnifiedWallpaperResponseItem[] = [];
    const activeSources: string[] = [];

    // =========================================================================
    // INTELLIGENT ROUTING & MULTI-SOURCE DISPATCH
    // =========================================================================

    if (isWallhaven) {
      // 1. Anime, Fantasy, Cyberpunk, Digital Art -> Wallhaven primary, with Pixabay/Pexels fallback
      console.log(`[Multi-Aggregator Routing] -> Wallhaven Primary Pipeline`);
      const [wallhavenRes, pixabayRes] = await Promise.allSettled([
        fetchFromWallhaven(rawQuery, category, page, perPage),
        fetchFromPixabay(rawQuery, category, page, Math.floor(perPage / 2), true),
      ]);

      const wallhavenItems = wallhavenRes.status === 'fulfilled' ? wallhavenRes.value : [];
      const pixabayItems = pixabayRes.status === 'fulfilled' ? pixabayRes.value : [];

      if (wallhavenItems.length > 0) activeSources.push('wallhaven');
      if (pixabayItems.length > 0) activeSources.push('pixabay');

      collectedWallpapers = interleaveAndShuffle(wallhavenItems, pixabayItems);

      // Robust fallback: If both Wallhaven & Pixabay failed or returned 0, try Pexels
      if (collectedWallpapers.length === 0) {
        console.warn(`[Multi-Aggregator] Wallhaven/Pixabay yielded 0 items, falling back to Pexels.`);
        const pexelsFallback = await fetchFromPexels(rawQuery, category, page, perPage);
        if (pexelsFallback.length > 0) {
          activeSources.push('pexels');
          collectedWallpapers = pexelsFallback;
        }
      }
    } else if (isPixabayIllustration) {
      // 2. Illustrations, Vectors, Cartoon Styles -> Pixabay primary, with Wallhaven fallback
      console.log(`[Multi-Aggregator Routing] -> Pixabay Illustration Pipeline`);
      const [pixabayRes, wallhavenRes] = await Promise.allSettled([
        fetchFromPixabay(rawQuery, category, page, perPage, true),
        fetchFromWallhaven(rawQuery, category, page, Math.floor(perPage / 2)),
      ]);

      const pixabayItems = pixabayRes.status === 'fulfilled' ? pixabayRes.value : [];
      const wallhavenItems = wallhavenRes.status === 'fulfilled' ? wallhavenRes.value : [];

      if (pixabayItems.length > 0) activeSources.push('pixabay');
      if (wallhavenItems.length > 0) activeSources.push('wallhaven');

      collectedWallpapers = interleaveAndShuffle(pixabayItems, wallhavenItems);

      if (collectedWallpapers.length === 0) {
        const pexelsFallback = await fetchFromPexels(rawQuery, category, page, perPage);
        if (pexelsFallback.length > 0) {
          activeSources.push('pexels');
          collectedWallpapers = pexelsFallback;
        }
      }
    } else if (isAesthetic) {
      // 3. Aesthetic, Minimalist, Architecture, Lifestyle -> Unsplash & Pexels Dual Stream
      console.log(`[Multi-Aggregator Routing] -> Unsplash & Pexels Aesthetic Pipeline`);
      const halfLimit = Math.ceil(perPage / 2);
      const [unsplashRes, pexelsRes] = await Promise.allSettled([
        fetchFromUnsplash(rawQuery, category, page, halfLimit),
        fetchFromPexels(rawQuery, category, page, halfLimit),
      ]);

      const unsplashItems = unsplashRes.status === 'fulfilled' ? unsplashRes.value : [];
      const pexelsItems = pexelsRes.status === 'fulfilled' ? pexelsRes.value : [];

      if (unsplashItems.length > 0) activeSources.push('unsplash');
      if (pexelsItems.length > 0) activeSources.push('pexels');

      collectedWallpapers = interleaveAndShuffle(unsplashItems, pexelsItems);

      // Fallback: If both empty, try Pixabay
      if (collectedWallpapers.length === 0) {
        console.warn(`[Multi-Aggregator] Unsplash/Pexels empty, trying Pixabay fallback.`);
        const pixabayFallback = await fetchFromPixabay(rawQuery, category, page, perPage, false);
        if (pixabayFallback.length > 0) {
          activeSources.push('pixabay');
          collectedWallpapers = pixabayFallback;
        }
      }
    } else {
      // 4. General / Curated / All / Trending -> 4-Way Multi-Aggregator Blend
      console.log(`[Multi-Aggregator Routing] -> 4-Source Multi-Engine Dispatch`);
      const quarterLimit = Math.ceil(perPage / 2);

      const [pexelsRes, unsplashRes, pixabayRes, wallhavenRes] = await Promise.allSettled([
        fetchFromPexels(rawQuery, category, page, quarterLimit),
        fetchFromUnsplash(rawQuery, category, page, quarterLimit),
        fetchFromPixabay(rawQuery, category, page, quarterLimit, false),
        fetchFromWallhaven(rawQuery, category, page, quarterLimit),
      ]);

      const pexelsItems = pexelsRes.status === 'fulfilled' ? pexelsRes.value : [];
      const unsplashItems = unsplashRes.status === 'fulfilled' ? unsplashRes.value : [];
      const pixabayItems = pixabayRes.status === 'fulfilled' ? pixabayRes.value : [];
      const wallhavenItems = wallhavenRes.status === 'fulfilled' ? wallhavenRes.value : [];

      if (pexelsItems.length > 0) activeSources.push('pexels');
      if (unsplashItems.length > 0) activeSources.push('unsplash');
      if (pixabayItems.length > 0) activeSources.push('pixabay');
      if (wallhavenItems.length > 0) activeSources.push('wallhaven');

      collectedWallpapers = interleaveAndShuffle(
        pexelsItems,
        unsplashItems,
        pixabayItems,
        wallhavenItems
      );
    }

    // Backwards-compatible legacy photos array
    const legacyPhotos = collectedWallpapers.map((w) => ({
      id: w.id,
      url: w.url,
      photographer: w.photographer,
      photographer_url: w.authorProfile || '',
      photographer_id: 0,
      width: w.width,
      height: w.height,
      src: w.src || {
        original: w.url,
        large2x: w.url,
        large: w.thumbnail,
        medium: w.thumbnail,
        small: w.thumbnail,
        portrait: w.thumbnail,
        landscape: w.url,
        tiny: w.thumbnail,
      },
      alt: w.title,
    }));

    const primarySource =
      activeSources.length === 1
        ? activeSources[0]
        : activeSources.length > 1
        ? 'multi'
        : 'fallback';

    return Response.json(
      {
        page,
        per_page: perPage,
        total_results: Math.max(collectedWallpapers.length * 25, 250),
        source: primarySource,
        sources_used: activeSources,
        wallpapers: collectedWallpapers,
        photos: legacyPhotos,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('[Next.js /api/wallpapers] Fatal Route Handler error:', error);
    return Response.json(
      {
        error: 'Server error aggregating multi-source wallpaper stream',
        wallpapers: [],
        photos: [],
        total_results: 0,
        fallback: true,
      },
      { status: 500 }
    );
  }
}
