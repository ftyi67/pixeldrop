/**
 * Vercel Serverless Function: High-Resolution Wallpaper Download Proxy
 * Route: /api/download?url=...&filename=...
 */

export default async function handler(req: any, res: any) {
  try {
    const targetUrl = (req.query?.url || '') as string;
    let filename = (req.query?.filename || 'PixelDrop-4K.jpg') as string;

    if (!targetUrl) {
      return res.status(400).send('Missing url parameter');
    }

    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    const lowerUrl = targetUrl.toLowerCase();
    if (lowerUrl.includes('wallhaven.cc')) {
      headers['Referer'] = 'https://wallhaven.cc/';
      headers['Origin'] = 'https://wallhaven.cc';
      headers['Sec-Fetch-Dest'] = 'image';
      headers['Sec-Fetch-Mode'] = 'no-cors';
      headers['Sec-Fetch-Site'] = 'cross-site';
    } else if (lowerUrl.includes('pexels.com')) {
      headers['Referer'] = 'https://www.pexels.com/';
    } else if (lowerUrl.includes('unsplash.com')) {
      headers['Referer'] = 'https://unsplash.com/';
    } else if (lowerUrl.includes('pixabay.com')) {
      headers['Referer'] = 'https://pixabay.com/';
    }

    let upstream = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    if (!upstream.ok && upstream.status === 403 && headers['Referer']) {
      upstream = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': headers['User-Agent'],
          Accept: headers['Accept'],
        },
      });
    }

    if (!upstream.ok) {
      return res.redirect(targetUrl);
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const contentLength = upstream.headers.get('content-length');

    if (contentType.includes('png') && !filename.endsWith('.png')) {
      filename = filename.replace(/\.[a-zA-Z0-9]+$/, '') + '.png';
    } else if (contentType.includes('webp') && !filename.endsWith('.webp')) {
      filename = filename.replace(/\.[a-zA-Z0-9]+$/, '') + '.webp';
    } else if (contentType.includes('jpeg') && !filename.endsWith('.jpg') && !filename.endsWith('.jpeg')) {
      filename = filename.replace(/\.[a-zA-Z0-9]+$/, '') + '.jpg';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Error in /api/download handler:', err);
    return res.redirect((req.query?.url as string) || '/');
  }
}
