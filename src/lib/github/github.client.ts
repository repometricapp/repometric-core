import { config } from '@/lib/config';

/**
 * In-memory log of GitHub API calls.
 *
 * Reset on every server request.
 */
export const githubApiCalls: {
  endpoint: string;
  status: 'ok' | 'error';
  code: number;
  message?: string;
}[] = [];

/**
 * Stores the most recent GitHub API rate limit information.
 */
export let githubRateLimit: {
  limit: number;
  remaining: number;
  reset: number;
} | null = null;

/**
 * Custom error class for GitHub API failures.
 */
export class GitHubApiError extends Error {
  status: number;
  endpoint: string;

  constructor(status: number, endpoint: string, message: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Default headers used for all GitHub API requests.
 *
 * Includes authentication token if available for private repo access.
 */
const defaultHeaders: HeadersInit = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }),
};

/**
 * Core GitHub request wrapper.
 *
 * - Public, unauthenticated requests
 * - Captures rate limits
 * - Logs all calls
 * - Throws typed errors
 */
export async function githubRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${config.github.apiBaseUrl}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...init.headers,
    },
    next: { revalidate: 60 },
  });

  // Capture rate limit info if present
  githubRateLimit = {
    limit: Number(res.headers.get('x-ratelimit-limit')) || 0,
    remaining: Number(res.headers.get('x-ratelimit-remaining')) || 0,
    reset: Number(res.headers.get('x-ratelimit-reset')) || 0,
  };

  // Handle error responses
  if (!res.ok) {
    const message = await res.text();

    githubApiCalls.push({
      endpoint: path,
      status: 'error',
      code: res.status,
      message,
    });

    throw new GitHubApiError(res.status, path, message);
  }

  // Log success
  githubApiCalls.push({
    endpoint: path,
    status: 'ok',
    code: res.status,
  });

  return res.json() as Promise<T>;
}

/**
 * Fetch current GitHub API rate limit information.
 * Makes a request to /rate_limit endpoint to get real-time data.
 */
export async function fetchRateLimitInfo() {
  try {
    const data = await githubRequest<{
      rate_limit: {
        limit: number;
        remaining: number;
        reset: number;
      };
    }>('/rate_limit');

    if (data.rate_limit) {
      githubRateLimit = {
        limit: data.rate_limit.limit,
        remaining: data.rate_limit.remaining,
        reset: data.rate_limit.reset,
      };
    }

    return githubRateLimit;
  } catch (error) {
    console.error('Failed to fetch rate limit:', error);
    return githubRateLimit;
  }
}
