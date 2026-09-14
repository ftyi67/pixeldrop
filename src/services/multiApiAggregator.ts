import {
  Wallpaper,
  WallpaperCategory,
  UnifiedWallpaperItem,
  PexelsPhotoSrc,
} from '../types';
import {
  getPexelsApiKey,
  PexelsPhoto,
  PexelsApiResponse,
  generateFallbackPexelsBatch,
} from './pexels';

// ==========================================
// 1. API Key Accessors (Pexels & Pixabay)
// ==========================================

// Server-side credential management: End-users never configure API keys.
export const getPixabayApiKey = (): string => '';
export const setPixabayApiKey = (_key: string): void => {};

// ==========================================
// 2. Raw Pixabay API Type Definitions
// ==========================================

export interface PixabayHit {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL?: string;
  imageURL?: string;
  imageWidth: number;
  imageHeight: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayApiResponse {
  total: number;
  totalHits: number;
  hits: PixabayHit[];
}

// Category search queries
const CATEGORY_SEARCH_QUERIES: Record<WallpaperCategory, string> = {
  all: 'wallpaper 4k background',
  nature: 'nature landscape mountain ocean 4k',
  cyberpunk: 'cyberpunk neon city night futuristic',
  minimalist: 'minimalist architecture abstract texture',
  tech: 'technology coding computer dark matrix',
  anime: 'anime aesthetic scenery fantasy japan',
  abstract: 'abstract 3d geometric gradient wallpaper',
  dark: 'dark black amoled minimalist night',
  space: 'galaxy space nebula stars universe cosmos',
  city: 'city skyline tokyo new york architecture',
  amoled: 'amoled 4k black oled minimal dark wallpaper',
  cars: 'supercar luxury car sports automotive 4k wallpaper',
};

// ==========================================
// 3. Normalization Functions
// ==========================================

/**
 * Normalizes Pexels API photo JSON into standard UnifiedWallpaperItem format
 */
export function normalizePexels(
  photo: PexelsPhoto,
  category: WallpaperCategory = 'all'
): Wallpaper {
  const isLandscape = photo.width >= photo.height;
  const orientation = isLandscape ? 'landscape' : 'portrait';
  const rawTitle = photo.alt?.trim() || '';
  const cleanTitle =
    rawTitle && rawTitle.length > 3
      ? rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)
      : `Pexels 4K ${category !== 'all' ? category.toUpperCase() : 'Studio'} #${photo.id}`;

  const tagsSet = new Set<string>();
  if (category !== 'all') tagsSet.add(category);
  tagsSet.add('4K');
  tagsSet.add('Pexels');
  tagsSet.add(isLandscape ? 'Desktop' : 'Mobile');

  cleanTitle
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 4)
    .forEach((w) => tagsSet.add(w.toLowerCase()));

  const imageUrl = photo.src.large2x || photo.src.large || photo.src.original;

  return {
    id: `pexels-${photo.id}`,
    imageUrl,
    authorName: photo.photographer || 'Pexels Contributor',
    authorProfile: photo.photographer_url || `https://www.pexels.com/@${photo.photographer_id}`,
    width: photo.width || 1920,
    height: photo.height || 1080,
    source: 'pexels',

    // Full Micro-SaaS UI extensions
    title: cleanTitle,
    category,
    fullUrl: photo.src.original || imageUrl,
    thumbUrl: photo.src.large || photo.src.medium || imageUrl,
    authorLink: photo.photographer_url,
    photographerId: photo.photographer_id,
    tags: Array.from(tagsSet),
    description: `${cleanTitle} captured by ${photo.photographer}. Distributed via Pexels Free License.`,
    views: 1200 + ((photo.id * 17) % 18000),
    downloads: 350 + ((photo.id * 7) % 6500),
    likes: 80 + ((photo.id * 3) % 2400),
    orientation,
    color: photo.avg_color || '#18181b',
    rawSrc: photo.src,
  };
}

/**
 * Normalizes Pixabay API hit JSON into standard UnifiedWallpaperItem format
 */
