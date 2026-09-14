/**
 * Vercel Serverless Function: High-Resolution Wallpaper Download Proxy
 * Route: /api/download?url=...&filename=...
 */

export default async function handler(req: any, res: any) {
  try {
    const targetUrl = (req.query?.url || '') as string;
    const filename = (req.query?.filename || 'PixelDrop-4K.jpg') as string;

    if (!targetUrl) {
      return res.status(400).send('Missing url parameter');
    }

    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      return res.redirect(targetUrl);
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Error in /api/download handler:', err);
    return res.redirect((req.query?.url as string) || '/');
  }
}
