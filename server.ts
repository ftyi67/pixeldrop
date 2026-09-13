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
      const page = req.query.page || '1';
      const perPage = req.query.per_page || req.query.perPage || '40';

      const apiKey = process.env.PEXELS_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          page: Number(page),
          per_page: Number(perPage),
          photos: [],
          total_results: 0,
          fallback: true,
          message: 'PEXELS_API_KEY not configured on server',
        });
      }

      const endpoint = query
        ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
        : `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;

      const upstream = await fetch(endpoint, {
        headers: {
          Authorization: apiKey.trim(),
        },
      });

      if (!upstream.ok) {
        return res.status(upstream.status).json({
          status: upstream.status,
          photos: [],
          total_results: 0,
          fallback: true,
        });
      }

      const data = await upstream.json();
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      return res.json(data);
    } catch (err) {
      console.error('Express proxy error for /api/wallpapers:', err);
      return res.status(500).json({
        error: 'Server error proxying Pexels API',
        photos: [],
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