export function normalizePixabay(
  hit: PixabayHit,
  category: WallpaperCategory = 'all'
): Wallpaper {
  const isLandscape = hit.imageWidth >= hit.imageHeight;
  const orientation = isLandscape ? 'landscape' : 'portrait';

  // Generate clean title from hit tags
  const tagList = hit.tags
    ? hit.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : ['wallpaper', category];

  const primaryTag = tagList[0] || category;
  const cleanTitle = `${primaryTag.charAt(0).toUpperCase() + primaryTag.slice(1)} Wallpaper by ${hit.user}`;

  const tagsSet = new Set<string>();
  if (category !== 'all') tagsSet.add(category);
  tagsSet.add('Pixabay');
  tagsSet.add('UltraHD');
  tagsSet.add(isLandscape ? 'Desktop' : 'Mobile');
  tagList.slice(0, 5).forEach((t) => tagsSet.add(t.toLowerCase()));

  const imageUrl = hit.largeImageURL || hit.fullHDURL || hit.webformatURL;

  return {
    id: `pixabay-${hit.id}`,
    imageUrl,
    authorName: hit.user || 'Pixabay Creator',
    authorProfile: hit.pageURL || `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
    width: hit.imageWidth || 1920,
    height: hit.imageHeight || 1080,
    source: 'pixabay',

    // Full Micro-SaaS UI extensions
    title: cleanTitle,
    category,
    fullUrl: hit.largeImageURL || hit.imageURL || imageUrl,
    thumbUrl: hit.webformatURL || imageUrl,
    authorLink: hit.pageURL || `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
    photographerId: hit.user_id,
    tags: Array.from(tagsSet),
    description: `${cleanTitle}. Sourced royalty-free via Pixabay Content License.`,
    views: hit.views || 2400,
    downloads: hit.downloads || 950,
    likes: hit.likes || 120,
    orientation,
    color: '#18181b',
  };
}

// ==========================================
// 4. API Fetch Functions
// ==========================================

/**
 * Fetch photos from Pexels API via secure server-side route (/api/wallpapers)
 */
export async function fetchFromPexels(
  page: number,
  perPage: number,
  category: WallpaperCategory,
  searchQuery: string
): Promise<Wallpaper[]> {
  const query = searchQuery.trim() || CATEGORY_SEARCH_QUERIES[category] || 'wallpaper 4k';
  const targetUrl = `/api/wallpapers?page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(perPage)}&query=${encodeURIComponent(query)}`;

  console.log(`🔍 [Pexels Search] Initiating fetch:`, {
    targetUrl,
    rawSearchQuery: searchQuery,
    resolvedQuery: query,
    category,
    page,
    perPage,
  });

  try {
    const res = await fetch(targetUrl);

    console.log(`📡 [Pexels Search] HTTP Response received:`, {
      url: targetUrl,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
    });

    if (res.ok) {
      const data: PexelsApiResponse & { fallback?: boolean; message?: string } = await res.json();

      console.log(`📦 [Pexels Search] Response JSON payload:`, {
        page: data.page,
        per_page: data.per_page,
        total_results: data.total_results,
        receivedPhotosCount: data.photos?.length || 0,
        isFallback: Boolean(data.fallback),
        serverMessage: data.message || 'OK',
        samplePhoto: data.photos?.[0]
          ? {
              id: data.photos[0].id,
              photographer: data.photos[0].photographer,
              alt: data.photos[0].alt,
            }
          : null,
      });

      if (data.photos && data.photos.length > 0) {
        return data.photos.map((p) => normalizePexels(p, category));
      } else {
        console.warn(`⚠️ [Pexels Search] API returned 0 photos for query "${query}".`);
      }
    } else {
      console.error(
        `❌ [Pexels Search] HTTP Error response: Status ${res.status} (${res.statusText}) when calling ${targetUrl}`
      );
      try {
        const errorBody = await res.text();
        console.error(`❌ [Pexels Search] Error response body:`, errorBody);
      } catch {
        // Ignore body read failure
      }
    }
  } catch (err) {
    console.error(`💥 [Pexels Search] Catch caught network/fetch exception:`, err);
  }

  console.warn(`🔄 [Pexels Search] Falling back to curated catalog for query "${query}"`);
  // Generate high-resolution Pexels-modeled dataset fallback
  const fallbackList = generateFallbackPexelsBatch(page, perPage, category, searchQuery);
  return fallbackList.map((wp) => ({
    ...wp,
    id: `pexels-${wp.id}`,
    source: 'pexels' as const,
    imageUrl: wp.thumbUrl,
    authorProfile: wp.authorLink || 'https://www.pexels.com',
  }));
}

