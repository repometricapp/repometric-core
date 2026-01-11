import { fetchRateLimitInfo } from '@/lib/github/github.client';

export async function GET() {
  const rateLimit = await fetchRateLimitInfo();

  return Response.json({
    limit: rateLimit?.limit ?? 60,
    remaining: rateLimit?.remaining ?? 60,
    reset: rateLimit?.reset ?? Math.floor(Date.now() / 1000) + 3600,
  });
}
