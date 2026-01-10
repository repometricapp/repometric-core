import { config } from '@/lib/config';

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
    next: { revalidate: 60 }, // safe default
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
