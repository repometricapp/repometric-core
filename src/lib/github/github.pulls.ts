import { githubRequest } from './github.client';

/**
 * Fetches open pull requests for a GitHub repository.
 *
 * Note:
 * - Uses the Pull Requests API, so only PRs are returned
 *   (unlike the Issues API which includes pull requests).
 * - `per_page=1` limits the response to the most recent open PR
 *   to keep the request lightweight.
 *
 * @param owner - GitHub username or organization name
 * @param repo  - Repository name
 * @returns     - Array containing the most recent open pull request (if any)
 */
export async function getOpenPullRequests(owner: string, repo: string) {
  return githubRequest<any[]>(
    // GitHub Pull Requests API endpoint
    `/repos/${owner}/${repo}/pulls?state=open&per_page=1`
  );
}
