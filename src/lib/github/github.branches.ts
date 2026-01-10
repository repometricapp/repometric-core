import { githubRequest } from './github.client';

/**
 * Represents a GitHub repository branch.
 * Only the fields required by the application are defined.
 */
export interface GitHubBranch {
  name: string;
}

/**
 * Fetches all branches for a given GitHub repository.
 *
 * @param owner - GitHub username or organization name
 * @param repo  - Repository name
 * @returns     - List of branches for the repository
 */
export async function getBranches(owner: string, repo: string) {
  return githubRequest<GitHubBranch[]>(
    // GitHub API endpoint for repository branches
    // `per_page=100` is the maximum allowed by GitHub per request
    `/repos/${owner}/${repo}/branches?per_page=100`
  );
}
