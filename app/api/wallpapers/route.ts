/**
 * PixelDrop - Secure Server-Side Pexels Wallpaper Proxy
 * Route: /api/wallpapers
 * 
 * Securely proxies requests to the Pexels API using the server-side PEXELS_API_KEY
 * environment variable. Protects developer credentials from ever being exposed to
 * the client browser's DOM, bundle, or Network tab.
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || searchParams.get('perPage') || '40';

    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: 'PEXELS_API_KEY is not configured on the server.',
          page: Number(page),
          per_page: Number(perPage),
          photos: [],
          total_results: 0,
        },
        { status: 500 }
      );
    }

    // Curated default on homepage vs Search query endpoint
    const endpoint = query
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
      : `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: apiKey.trim(),
      },
    });

    if (!res.ok) {
      return Response.json(
        {
          error: `Pexels API responded with status ${res.status}`,
          status: res.status,
          page: Number(page),
          per_page: Number(perPage),
          photos: [],
          total_results: 0,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return Response.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Pexels Wallpaper Route Handler Error:', error);
    return Response.json(
      {
        error: 'Internal server error while fetching wallpapers.',
        photos: [],
        total_results: 0,
      },
      { status: 500 }
    );
  }
}
