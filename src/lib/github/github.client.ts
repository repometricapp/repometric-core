import { config } from '@/lib/config';

/**
 * In-memory log of GitHub API calls.
 *
 * This is reset on every server request, which is acceptable
 * for a lightweight status/debug page in Phase 1.
 */
export const githubApiCalls: {
  endpoint: string;
  status: 'ok' | 'error';
  code: number;
  message?: string;
}[] = [];

/**
 * Stores the most recent GitHub API rate limit information.
 * Updated after every API request.
 */
export let githubRateLimit: {
  limit: number;
  remaining: number;
  reset: number;
} | null = null;

/**
 * Custom error class for GitHub API failures.
 * Provides additional context beyond the standard Error object.
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
 */
const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
};

/**
 * Attach authorization header only when a GitHub token is provided.
 * This increases rate limits but is optional in Phase 1.
 */
if (config.github.token) {
  headers.Authorization = `Bearer ${config.github.token}`;
}

/**
 * Wrapper around fetch for making GitHub API requests.
 *
 * - Handles headers and authentication
 * - Captures rate limit information
 * - Logs request success or failure
 * - Throws a typed error on failure
 *
 * @param path - GitHub API endpoint path (without base URL)
 * @param init - Optional fetch configuration
 * @returns    - Parsed JSON response typed as T
 */
export async function githubRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${config.github.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...init.headers,
    },
    // Cache and revalidate every 60 seconds (Next.js)
    next: { revalidate: 60 },
  });

  // Capture GitHub rate limit headers for observability
  githubRateLimit = {
    limit: Number(res.headers.get('x-ratelimit-limit')),
    remaining: Number(res.headers.get('x-ratelimit-remaining')),
    reset: Number(res.headers.get('x-ratelimit-reset')),
  };

  // Handle non-successful responses
  if (!res.ok) {
    const text = await res.text();

    githubApiCalls.push({
      endpoint: path,
      status: 'error',
      code: res.status,
      message: text,
    });

    throw new GitHubApiError(res.status, path, text);
  }

  // Log successful API call
  githubApiCalls.push({
    endpoint: path,
    status: 'ok',
    code: res.status,
  });

  return res.json() as Promise<T>;
}
