import { githubRequest } from './github.client';

export async function getOpenIssues(owner: string, repo: string) {
  return githubRequest<any[]>(`/repos/${owner}/${repo}/issues?state=open&per_page=1`);
}
