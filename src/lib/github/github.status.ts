import { config } from '@/lib/config';
import { getRepositories, getLastCommit } from './github.repos';
import { getLatestWorkflowRun } from './github.actions';
import { getBranches } from './github.branches';
import { getOpenPullRequests } from './github.pulls';
import { getOpenIssues } from './github.issues';
import { GitHubApiError } from './github.client';

/**
 * Aggregates GitHub repository health and status information
 * for a single user or organization (Phase 1).
 *
 * Data collected per repository:
 * - Branches and default branch
 * - Most recent commit date
 * - Latest GitHub Actions workflow run
 * - Open pull requests and issues (presence-based)
 *
 * Public repositories only.
 */
export async function getGitHubStatus() {
  const owner = config.github.owner;

  // Fetch all public repositories for the configured owner
  const repos = await getRepositories(owner);

  // Process each repository in parallel
  return Promise.all(
    repos.map(async (repo) => {
      let buildErrorCode = null;
      let buildErrorMessage = null;

      // Fetch the most recent commit on the default branch
      const commits = await getLastCommit(owner, repo.name, repo.default_branch);
      const lastCommit = commits?.[0];

      // Attempt to fetch the latest GitHub Actions workflow run
      // Workflow access may fail if Actions are disabled for the repo
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
      // Failures are tolerated and treated as empty results
      const branches = await getBranches(owner, repo.name).catch(() => []);
      const pulls = await getOpenPullRequests(owner, repo.name).catch(() => []);
      const issues = await getOpenIssues(owner, repo.name).catch(() => []);

      return {
        // Repository metadata
        repo: repo.name,
        visibility: repo.private ? 'private' : 'public',
        defaultBranch: repo.default_branch,

        // Branch information
        branchCount: branches.length,
        branches: branches.map((b) => b.name),

        // Commit information
        lastCommitDate: lastCommit?.commit.author.date ?? null,

        // Build / workflow information
        lastBuildStatus: workflow?.workflow_runs?.[0]?.conclusion ?? 'unknown',
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
