/**
 * Next.js App Router API Route: High-Resolution Wallpaper Download Proxy
 * Route: /api/download?url=...&filename=...
 * 
 * Capabilities:
 * - Server-side fetch with bypass for 403 Forbidden (Wallhaven, Pixabay, Pexels, Unsplash referer checks)
 * - Returns a native binary stream with Content-Disposition: attachment
 * - Preserves authentic, uncompressed 4K master quality
 */

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url')?.trim();
    let filename = searchParams.get('filename')?.trim() || 'PixelDrop-4K.jpg';

    if (!targetUrl) {
      return Response.json(
        { error: 'Missing "url" query parameter for download proxy.' },
        { status: 400 }
      );
    }

    // Build headers to overcome 403 Forbidden restrictions (Wallhaven, etc.)
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

    console.log(`[Download Proxy] Fetching 4K master: ${targetUrl}`);

    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    if (!upstream.ok) {
      console.error(`[Download Proxy] Upstream returned HTTP ${upstream.status} for ${targetUrl}`);
      // Fallback: If forbidden on one attempt, try without referer
      if (upstream.status === 403 && headers['Referer']) {
        const retryRes = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'User-Agent': headers['User-Agent'],
            Accept: headers['Accept'],
          },
        });
        if (retryRes.ok && retryRes.body) {
          return createStreamResponse(retryRes, filename);
        }
      }

      return Response.json(
        { error: `Upstream image server returned HTTP ${upstream.status}` },
        { status: upstream.status }
      );
    }

    if (!upstream.body) {
      return Response.json(
        { error: 'Upstream response contained no image body' },
        { status: 502 }
      );
    }

    return createStreamResponse(upstream, filename);
  } catch (error) {
    console.error('[Download Proxy] Unexpected error while proxying image stream:', error);
    return Response.json(
      { error: 'Internal Server Error during image download streaming' },
      { status: 500 }
    );
  }
}

function createStreamResponse(upstreamResponse: globalThis.Response, preferredFilename: string): Response {
  const contentType = upstreamResponse.headers.get('content-type') || 'image/jpeg';
  const contentLength = upstreamResponse.headers.get('content-length');

  // Ensure filename extension matches content-type
  let safeFilename = preferredFilename;
  if (contentType.includes('png') && !safeFilename.endsWith('.png')) {
    safeFilename = safeFilename.replace(/\.[a-zA-Z0-9]+$/, '') + '.png';
  } else if (contentType.includes('webp') && !safeFilename.endsWith('.webp')) {
    safeFilename = safeFilename.replace(/\.[a-zA-Z0-9]+$/, '') + '.webp';
  } else if (contentType.includes('jpeg') && !safeFilename.endsWith('.jpg') && !safeFilename.endsWith('.jpeg')) {
    safeFilename = safeFilename.replace(/\.[a-zA-Z0-9]+$/, '') + '.jpg';
  }

  const responseHeaders: Record<string, string> = {
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${encodeURIComponent(safeFilename)}"`,
    'Cache-Control': 'public, max-age=86400',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (contentLength) {
    responseHeaders['Content-Length'] = contentLength;
  }

  return new Response(upstreamResponse.body, {
    status: 200,
    headers: responseHeaders,
  });
}
