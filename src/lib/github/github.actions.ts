import { githubRequest } from './github.client';
import { GitHubWorkflowRun } from './github.types';

export function getLatestWorkflowRun(owner: string, repo: string) {
  return githubRequest<{ workflow_runs: GitHubWorkflowRun[] }>(
    `/repos/${owner}/${repo}/actions/runs?per_page=1`
  );
}
