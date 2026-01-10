import { githubRequest } from './github.client';
import { GitHubWorkflowRun } from './github.types';

/**
 * Fetches the most recent GitHub Actions workflow run for a repository.
 *
 * @param owner - GitHub username or organization name
 * @param repo  - Repository name
 * @returns     - The latest workflow run wrapped in the GitHub API response shape
 */
export function getLatestWorkflowRun(owner: string, repo: string) {
  return githubRequest<{ workflow_runs: GitHubWorkflowRun[] }>(
    // GitHub Actions API endpoint
    // `per_page=1` limits the response to the most recent run
    `/repos/${owner}/${repo}/actions/runs?per_page=1`
  );
}