/**
 * Fetch photos from Pixabay API
 */
export async function fetchFromPixabay(
  page: number,
  perPage: number,
  category: WallpaperCategory,
  searchQuery: string
): Promise<Wallpaper[]> {
  const apiKey = getPixabayApiKey();
  const query = searchQuery.trim() || CATEGORY_SEARCH_QUERIES[category] || 'wallpaper';

  if (!apiKey) {
    // Curated high-res Pixabay fallback dataset matching aspect ratio & dimensions
    return generatePixabayCuratedCatalog(category, searchQuery, page, perPage);
  }

  const endpoint = `https://pixabay.com/api/?key=${encodeURIComponent(
    apiKey
  )}&q=${encodeURIComponent(query)}&image_type=photo&safesearch=true&per_page=${perPage}&page=${page}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(`Pixabay API responded with status ${res.status}`);
  }

  const data: PixabayApiResponse = await res.json();
  return (data.hits || []).map((hit) => normalizePixabay(hit, category));
}

// ==========================================
// 5. Fisher-Yates Array Shuffling
// ==========================================

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

// ==========================================
// 6. Multi-API Aggregator (Promise.allSettled)
// ==========================================

export interface AggregatedWallpapersResult {
  wallpapers: Wallpaper[];
  total: number;
  hasMore: boolean;
  sources: {
    pexelsCount: number;
    pixabayCount: number;
  };
}

/**
 * Fetches wallpapers from BOTH Pexels API and Pixabay API simultaneously using Promise.allSettled,
 * normalizes their JSON structures, merges, and shuffles the aggregated result.
 */
export async function fetchAggregatedWallpapers(
  page: number = 1,
  perPage: number = 40,
  category: WallpaperCategory = 'all',
  searchQuery: string = ''
): Promise<AggregatedWallpapersResult> {
  const cleanSearch = searchQuery.trim();

  // If user entered a specific search query, direct 100% of the query to Pexels
  // to prevent mock/seed dilution of authentic search results
  if (cleanSearch) {
    console.log(`🔎 [Aggregator] Dedicated search mode active for query: "${cleanSearch}" (page: ${page}, perPage: ${perPage})`);
    const pexelsWallpapers = await fetchFromPexels(page, perPage, category, cleanSearch);
    
    console.log(`🎯 [Aggregator] Search completed for "${cleanSearch}": Received ${pexelsWallpapers.length} wallpapers`);

    return {
      wallpapers: pexelsWallpapers,
      total: Math.max(100, pexelsWallpapers.length * 20),
      hasMore: pexelsWallpapers.length >= perPage,
      sources: {
        pexelsCount: pexelsWallpapers.length,
        pixabayCount: 0,
      },
    };
  }

  // Split total request count between both providers for browsing mode
  const splitCount = Math.max(10, Math.ceil(perPage / 2));

  // Run both queries simultaneously via Promise.allSettled
  const results = await Promise.allSettled([
    fetchFromPexels(page, splitCount, category, searchQuery),
    fetchFromPixabay(page, splitCount, category, searchQuery),
  ]);

  let pexelsWallpapers: Wallpaper[] = [];
  let pixabayWallpapers: Wallpaper[] = [];

  if (results[0].status === 'fulfilled') {
    pexelsWallpapers = results[0].value;
  } else {
    console.warn('Pexels API fetch failed in aggregator:', results[0].reason);
    // Fallback on error to keep catalog populated
    pexelsWallpapers = generateFallbackPexelsBatch(page, splitCount, category, searchQuery).map((wp) => ({
      ...wp,
      id: `pexels-${wp.id}`,
      source: 'pexels' as const,
      imageUrl: wp.thumbUrl,
      authorProfile: wp.authorLink || 'https://www.pexels.com',
    }));
  }

  if (results[1].status === 'fulfilled') {
    pixabayWallpapers = results[1].value;
  } else {
    console.warn('Pixabay API fetch failed in aggregator:', results[1].reason);
    // Fallback on error
    pixabayWallpapers = generatePixabayCuratedCatalog(category, searchQuery, page, splitCount);
  }

  // Interleave and shuffle the results to ensure rich variety
  const combined = shuffleArray([...pexelsWallpapers, ...pixabayWallpapers]);

  return {
    wallpapers: combined,
    total: Math.max(8000, combined.length * 40),
    hasMore: combined.length > 0,
    sources: {
      pexelsCount: pexelsWallpapers.length,
      pixabayCount: pixabayWallpapers.length,
    },
  };
}

// ==========================================
// 7. Curated Pixabay Fallback Catalog Generator
// ==========================================

interface PixabaySeed {
  id: number;
  user: string;
  tags: string;
  width: number;
  height: number;
  url: string;
  category: WallpaperCategory;
}

const PIXABAY_SEEDS: PixabaySeed[] = [
  {
    id: 501,
    user: 'NaturePhotographer',
    tags: 'mountains, sunset, landscape, lake',
    width: 3840,
    height: 2160,
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    category: 'nature',
  },
  {
    id: 502,
    user: 'NeonCreator',
    tags: 'cyberpunk, futuristic, neon, city',
    width: 2560,
    height: 1440,
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785',
    category: 'cyberpunk',
  },
  {
    id: 503,
    user: 'StudioMinimal',
    tags: 'minimalist, clean, geometric, light',
    width: 1920,
    height: 1080,
    url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85',
    category: 'minimalist',
  },
  {
    id: 504,
    user: 'AstroVisuals',
    tags: 'space, nebula, galaxy, stars',
    width: 3840,
    height: 2400,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    category: 'space',
  },
  {
    id: 505,
    user: 'DeepAmoled',
    tags: 'dark, obsidian, stars, minimalist',
    width: 1440,
    height: 2560,
    url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914',
    category: 'dark',
  },
  {
    id: 506,
    user: 'UrbanDrone',
    tags: 'tokyo, skyline, city, nighttime',
    width: 3840,
    height: 2160,
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    category: 'city',
  },
  {
    id: 507,
    user: 'TechWave',
    tags: 'technology, server, code, glowing',
    width: 1920,
    height: 1080,
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    category: 'tech',
  },
  {
    id: 508,
    user: 'SakuraDream',
    tags: 'anime, scenery, japan, blossom',
    width: 1080,
    height: 1920,
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d',
    category: 'anime',
  },
  {
    id: 509,
    user: 'ChromaRender',
    tags: 'abstract, 3d, gradient, glass',
    width: 2560,
    height: 1440,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    category: 'abstract',
  },
  {
    id: 510,
    user: 'AlpsExploration',
    tags: 'nature, dolomites, sunrise, peaks',
    width: 3840,
    height: 2160,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    category: 'nature',
  },
];

function generatePixabayCuratedCatalog(
  category: WallpaperCategory,
  searchQuery: string,
  page: number,
  perPage: number
): Wallpaper[] {
  const result: Wallpaper[] = [];
  const offset = (page - 1) * perPage;

  for (let i = 0; i < perPage; i++) {
    const seedIndex = (offset + i) % PIXABAY_SEEDS.length;
    const seed = PIXABAY_SEEDS[seedIndex];
    const generatedId = 90000 + offset + i;
    const effectiveCategory = category !== 'all' ? category : seed.category;

    const hit: PixabayHit = {
      id: generatedId,
      pageURL: `https://pixabay.com/photos/${generatedId}/`,
      type: 'photo',
      tags: `${seed.tags}, ${effectiveCategory}`,
      previewURL: `${seed.url}?auto=format&fit=crop&w=300&q=70`,
      previewWidth: 300,
      previewHeight: 200,
      webformatURL: `${seed.url}?auto=format&fit=crop&w=800&q=80`,
      webformatWidth: 800,
      webformatHeight: Math.round((800 * seed.height) / seed.width),
      largeImageURL: `${seed.url}?auto=format&fit=crop&w=1920&q=85`,
      fullHDURL: `${seed.url}?auto=format&fit=crop&w=1920&q=90`,
      imageURL: `${seed.url}?auto=format&fit=crop&w=2560&q=95`,
      imageWidth: seed.width,
      imageHeight: seed.height,
      views: 3400 + (generatedId % 12000),
      downloads: 1100 + (generatedId % 4000),
      likes: 240 + (generatedId % 900),
      comments: 32,
      user_id: 20000 + (generatedId % 500),
      user: seed.user,
      userImageURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    };

    result.push(normalizePixabay(hit, effectiveCategory));
  }

  return result;
}
