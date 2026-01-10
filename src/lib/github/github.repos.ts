import { githubRequest } from './github.client';
import { GitHubRepository, GitHubCommit } from './github.types';

/**
 * Fetches all public repositories for a given GitHub user or organization.
 *
 * @param owner - GitHub username or organization name
 * @returns     - List of public repositories owned by the user or organization
 */
export function getRepositories(owner: string) {
  return githubRequest<GitHubRepository[]>(
    // GitHub API endpoint for listing user or org repositories
    // `per_page=100` is the maximum allowed per request
    `/users/${owner}/repos?per_page=100`
  );
}

/**
 * Fetches the most recent commit for a specific branch in a repository.
 *
 * @param owner  - GitHub username or organization name
 * @param repo   - Repository name
 * @param branch - Branch name (e.g. main, master)
 * @returns      - Array containing the most recent commit for the branch
 */
export function getLastCommit(owner: string, repo: string, branch: string) {
  return githubRequest<GitHubCommit[]>(
    // GitHub API endpoint for listing commits by branch
    // `per_page=1` limits the response to the most recent commit
    `/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`
  );
}
