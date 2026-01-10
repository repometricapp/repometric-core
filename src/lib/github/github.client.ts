import { config } from '@/lib/config';

/**
 * In-memory API call health log.
 * Reset on every server request (which is fine for a status page).
 */
export const githubApiCalls: {
  endpoint: string;
  status: 'ok' | 'error';
  code: number;
  message?: string;
}[] = [];

export let githubRateLimit: {
  limit: number;
  remaining: number;
  reset: number;
} | null = null;

export class GitHubApiError extends Error {
  status: number;
  endpoint: string;

  constructor(status: number, endpoint: string, message: string) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
  }
}

const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
};

if (config.github.token) {
  headers.Authorization = `Bearer ${config.github.token}`;
}

export async function githubRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${config.github.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...init.headers,
    },
    next: { revalidate: 60 },
  });

  githubRateLimit = {
    limit: Number(res.headers.get('x-ratelimit-limit')),
    remaining: Number(res.headers.get('x-ratelimit-remaining')),
    reset: Number(res.headers.get('x-ratelimit-reset')),
  };

  // ❌ Error case
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

  // ✅ Success case
  githubApiCalls.push({
    endpoint: path,
    status: 'ok',
    code: res.status,
  });

  return res.json() as Promise<T>;
}
