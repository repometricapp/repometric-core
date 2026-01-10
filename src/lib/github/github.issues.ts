import { githubRequest } from './github.client';

/**
 * Fetches open issues for a GitHub repository.
 *
 * Note:
 * - Pull requests are also returned by this endpoint
 *   unless explicitly filtered out.
 * - `per_page=1` is used to minimize payload size when
 *   only presence or count-related signals are needed.
 *
 * @param owner - GitHub username or organization name
 * @param repo  - Repository name
 * @returns     - Array containing the most recent open issue (if any)
 */
export async function getOpenIssues(owner: string, repo: string) {
  return githubRequest<any[]>(
    // GitHub Issues API endpoint
    `/repos/${owner}/${repo}/issues?state=open&per_page=1`
  );
}
