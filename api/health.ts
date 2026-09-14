interface VercelReq {
  method?: string;
}

interface VercelRes {
  status: (code: number) => VercelRes;
  json: (data: unknown) => VercelRes;
}

export default function handler(req: VercelReq, res: VercelRes) {
  const hasPexelsKey = Boolean(process.env.PEXELS_API_KEY);
  return res.status(200).json({
    status: 'ok',
    environment: 'vercel-serverless',
    hasPexelsKey,
    timestamp: new Date().toISOString(),
  });
}
