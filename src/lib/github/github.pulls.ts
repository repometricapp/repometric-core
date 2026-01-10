import { githubRequest } from './github.client';

export async function getOpenPullRequests(owner: string, repo: string) {
  return githubRequest<any[]>(`/repos/${owner}/${repo}/pulls?state=open&per_page=1`);
}
