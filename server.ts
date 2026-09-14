import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Secure Server-Side Pexels API Proxy
  // API key is strictly read from process.env.PEXELS_API_KEY on the server
  app.get('/api/wallpapers', async (req, res) => {
    try {
      const query = (req.query.query as string)?.trim() || '';
      const category = (req.query.category as string)?.trim() || '';
      const page = req.query.page || '1';
      const perPage = req.query.per_page || req.query.perPage || '40';

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

      const qLower = query.toLowerCase();
      const cLower = category.toLowerCase();
      const isWallhaven =
        cLower === 'anime' ||
        cLower === 'fantasy' ||
        cLower === 'cyberpunk' ||
        wallhavenKeywords.some((kw) => qLower.includes(kw) || cLower.includes(kw));

      // 1. Wallhaven Branch
      if (isWallhaven) {
        const wallhavenQuery = query || category || 'anime';
        const wallhavenApiKey = process.env.WALLHAVEN_API_KEY?.trim() || '';
        const apiKeyParam = wallhavenApiKey ? `apikey=${encodeURIComponent(wallhavenApiKey)}&` : '';
        const wallhavenUrl = `https://wallhaven.cc/api/v1/search?${apiKeyParam}q=${encodeURIComponent(
          wallhavenQuery
        )}&purity=100&sorting=random&page=${encodeURIComponent(page as string)}`;

        console.log(`[Express /api/wallpapers] Routing to Wallhaven: ${wallhavenUrl}`);

        try {
          const upstream = await fetch(wallhavenUrl, {
            headers: {
              'User-Agent': 'PixelDrop-WallpaperApp/2.0',
              Accept: 'application/json',
            },
          });

          if (upstream.ok) {
            const data: any = await upstream.json();
            const items = data.data || [];

            const normalizedWallpapers = items.map((item: any) => {
              const width = Number(item.dimension_x) || 1920;
              const height = Number(item.dimension_y) || 1080;
              const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';
              const highResUrl = item.path || item.url || '';
              const thumbUrl = item.thumbs?.large || item.thumbs?.small || highResUrl;

              return {
                id: `wallhaven-${item.id}`,
                url: highResUrl,
                thumbnail: thumbUrl,
                source: 'wallhaven' as const,
                title: `${String(wallhavenQuery).charAt(0).toUpperCase() + String(wallhavenQuery).slice(1)} Illustration 4K`,
                authorName: 'Wallhaven Artist',
                authorProfile: item.url || 'https://wallhaven.cc',
                width,
                height,
                category: category || item.category || 'anime',
                orientation,
                src: {
                  original: highResUrl,
                  large2x: highResUrl,
                  large: thumbUrl,
                  medium: thumbUrl,
                  small: item.thumbs?.small || thumbUrl,
                  portrait: thumbUrl,
                  landscape: highResUrl,
                  tiny: item.thumbs?.small || thumbUrl,
                },
              };
            });

            const legacyPhotos = normalizedWallpapers.map((w: any) => ({
              id: w.id,
              url: w.url,
              photographer: w.authorName,
              photographer_url: w.authorProfile || '',
              photographer_id: 0,
              width: w.width,
              height: w.height,
              src: w.src,
              alt: w.title,
            }));

            res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
            return res.json({
              page: Number(page),
              per_page: Number(perPage),
              total_results: data.meta?.total || normalizedWallpapers.length,
              source: 'wallhaven',
              wallpapers: normalizedWallpapers,
              photos: legacyPhotos,
            });
          }
        } catch (whErr) {
          console.error('[Express /api/wallpapers] Wallhaven error, falling back to Pexels:', whErr);
        }
      }

      // 2. Pexels Branch
      const apiKey = process.env.PEXELS_API_KEY;

      console.log(`[Express /api/wallpapers] Query: "${query}", Page: ${page}, PerPage: ${perPage}, HasKey: ${Boolean(apiKey)}`);

      if (!apiKey) {
        console.warn('[Express /api/wallpapers] No PEXELS_API_KEY found, returning fallback response');
        return res.status(200).json({
          page: Number(page),
          per_page: Number(perPage),
          photos: [],
          wallpapers: [],
          total_results: 0,
          fallback: true,
          source: 'pexels',
          message: 'PEXELS_API_KEY not configured on server',
        });
      }

      const pexelsQuery = query || (category && category !== 'all' ? category : '');
      const endpoint = pexelsQuery
        ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&page=${page}&per_page=${perPage}`
        : `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;

      console.log(`[Express /api/wallpapers] Calling upstream: ${endpoint}`);

      const upstream = await fetch(endpoint, {
        headers: {
          Authorization: apiKey.trim(),
        },
      });

      if (!upstream.ok) {
        console.error(`[Express /api/wallpapers] Upstream error: ${upstream.status} ${upstream.statusText}`);
        return res.status(upstream.status).json({
          status: upstream.status,
          photos: [],
          wallpapers: [],
          total_results: 0,
          fallback: true,
        });
      }

      const data: any = await upstream.json();
      const photos = data.photos || [];

      const normalizedWallpapers = photos.map((photo: any) => {
        const width = Number(photo.width) || 1920;
        const height = Number(photo.height) || 1080;
        const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';
        const highResUrl = photo.src?.original || photo.src?.large2x || photo.url || '';
        const thumbUrl = photo.src?.large || photo.src?.medium || highResUrl;

        return {
          id: `pexels-${photo.id}`,
          url: highResUrl,
          thumbnail: thumbUrl,
          source: 'pexels' as const,
          title: String(photo.alt || `${pexelsQuery || 'Curated'} 4K Wallpaper`).trim(),
          authorName: String(photo.photographer || 'Pexels Creator'),
          authorProfile: String(photo.photographer_url || ''),
          width,
          height,
          category: category || 'all',
          orientation,
          src: {
            original: highResUrl,
            large2x: photo.src?.large2x || highResUrl,
            large: thumbUrl,
            medium: photo.src?.medium || thumbUrl,
            small: photo.src?.small || thumbUrl,
            portrait: photo.src?.portrait || thumbUrl,
            landscape: photo.src?.landscape || highResUrl,
            tiny: photo.src?.tiny || thumbUrl,
          },
        };
      });

      console.log(`[Express /api/wallpapers] Upstream returned ${photos.length} photos`);
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      return res.json({
        page: Number(page),
        per_page: Number(perPage),
        total_results: data.total_results || normalizedWallpapers.length,
        source: 'pexels',
        wallpapers: normalizedWallpapers,
        photos: photos,
      });
    } catch (err) {
      console.error('Express proxy error for /api/wallpapers:', err);
      return res.status(500).json({
        error: 'Server error proxying wallpapers API',
        photos: [],
        wallpapers: [],
        total_results: 0,
        fallback: true,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasPexelsKey: Boolean(process.env.PEXELS_API_KEY) });
  });

  // 2. Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
