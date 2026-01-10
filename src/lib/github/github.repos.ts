import { githubRequest } from './github.client';
import { GitHubRepository, GitHubCommit } from './github.types';

export function getRepositories(owner: string) {
  return githubRequest<GitHubRepository[]>(`/users/${owner}/repos?per_page=100`);
}

export function getLastCommit(owner: string, repo: string, branch: string) {
  return githubRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`);
}
