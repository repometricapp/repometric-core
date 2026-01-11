import { config } from '@/lib/config';
import { getOrgRepositories, getUserRepositories, getLastCommit } from './github.repos';
import { getLatestWorkflowRun } from './github.actions';
import { getBranches } from './github.branches';
import { getOpenPullRequests } from './github.pulls';
import { getOpenIssues } from './github.issues';
import { GitHubApiError } from './github.client';

/**
 * Aggregates GitHub repository health and status information
 * for a single organization, single user, or both (Phase 1).
 *
 * Public repositories only.
 */
export async function getGitHubStatus() {
  const { mode, organization, user } = config.github.state();

  // Nothing configured → nothing to fetch
  if (mode === 'none') {
    return [];
  }

  const allRepos: Array<{ repo: any; owner: string }> = [];

  // Fetch org repositories
  if ((mode === 'org-only' || mode === 'org-and-user') && organization) {
    const orgRepos = await getOrgRepositories(organization);
    orgRepos.forEach((repo) => {
      allRepos.push({ repo, owner: organization });
    });
  }

  // Fetch user repositories
  if ((mode === 'user-only' || mode === 'org-and-user') && user) {
    const userRepos = await getUserRepositories(user);
    userRepos.forEach((repo) => {
      allRepos.push({ repo, owner: user });
    });
  }

  // Process each repository in parallel
  return Promise.all(
    allRepos.map(async ({ repo, owner }) => {
      let buildErrorCode: number | null = null;
      let buildErrorMessage: string | null = null;

      // Fetch the most recent commit on the default branch
      const commits = await getLastCommit(owner, repo.name, repo.default_branch);
      const lastCommit = commits?.[0];

      // Attempt to fetch the latest GitHub Actions workflow run
      let workflow = null;
      try {
        workflow = await getLatestWorkflowRun(owner, repo.name);
      } catch (err) {
        if (err instanceof GitHubApiError) {
          buildErrorCode = err.status;
          buildErrorMessage = err.message;
        }
      }

      // Fetch repository branches, pull requests, and issues
      const branches = await getBranches(owner, repo.name).catch(() => []);
      const pulls = await getOpenPullRequests(owner, repo.name).catch(() => []);
      const issues = await getOpenIssues(owner, repo.name).catch(() => []);

      return {
        // Repository metadata
        repo: repo.name,
        visibility: repo.private ? 'private' : 'public',
        defaultBranch: repo.default_branch,
        owner, // 👈 important for combined mode

        // Branch information
        branchCount: branches.length,
        branches: branches.map((b) => b.name),

        // Commit information
        lastCommitDate: lastCommit?.commit.author.date ?? null,

        // Build / workflow information
        lastBuildStatus: workflow?.workflow_runs?.[0]?.conclusion ?? 'no builds',
        lastBuildTime: workflow?.workflow_runs?.[0]?.updated_at ?? null,
        buildErrorCode,
        buildErrorMessage,

        // Issue and pull request signals
        openPullRequests: pulls.length,
        openIssues: issues.length,
      };
    })
  );
}
