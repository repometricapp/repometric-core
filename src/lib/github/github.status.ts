import { config } from '@/lib/config';
import { getRepositories, getLastCommit } from './github.repos';
import { getLatestWorkflowRun } from './github.actions';
import { getBranches } from './github.branches';
import { getOpenPullRequests } from './github.pulls';
import { getOpenIssues } from './github.issues';
import { GitHubApiError } from './github.client';

export async function getGitHubStatus() {
  const owner = config.github.owner;
  const repos = await getRepositories(owner);

  return Promise.all(
    repos.map(async (repo) => {
      let buildErrorCode = null;
      let buildErrorMessage = null;

      const commits = await getLastCommit(owner, repo.name, repo.default_branch);
      const lastCommit = commits?.[0];

      let workflow = null;
      try {
        workflow = await getLatestWorkflowRun(owner, repo.name);
      } catch (err) {
        if (err instanceof GitHubApiError) {
          buildErrorCode = err.status;
          buildErrorMessage = err.message;
        }
      }

      const branches = await getBranches(owner, repo.name).catch(() => []);
      const pulls = await getOpenPullRequests(owner, repo.name).catch(() => []);
      const issues = await getOpenIssues(owner, repo.name).catch(() => []);

      return {
        repo: repo.name,
        visibility: repo.private ? 'private' : 'public',
        defaultBranch: repo.default_branch,
        branchCount: branches.length,
        branches: branches.map((b) => b.name),

        lastCommitDate: lastCommit?.commit.author.date ?? null,

        lastBuildStatus: workflow?.workflow_runs?.[0]?.conclusion ?? 'unknown',
        lastBuildTime: workflow?.workflow_runs?.[0]?.updated_at ?? null,
        buildErrorCode,
        buildErrorMessage,

        openPullRequests: pulls.length,
        openIssues: issues.length,
      };
    })
  );
}
