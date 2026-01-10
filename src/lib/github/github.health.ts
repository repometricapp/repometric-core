import { githubApiCalls, githubRateLimit } from './github.client';

/**
 * Returns the current GitHub API health information.
 *
 * Includes:
 * - A list of recent API calls made during the request lifecycle
 * - The latest known GitHub rate limit state
 *
 * Used primarily for status, diagnostics, and debugging views.
 */
export function getGitHubApiHealth() {
  return {
    calls: githubApiCalls,
    rateLimit: githubRateLimit,
  };
}
