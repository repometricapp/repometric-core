import { githubRequest } from './github.client';

export interface GitHubBranch {
  name: string;
}

export async function getBranches(owner: string, repo: string) {
  return githubRequest<GitHubBranch[]>(`/repos/${owner}/${repo}/branches?per_page=100`);
}
