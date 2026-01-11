import { githubRequest } from './github.client';
import { GitHubRepository, GitHubCommit } from './github.types';

/**
 * Fetches all public repositories for a GitHub organization.
 *
 * @param org - GitHub organization name
 * @returns   - List of public repositories owned by the organization
 */
export function getOrgRepositories(org: string) {
  return githubRequest<GitHubRepository[]>(`/orgs/${org}/repos?per_page=100`);
}

/**
 * Fetches all public repositories for a GitHub user.
 *
 * @param user - GitHub username
 * @returns    - List of public repositories owned by the user
 */
export function getUserRepositories(user: string) {
  return githubRequest<GitHubRepository[]>(`/users/${user}/repos?per_page=100`);
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
  return githubRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`);
}
